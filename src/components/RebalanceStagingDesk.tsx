import React, { useState } from 'react';
import {
  ClientAccount,
  StagedOrder,
  HIFOLotAllocation,
} from '@/types/portfolio';
import {
  calculatePortfolioDrift,
  stageHIFOLiquidation,
  generateFiduciaryMemo,
  PROXY_MAPPINGS,
} from '@/utils/rebalanceEngine';
import { CorridorGauge } from './CorridorGauge';
import { HIFOLotMatrix } from './HIFOLotMatrix';
import { ExecutionDispatchBar } from './ExecutionDispatchBar';
import {
  ToggleLeft,
  ToggleRight,
  ArrowRightLeft,
} from 'lucide-react';

interface RebalanceStagingDeskProps {
  account: ClientAccount;
  onExecuteRebalance: (
    orders: StagedOrder[],
    hifoAllocations: Record<string, HIFOLotAllocation[]>,
    memo: string
  ) => void;
  onOpenMemoModal: (memo: string) => void;
  isExecuting: boolean;
  onUpdateCashBalance: (newBalance: number) => void;
}

export const RebalanceStagingDesk: React.FC<RebalanceStagingDeskProps> = ({
  account,
  onExecuteRebalance,
  onOpenMemoModal,
  isExecuting,
  onUpdateCashBalance,
}) => {
  const [deployCashFirst, setDeployCashFirst] = useState(true);
  const [enableWashSaleProtection, setEnableWashSaleProtection] = useState(true);
  const [excludedLotIds, setExcludedLotIds] = useState<Set<string>>(new Set());
  const [cashAdjustmentInput, setCashAdjustmentInput] = useState('');

  // 1. Calculate Drift Report with current parameters
  const report = calculatePortfolioDrift(account, {
    deployCashFirst,
    excludedLotIds,
  });

  // 2. Identify sell orders and stage HIFO lot liquidation queues
  const hifoAllocations: Record<string, HIFOLotAllocation[]> = {};
  let totalTaxLossHarvested = 0;
  let netRealizedGainLoss = 0;

  const stagedOrders: StagedOrder[] = [];

  for (const [ticker, metric] of Object.entries(report.metrics)) {
    if (metric.action === 'SELL') {
      const sharesToTrim = Math.abs(metric.sharesDelta);
      const hifoResult = stageHIFOLiquidation(
        account,
        ticker,
        sharesToTrim,
        excludedLotIds
      );
      hifoAllocations[ticker] = hifoResult.lotAllocations;
      totalTaxLossHarvested += hifoResult.totalTaxLossHarvested;
      netRealizedGainLoss += hifoResult.netRealizedGainLoss;

      stagedOrders.push({
        id: `ord-sell-${ticker}-${Date.now()}`,
        accountId: account.id,
        ticker,
        side: 'SELL',
        shares: Number(sharesToTrim.toFixed(4)),
        estimatedPrice: metric.currentPrice,
        estimatedNotional: Number((sharesToTrim * metric.currentPrice).toFixed(2)),
        isProxySubstitution: false,
        stagedAt: new Date().toISOString(),
        status: 'STAGED',
      });
    } else if (metric.action === 'BUY') {
      const sharesToBuy = metric.sharesDelta;
      const proxyInfo = PROXY_MAPPINGS[ticker];
      const useProxy =
        enableWashSaleProtection &&
        account.accountType === 'Taxable Brokerage' &&
        totalTaxLossHarvested > 0 &&
        proxyInfo !== undefined;

      const orderTicker = useProxy ? proxyInfo.proxyTicker : ticker;

      stagedOrders.push({
        id: `ord-buy-${orderTicker}-${Date.now()}`,
        accountId: account.id,
        ticker: orderTicker,
        side: 'BUY',
        shares: Number(sharesToBuy.toFixed(4)),
        estimatedPrice: metric.currentPrice,
        estimatedNotional: Number((sharesToBuy * metric.currentPrice).toFixed(2)),
        isProxySubstitution: useProxy,
        originalTicker: useProxy ? ticker : undefined,
        stagedAt: new Date().toISOString(),
        status: 'STAGED',
      });
    }
  }

  // Toggle lot inclusion / exclusion
  const handleToggleLot = (lotId: string) => {
    setExcludedLotIds((prev) => {
      const next = new Set(prev);
      if (next.has(lotId)) {
        next.delete(lotId);
      } else {
        next.add(lotId);
      }
      return next;
    });
  };

  // Generate Memo
  const currentMemo = generateFiduciaryMemo(account, report, {
    netRealizedGainLoss,
    taxLossHarvested: totalTaxLossHarvested,
  });

  const handleOpenMemo = () => {
    onOpenMemoModal(currentMemo);
  };

  const handleDispatch = () => {
    onExecuteRebalance(stagedOrders, hifoAllocations, currentMemo);
  };

  const handleApplyCashDeposit = () => {
    const val = parseFloat(cashAdjustmentInput);
    if (!isNaN(val)) {
      onUpdateCashBalance(account.cashBalance + val);
      setCashAdjustmentInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface-recessed overflow-y-auto p-4 sm:p-5 select-none">
      {/* Header Info Banner */}
      <div className="bg-white border-3 border-black p-4 shadow-hard mb-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b-2 border-black gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-black text-white px-1.5 py-0.5">
                ACCOUNT #{account.accountNumber}
              </span>
              <span className="font-display font-black text-lg sm:text-xl uppercase">
                {account.clientName}
              </span>
            </div>
            <div className="font-mono text-xs text-text-muted mt-1">
              Model: <strong className="text-black">{account.modelName}</strong> | Corridor:{' '}
              <strong className="text-black">±{(account.driftCorridor * 100).toFixed(1)}%</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-white border-2 border-black px-2 py-1 font-mono text-xs font-bold">
              {account.accountType}
            </span>
            {report.status === 'BREACH' ? (
              <span className="bg-signal-breach text-black font-mono font-black text-xs px-2.5 py-1 border-2 border-black shadow-hard-sm">
                BREACHED (+{(report.maxDrift * 100).toFixed(1)}%)
              </span>
            ) : (
              <span className="bg-signal-safe text-black font-mono font-black text-xs px-2.5 py-1 border-2 border-black shadow-hard-sm">
                ALIGNED
              </span>
            )}
          </div>
        </div>

        {/* Tactical Strategy Controls Strip */}
        <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {/* Toggle 1: Cash-Flow First */}
          <div
            onClick={() => setDeployCashFirst(!deployCashFirst)}
            className="flex items-center justify-between p-2.5 bg-surface-base border-2 border-black cursor-pointer hover:bg-white transition-colors"
          >
            <div>
              <span className="font-bold block">DEPLOY CASH FIRST</span>
              <span className="text-[10px] text-text-muted block">
                Routes idle cash to buys before selling appreciated assets
              </span>
            </div>
            {deployCashFirst ? (
              <ToggleRight className="w-6 h-6 text-brand-pink shrink-0" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400 shrink-0" />
            )}
          </div>

          {/* Toggle 2: Wash-Sale Protection */}
          <div
            onClick={() => setEnableWashSaleProtection(!enableWashSaleProtection)}
            className="flex items-center justify-between p-2.5 bg-surface-base border-2 border-black cursor-pointer hover:bg-white transition-colors"
          >
            <div>
              <span className="font-bold block">WASH-SALE SUPPRESSION</span>
              <span className="text-[10px] text-text-muted block">
                Pairs proxy ETFs (IRS Sec 1091 safe) on loss harvests
              </span>
            </div>
            {enableWashSaleProtection ? (
              <ToggleRight className="w-6 h-6 text-signal-safe shrink-0" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400 shrink-0" />
            )}
          </div>
        </div>

        {/* Cash Deposit / Withdrawal Simulator */}
        <div className="mt-3 pt-3 border-t border-black flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">IDLE CASH:</span>
            <strong className="text-black bg-surface-recessed px-1.5 py-0.5 border border-black">
              ${account.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </strong>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 text-[11px]">Simulate Inflow/Outflow:</span>
            <input
              type="number"
              placeholder="e.g. 10000 or -5000"
              value={cashAdjustmentInput}
              onChange={(e) => setCashAdjustmentInput(e.target.value)}
              className="w-32 bg-white border-2 border-black px-2 py-0.5 font-mono text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCashDeposit}
              className="tactile-btn-secondary px-2 py-0.5 font-mono text-xs font-bold"
            >
              APPLY
            </button>
          </div>
        </div>
      </div>

      {/* Corridor Visualizer Section */}
      <div className="mb-4">
        <div className="font-display font-black text-xs uppercase tracking-wider text-black mb-2 flex items-center justify-between">
          <span>PORTFOLIO DRIFT CORRIDOR GAUGES</span>
          <span className="font-mono text-[10px] text-text-muted">
            THRESHOLD: ±{(account.driftCorridor * 100).toFixed(1)}%
          </span>
        </div>
        {Object.values(report.metrics).map((metric) => (
          <CorridorGauge
            key={metric.ticker}
            metric={metric}
            corridor={account.driftCorridor}
          />
        ))}
      </div>

      {/* Asset Breakdown & Proposed Order Table */}
      <div className="bg-white border-3 border-black shadow-hard p-4 mb-4">
        <div className="font-display font-black text-xs uppercase tracking-wider text-black pb-2 mb-2 border-b-2 border-black flex items-center justify-between">
          <span>TRADE DELTA SPECIFICATIONS</span>
          <span className="font-mono text-[10px] text-text-muted">
            EXECUTION STRATEGY: FRACTIONAL LOTS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs text-left">
            <thead>
              <tr className="bg-surface-recessed border-b-2 border-black uppercase text-[10px] text-black font-bold">
                <th className="py-2 px-2 border-r border-black">TICKER</th>
                <th className="py-2 px-2 border-r border-black text-right">ACTUAL %</th>
                <th className="py-2 px-2 border-r border-black text-right">TARGET %</th>
                <th className="py-2 px-2 border-r border-black text-right">DOLLAR DELTA</th>
                <th className="py-2 px-2 border-r border-black text-right">SHARES</th>
                <th className="py-2 px-2 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(report.metrics).map((m) => (
                <tr key={m.ticker} className="border-b border-black">
                  <td className="py-2 px-2 border-r border-black font-bold">
                    {m.ticker}
                  </td>
                  <td className="py-2 px-2 border-r border-black text-right">
                    {(m.actualWeight * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 border-r border-black text-right">
                    {(m.targetWeight * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 border-r border-black text-right font-bold">
                    {m.dollarDelta > 0
                      ? `+$${m.dollarDelta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : m.dollarDelta < 0
                      ? `-$${Math.abs(m.dollarDelta).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : '$0.00'}
                  </td>
                  <td className="py-2 px-2 border-r border-black text-right">
                    {Math.abs(m.sharesDelta).toFixed(4)}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {m.action === 'BUY' ? (
                      <span className="bg-signal-safe text-black font-bold border border-black px-1.5 py-0.5 text-[10px]">
                        BUY
                      </span>
                    ) : m.action === 'SELL' ? (
                      <span className="bg-brand-pink text-white font-bold border border-black px-1.5 py-0.5 text-[10px]">
                        SELL
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-700 font-bold border border-black px-1.5 py-0.5 text-[10px]">
                        HOLD
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HIFO Tax Lot Liquidation Matrix (rendered when sales exist in taxable accounts) */}
      {account.accountType === 'Taxable Brokerage' &&
        Object.entries(hifoAllocations).map(([ticker, allocations]) => {
          const metric = report.metrics[ticker];
          return (
            <HIFOLotMatrix
              key={ticker}
              ticker={ticker}
              totalTrimShares={Math.abs(metric.sharesDelta)}
              lotAllocations={allocations}
              onToggleLot={handleToggleLot}
              netGainLoss={netRealizedGainLoss}
              taxLossHarvested={totalTaxLossHarvested}
            />
          );
        })}

      {/* Wash-Sale Protection Banner (if proxy active) */}
      {enableWashSaleProtection && totalTaxLossHarvested > 0 && (
        <div className="bg-[#00F0FF]/20 border-3 border-black p-3 mb-4 shadow-hard-sm flex items-start gap-2.5">
          <ArrowRightLeft className="w-5 h-5 text-black shrink-0 mt-0.5" />
          <div className="font-mono text-xs">
            <span className="font-bold block uppercase text-black">
              IRS Section 1091 Wash-Sale Protection Active
            </span>
            <span className="text-gray-800 text-[11px] block mt-0.5">
              Loss harvesting on sold positions will route interim exposure to proxy ETFs (e.g. ITOT, SCHX) to prevent deduction disallowance while keeping client 100% market invested.
            </span>
          </div>
        </div>
      )}

      {/* Execution Dispatch Bar */}
      <ExecutionDispatchBar
        orders={stagedOrders}
        onGenerateMemo={handleOpenMemo}
        onDispatchOrders={handleDispatch}
        isExecuting={isExecuting}
      />
    </div>
  );
};
