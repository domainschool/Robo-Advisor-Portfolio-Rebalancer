import React from 'react';
import { DollarSign, AlertTriangle, TrendingDown, Layers } from 'lucide-react';
import { ClientAccount } from '@/types/portfolio';
import { calculatePortfolioDrift } from '@/utils/rebalanceEngine';

interface PrimaryKPIStripProps {
  accounts: ClientAccount[];
  stagedOrderCount: number;
  stagedOrderNotional: number;
}

export const PrimaryKPIStrip: React.FC<PrimaryKPIStripProps> = ({
  accounts,
  stagedOrderCount,
  stagedOrderNotional,
}) => {
  // Compute aggregate metrics across all accounts
  let totalAUM = 0;
  let breachedCount = 0;
  let totalTaxLossPotential = 0;

  for (const acc of accounts) {
    const report = calculatePortfolioDrift(acc);
    totalAUM += report.totalValue;
    if (report.isBreached) {
      breachedCount += 1;
    }

    // Calculate harvestable losses in taxable accounts
    if (acc.accountType === 'Taxable Brokerage') {
      const priceMap = new Map(acc.holdings.map((h) => [h.ticker, h.currentPrice]));
      for (const lot of acc.taxLots) {
        const mktPrice = priceMap.get(lot.ticker) ?? lot.currentPrice;
        if (mktPrice < lot.costBasis) {
          totalTaxLossPotential += (lot.costBasis - mktPrice) * lot.shares;
        }
      }
    }
  }

  return (
    <div className="w-full bg-surface-recessed border-b-4 border-black p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Monitored AUM */}
      <div className="bg-white border-3 border-black p-4 shadow-hard flex flex-col justify-between">
        <div className="flex items-center justify-between text-text-muted text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <span>MONITORED BOOK AUM</span>
          <DollarSign className="w-4 h-4 text-black" />
        </div>
        <div className="font-mono text-2xl font-bold tracking-tight">
          ${totalAUM.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-[11px] font-mono text-text-muted mt-1">
          {accounts.length} Active RIA Household Accounts
        </div>
      </div>

      {/* 2. Corridor Breaches */}
      <div
        className={`border-3 border-black p-4 shadow-hard flex flex-col justify-between ${
          breachedCount > 0 ? 'bg-[#FF3333]/15' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between text-text-muted text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <span>CORRIDOR BREACHES (&gt;5%)</span>
          <AlertTriangle className={`w-4 h-4 ${breachedCount > 0 ? 'text-signal-breach' : 'text-black'}`} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-black text-signal-breach">
            {breachedCount}
          </span>
          <span className="font-mono text-sm text-text-muted">
            / {accounts.length} ACCOUNTS
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-signal-breach mt-1 uppercase">
          {breachedCount > 0 ? 'Fiduciary Action Required' : 'All Portfolios Aligned'}
        </div>
      </div>

      {/* 3. Potential Tax Alpha */}
      <div className="bg-white border-3 border-black p-4 shadow-hard flex flex-col justify-between">
        <div className="flex items-center justify-between text-text-muted text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <span>HARVESTABLE TAX ALPHA</span>
          <TrendingDown className="w-4 h-4 text-signal-safe" />
        </div>
        <div className="font-mono text-2xl font-bold tracking-tight">
          <span className="bg-signal-safe text-black px-1.5 py-0.5 border border-black inline-block">
            -${totalTaxLossPotential.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="text-[11px] font-mono text-text-muted mt-1">
          Unrealized HIFO Loss Offsets
        </div>
      </div>

      {/* 4. Pending Staged Orders */}
      <div className="bg-white border-3 border-black p-4 shadow-hard flex flex-col justify-between">
        <div className="flex items-center justify-between text-text-muted text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <span>PENDING STAGED ORDERS</span>
          <Layers className="w-4 h-4 text-brand-pink" />
        </div>
        <div className="font-mono text-2xl font-bold tracking-tight">
          {stagedOrderCount} Orders
        </div>
        <div className="text-[11px] font-mono text-brand-pink font-bold mt-1">
          ${stagedOrderNotional.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Notional
        </div>
      </div>
    </div>
  );
};
