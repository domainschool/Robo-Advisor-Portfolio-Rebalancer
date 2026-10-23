export type AccountType = 'Taxable Brokerage' | 'Roth IRA' | 'Traditional IRA';

export type AssetClass =
  | 'US Equities'
  | 'Intl Equities'
  | 'Fixed Income'
  | 'Commodities'
  | 'Cash';

export interface TaxLot {
  id: string;
  ticker: string;
  purchaseDate: string; // YYYY-MM-DD
  shares: number;
  costBasis: number; // Cost basis per share
  currentPrice: number;
  isShortTerm: boolean; // Held < 365 days
  isLocked?: boolean; // Manual exclusion by advisor
}

export interface Holding {
  ticker: string;
  assetName: string;
  assetClass: AssetClass;
  shares: number;
  currentPrice: number;
  proxyTicker?: string; // Wash-sale correlated proxy (e.g. VOO -> SCHX)
}

export interface ModelAllocation {
  ticker: string;
  assetName: string;
  assetClass: AssetClass;
  targetWeight: number; // 0.00 to 1.00
}

export interface ClientAccount {
  id: string;
  accountNumber: string;
  clientName: string;
  accountType: AccountType;
  modelName: string;
  cashBalance: number;
  driftCorridor: number; // e.g. 0.05 for 5%
  holdings: Holding[];
  taxLots: TaxLot[];
  targetModel: ModelAllocation[];
  lastRebalanced?: string;
}

export type ActionType = 'BUY' | 'SELL' | 'HOLD';

export interface AssetDriftMetric {
  ticker: string;
  assetName: string;
  currentPrice: number;
  actualShares: number;
  actualValue: number;
  actualWeight: number; // fraction 0 to 1
  targetWeight: number; // fraction 0 to 1
  drift: number; // actualWeight - targetWeight
  absDrift: number; // Math.abs(drift)
  isBreached: boolean; // absDrift >= corridor
  dollarDelta: number; // Target Value - Actual Value
  sharesDelta: number; // dollarDelta / currentPrice
  action: ActionType;
  proxyTicker?: string;
}

export type DriftStatus = 'ALIGNED' | 'WARNING' | 'BREACH';

export interface PortfolioDriftReport {
  totalValue: number;
  equityValue: number;
  cashBalance: number;
  maxDrift: number;
  isBreached: boolean;
  status: DriftStatus;
  metrics: Record<string, AssetDriftMetric>;
  breachedAssets: string[];
}

export interface HIFOLotAllocation {
  lotId: string;
  ticker: string;
  purchaseDate: string;
  sharesAvailable: number;
  sharesToSell: number;
  costBasis: number;
  marketPrice: number;
  realizedGainLoss: number;
  isHarvestLoss: boolean;
  isShortTerm: boolean;
  isSelected: boolean;
}

export interface StagedOrder {
  id: string;
  accountId: string;
  ticker: string;
  side: 'BUY' | 'SELL';
  shares: number;
  estimatedPrice: number;
  estimatedNotional: number;
  isProxySubstitution: boolean;
  originalTicker?: string;
  stagedAt: string;
  status: 'STAGED' | 'DISPATCHED' | 'FILLED';
  alpacaOrderId?: string;
}

export interface RebalanceAuditLog {
  id: string;
  accountId: string;
  accountNumber: string;
  clientName: string;
  timestamp: string;
  preRebalanceDrift: number;
  postRebalanceDrift: number;
  cashDeployed: number;
  netTaxAlpha: number; // Negative value = capital loss harvested (tax alpha)
  orders: StagedOrder[];
  complianceMemo: string;
}
