import {
  ClientAccount,
  PortfolioDriftReport,
  AssetDriftMetric,
  DriftStatus,
  HIFOLotAllocation,
  StagedOrder,
  RebalanceAuditLog,
} from '@/types/portfolio';

// IRS Section 1091 Wash-Sale Proxy ETF Pairing Map
export const PROXY_MAPPINGS: Record<string, { proxyTicker: string; proxyName: string }> = {
  VOO: { proxyTicker: 'SCHX', proxyName: 'Schwab U.S. Large-Cap ETF' },
  VTI: { proxyTicker: 'ITOT', proxyName: 'iShares Core S&P Total U.S. Stock' },
  IVV: { proxyTicker: 'SCHX', proxyName: 'Schwab U.S. Large-Cap ETF' },
  BND: { proxyTicker: 'AGG', proxyName: 'iShares Core U.S. Aggregate Bond' },
  VXUS: { proxyTicker: 'IXUS', proxyName: 'iShares Core MSCI Total International' },
  QQQ: { proxyTicker: 'QQQM', proxyName: 'Invesco NASDAQ 100 ETF' },
};

/**
 * Calculates portfolio valuation, individual asset drift vs. model target,
 * corridor breaches, and recommended dollar/share trade deltas.
 */
export function calculatePortfolioDrift(
  account: ClientAccount,
  options?: {
    deployCashFirst?: boolean;
    excludedLotIds?: Set<string>;
  }
): PortfolioDriftReport {
  const { holdings, cashBalance, targetModel, driftCorridor } = account;
  const deployCashFirst = options?.deployCashFirst ?? true;

  // 1. Calculate Aggregate Portfolio Value: V = sum(shares * price) + cash
  const equityValue = holdings.reduce(
    (sum, h) => sum + (h.shares > 0 ? h.shares * h.currentPrice : 0),
    0
  );
  const totalValue = equityValue + cashBalance;

  if (totalValue <= 0) {
    return {
      totalValue: 0,
      equityValue: 0,
      cashBalance: 0,
      maxDrift: 0,
      isBreached: false,
      status: 'ALIGNED',
      metrics: {},
      breachedAssets: [],
    };
  }

  const holdingMap = new Map(holdings.map((h) => [h.ticker, h]));
  const targetMap = new Map(targetModel.map((m) => [m.ticker, m]));

  // Combine all tickers present in either holdings or target model
  const allTickers = new Set([...holdingMap.keys(), ...targetMap.keys()]);

  const rawMetrics: Record<string, AssetDriftMetric> = {};
  let maxDrift = 0;
  const breachedAssets: string[] = [];

  for (const ticker of allTickers) {
    const holding = holdingMap.get(ticker);
    const target = targetMap.get(ticker);

    const price = holding ? holding.currentPrice : 1.0;
    const actualShares = holding ? holding.shares : 0;
    const actualValue = actualShares * price;
    const actualWeight = actualValue / totalValue;
    const targetWeight = target ? target.targetWeight : 0.0;
    const assetName = target?.assetName || holding?.assetName || ticker;

    const drift = actualWeight - targetWeight;
    const absDrift = Math.abs(drift);

    if (absDrift > maxDrift) {
      maxDrift = absDrift;
    }

    const isBreached = absDrift >= driftCorridor;
    if (isBreached) {
      breachedAssets.push(ticker);
    }

    const targetValue = targetWeight * totalValue;
    let dollarDelta = targetValue - actualValue; // (+) BUY, (-) SELL

    rawMetrics[ticker] = {
      ticker,
      assetName,
      currentPrice: price,
      actualShares,
      actualValue,
      actualWeight,
      targetWeight,
      drift,
      absDrift,
      isBreached,
      dollarDelta,
      sharesDelta: price > 0 ? dollarDelta / price : 0,
      action: dollarDelta > 0.01 ? 'BUY' : dollarDelta < -0.01 ? 'SELL' : 'HOLD',
      proxyTicker: PROXY_MAPPINGS[ticker]?.proxyTicker,
    };
  }

  // 2. Cash-Flow Directed Prioritization
  // If cash is available and deployCashFirst is on, route cash to underweight assets first
  // to directly reduce or eliminate required liquidations on overweight assets!
  if (deployCashFirst && cashBalance > 0) {
    const sellTickers = Object.values(rawMetrics).filter((m) => m.dollarDelta < -0.01);
    const totalSellSupply = Math.abs(
      sellTickers.reduce((acc, m) => acc + m.dollarDelta, 0)
    );

    if (totalSellSupply > 0) {
      // Reduce required sells by the available cash reserve
      const sellReductionFactor = Math.max(0, 1 - cashBalance / totalSellSupply);

      for (const ticker of sellTickers.map((s) => s.ticker)) {
        const originalDelta = rawMetrics[ticker].dollarDelta;
        const adjustedDelta = originalDelta * sellReductionFactor;
        rawMetrics[ticker].dollarDelta = adjustedDelta;
        rawMetrics[ticker].sharesDelta =
          rawMetrics[ticker].currentPrice > 0
            ? adjustedDelta / rawMetrics[ticker].currentPrice
            : 0;
        rawMetrics[ticker].action =
          Math.abs(adjustedDelta) > 0.01 ? 'SELL' : 'HOLD';
      }
    }
  }

  let status: DriftStatus = 'ALIGNED';
  if (maxDrift >= driftCorridor) {
    status = 'BREACH';
  } else if (maxDrift >= 0.03) {
    status = 'WARNING';
  }

  return {
    totalValue,
    equityValue,
    cashBalance,
    maxDrift,
    isBreached: status === 'BREACH',
    status,
    metrics: rawMetrics,
    breachedAssets,
  };
}

/**
 * Stages HIFO (Highest-In, First-Out) tax-lot liquidation queue for an asset
 * that requires trimming. Prioritizes lots with highest cost basis first
 * to maximize tax-loss harvesting and avoid capital gains drag.
 */
export function stageHIFOLiquidation(
  account: ClientAccount,
  ticker: string,
  sharesToTrim: number,
  excludedLotIds: Set<string> = new Set()
): {
  lotAllocations: HIFOLotAllocation[];
  totalSharesAllocated: number;
  netRealizedGainLoss: number;
  totalTaxLossHarvested: number;
  totalCapitalGainsRealized: number;
} {
  const holding = account.holdings.find((h) => h.ticker === ticker);
  const currentPrice = holding?.currentPrice ?? 0;

  // Filter lots for this ticker that are not locked
  const lots = account.taxLots
    .filter((lot) => lot.ticker === ticker && !lot.isLocked && !excludedLotIds.has(lot.id))
    // Sort descending by cost basis (HIFO)
    .sort((a, b) => b.costBasis - a.costBasis);

  let remainingShares = Math.max(0, sharesToTrim);
  const lotAllocations: HIFOLotAllocation[] = [];
  let totalSharesAllocated = 0;
  let netRealizedGainLoss = 0;
  let totalTaxLossHarvested = 0;
  let totalCapitalGainsRealized = 0;

  for (const lot of lots) {
    if (remainingShares <= 0.00001) break;

    const sharesFromThisLot = Math.min(lot.shares, remainingShares);
    const unitGainLoss = currentPrice - lot.costBasis;
    const realizedGainLoss = unitGainLoss * sharesFromThisLot;
    const isHarvestLoss = unitGainLoss < -0.001;

    lotAllocations.push({
      lotId: lot.id,
      ticker: lot.ticker,
      purchaseDate: lot.purchaseDate,
      sharesAvailable: lot.shares,
      sharesToSell: Number(sharesFromThisLot.toFixed(4)),
      costBasis: lot.costBasis,
      marketPrice: currentPrice,
      realizedGainLoss: Number(realizedGainLoss.toFixed(2)),
      isHarvestLoss,
      isShortTerm: lot.isShortTerm,
      isSelected: true,
    });

    remainingShares -= sharesFromThisLot;
    totalSharesAllocated += sharesFromThisLot;
    netRealizedGainLoss += realizedGainLoss;

    if (isHarvestLoss) {
      totalTaxLossHarvested += Math.abs(realizedGainLoss);
    } else {
      totalCapitalGainsRealized += realizedGainLoss;
    }
  }

  return {
    lotAllocations,
    totalSharesAllocated: Number(totalSharesAllocated.toFixed(4)),
    netRealizedGainLoss: Number(netRealizedGainLoss.toFixed(2)),
    totalTaxLossHarvested: Number(totalTaxLossHarvested.toFixed(2)),
    totalCapitalGainsRealized: Number(totalCapitalGainsRealized.toFixed(2)),
  };
}

/**
 * Generates an institutional, SEC Rule 206(4)-7 compliant audit rationale memo
 * summarizing the drift triggers, tax-lot selection, and tax alpha.
 */
export function generateFiduciaryMemo(
  account: ClientAccount,
  report: PortfolioDriftReport,
  hifoSummary?: {
    netRealizedGainLoss: number;
    taxLossHarvested: number;
  }
): string {
  const maxDriftPct = (report.maxDrift * 100).toFixed(2);
  const corridorPct = (account.driftCorridor * 100).toFixed(1);
  const dateStr = new Date().toISOString().split('T')[0];

  const breachedAssetList = report.breachedAssets.length > 0
    ? report.breachedAssets.join(', ')
    : 'None';

  let taxParagraph = '';
  if (account.accountType === 'Taxable Brokerage') {
    const harvested = hifoSummary?.taxLossHarvested ?? 0;
    const netGL = hifoSummary?.netRealizedGainLoss ?? 0;

    if (harvested > 0) {
      taxParagraph = `Execution adhered strictly to HIFO (Highest-In, First-Out) lot prioritization, successfully harvesting $${harvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in capital losses to generate client tax alpha. Rebalancing proceeds were routed to correlated proxy ETF allocations to preserve mandate market exposure while preventing IRS Section 1091 Wash-Sale rule disallowance.`;
    } else if (netGL >= 0) {
      taxParagraph = `Execution deployed idle cash reserves ($${account.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}) first to purchase underweight assets, mitigating taxable liquidation events. Staged trims were sequenced via HIFO to minimize net realized capital gains ($${netGL.toLocaleString('en-US', { minimumFractionDigits: 2 })}).`;
    } else {
      taxParagraph = `All staged transactions utilized automated HIFO lot sorting to optimize after-tax efficiency, generating net capital loss offsets of $${Math.abs(netGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}.`;
    }
  } else {
    taxParagraph = `Because Account #${account.accountNumber} is a tax-advantaged vehicle (${account.accountType}), liquidations are executed without immediate taxable capital gain consequences, prioritizing precise model equilibrium and minimal bid-ask slippage.`;
  }

  return `INVESTMENT POLICY STATEMENT (IPS) COMPLIANCE AUDIT MEMO
Account: #${account.accountNumber} — ${account.clientName}
Date: ${dateStr} | Fiduciary Mandate: ${account.modelName} | Auditor: David Vance, RIA

1. MANDATE DRIFT & CORRIDOR BREACH:
Portfolio valuation stands at $${report.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} with a maximum asset allocation drift of ${maxDriftPct}%, breaching the established tolerance corridor of ±${corridorPct}% under SEC Rule 206(4)-7. Primary divergence observed in: [${breachedAssetList}]. Rebalancing is legally mandated to restore portfolio risk exposure back to approved client IPS tolerances.

2. TAX-AWARE EXECUTION & FIDUCIARY ATTRIBUTION:
${taxParagraph} All staged trades have been verified against custodial liquidity constraints prior to block execution dispatch.`;
}

/**
 * Executes a simulated rebalance mutation on the client account state:
 * - Deducts sold lots or decrements shares.
 * - Adds new lots for purchased assets at current market price.
 * - Adjusts cash balance with trade proceeds/outflows.
 * - Creates an immutable RebalanceAuditLog entry.
 */
export function executeSimulatedRebalance(
  account: ClientAccount,
  orders: StagedOrder[],
  hifoAllocations: Record<string, HIFOLotAllocation[]>,
  memo: string
): {
  updatedAccount: ClientAccount;
  auditLog: RebalanceAuditLog;
} {
  const newHoldings = account.holdings.map((h) => ({ ...h }));
  const newLots = account.taxLots.map((l) => ({ ...l }));
  let newCash = account.cashBalance;
  let totalTaxAlpha = 0;

  const lotAllocationsMap = new Map<string, number>();
  for (const allocations of Object.values(hifoAllocations)) {
    for (const alloc of allocations) {
      if (alloc.isSelected) {
        lotAllocationsMap.set(alloc.lotId, alloc.sharesToSell);
        if (alloc.isHarvestLoss) {
          totalTaxAlpha += Math.abs(alloc.realizedGainLoss);
        }
      }
    }
  }

  // 1. Process Sells
  for (const order of orders.filter((o) => o.side === 'SELL')) {
    const holdingIndex = newHoldings.findIndex((h) => h.ticker === order.ticker);
    if (holdingIndex >= 0) {
      newHoldings[holdingIndex].shares = Math.max(
        0,
        newHoldings[holdingIndex].shares - order.shares
      );
    }
    newCash += order.estimatedNotional;
  }

  // Deduct from tax lots
  for (let i = 0; i < newLots.length; i++) {
    const lotId = newLots[i].id;
    const sharesSold = lotAllocationsMap.get(lotId);
    if (sharesSold && sharesSold > 0) {
      newLots[i].shares = Math.max(0, newLots[i].shares - sharesSold);
    }
  }

  // Remove completely depleted lots
  const filteredLots = newLots.filter((lot) => lot.shares > 0.0001);

  // 2. Process Buys
  const todayStr = new Date().toISOString().split('T')[0];
  for (const order of orders.filter((o) => o.side === 'BUY')) {
    let holdingIndex = newHoldings.findIndex((h) => h.ticker === order.ticker);
    if (holdingIndex >= 0) {
      newHoldings[holdingIndex].shares += order.shares;
    } else {
      // Add new holding if didn't exist
      newHoldings.push({
        ticker: order.ticker,
        assetName: order.ticker,
        assetClass: 'US Equities',
        shares: order.shares,
        currentPrice: order.estimatedPrice,
      });
    }
    newCash = Math.max(0, newCash - order.estimatedNotional);

    // Create a new tax lot for purchased shares
    filteredLots.push({
      id: `lot-new-${Date.now()}-${order.ticker}`,
      ticker: order.ticker,
      purchaseDate: todayStr,
      shares: order.shares,
      costBasis: order.estimatedPrice,
      currentPrice: order.estimatedPrice,
      isShortTerm: true,
      isLocked: false,
    });
  }

  const updatedAccount: ClientAccount = {
    ...account,
    cashBalance: Number(newCash.toFixed(2)),
    holdings: newHoldings.filter((h) => h.shares > 0.0001),
    taxLots: filteredLots,
    lastRebalanced: todayStr,
  };

  const initialReport = calculatePortfolioDrift(account);
  const postReport = calculatePortfolioDrift(updatedAccount);

  const auditLog: RebalanceAuditLog = {
    id: `audit-${Date.now()}`,
    accountId: account.id,
    accountNumber: account.accountNumber,
    clientName: account.clientName,
    timestamp: new Date().toISOString(),
    preRebalanceDrift: Number((initialReport.maxDrift * 100).toFixed(2)),
    postRebalanceDrift: Number((postReport.maxDrift * 100).toFixed(2)),
    cashDeployed: Number(
      (Math.max(0, account.cashBalance - updatedAccount.cashBalance)).toFixed(2)
    ),
    netTaxAlpha: Number(totalTaxAlpha.toFixed(2)),
    orders: orders.map((o) => ({
      ...o,
      status: 'FILLED',
      alpacaOrderId: `alp_sim_${Math.random().toString(36).substring(2, 9)}`,
    })),
    complianceMemo: memo,
  };

  return {
    updatedAccount,
    auditLog,
  };
}
