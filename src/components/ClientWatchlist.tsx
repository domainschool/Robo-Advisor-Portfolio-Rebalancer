import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ClientAccount } from '@/types/portfolio';
import { calculatePortfolioDrift } from '@/utils/rebalanceEngine';

interface ClientWatchlistProps {
  accounts: ClientAccount[];
  selectedAccountId: string;
  onSelectAccount: (account: ClientAccount) => void;
}

export const ClientWatchlist: React.FC<ClientWatchlistProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'BREACHED' | 'CASH_RICH' | 'ALIGNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Process accounts with drift calculations
  const analyzedAccounts = accounts.map((account) => {
    const report = calculatePortfolioDrift(account);
    const hasHighCash = account.cashBalance > 20000;
    return {
      account,
      report,
      hasHighCash,
    };
  });

  const filteredAccounts = analyzedAccounts.filter(({ account, report, hasHighCash }) => {
    // Search query filter
    const matchesSearch =
      account.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountNumber.includes(searchQuery) ||
      account.holdings.some((h) => h.ticker.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'BREACHED') return report.isBreached;
    if (filter === 'CASH_RICH') return hasHighCash;
    if (filter === 'ALIGNED') return report.status === 'ALIGNED';
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-surface-base">
      {/* Top Filter Rail & Search */}
      <div className="p-4 border-b-3 border-black bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-black text-sm uppercase tracking-wide">
            CLIENT DRIFT WATCHLIST
          </span>
          <span className="font-mono text-xs text-text-muted font-bold">
            SHOWING {filteredAccounts.length} / {accounts.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setFilter('ALL')}
            className={`font-mono text-xs font-bold px-2.5 py-1 border-2 border-black transition-all ${
              filter === 'ALL'
                ? 'bg-black text-white shadow-hard-sm'
                : 'bg-white text-black hover:bg-surface-recessed'
            }`}
          >
            [ ALL ({accounts.length}) ]
          </button>
          <button
            onClick={() => setFilter('BREACHED')}
            className={`font-mono text-xs font-bold px-2.5 py-1 border-2 border-black transition-all ${
              filter === 'BREACHED'
                ? 'bg-signal-breach text-black shadow-hard-sm'
                : 'bg-white text-black hover:bg-signal-breach/20'
            }`}
          >
            [ BREACHED ({analyzedAccounts.filter((a) => a.report.isBreached).length}) ]
          </button>
          <button
            onClick={() => setFilter('CASH_RICH')}
            className={`font-mono text-xs font-bold px-2.5 py-1 border-2 border-black transition-all ${
              filter === 'CASH_RICH'
                ? 'bg-brand-cyan text-black shadow-hard-sm'
                : 'bg-white text-black hover:bg-brand-cyan/20'
            }`}
          >
            [ CASH-RICH ({analyzedAccounts.filter((a) => a.hasHighCash).length}) ]
          </button>
          <button
            onClick={() => setFilter('ALIGNED')}
            className={`font-mono text-xs font-bold px-2.5 py-1 border-2 border-black transition-all ${
              filter === 'ALIGNED'
                ? 'bg-signal-safe text-black shadow-hard-sm'
                : 'bg-white text-black hover:bg-signal-safe/20'
            }`}
          >
            [ ALIGNED ({analyzedAccounts.filter((a) => a.report.status === 'ALIGNED').length}) ]
          </button>
        </div>

        {/* Search Input Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="FILTER BY TICKER / CLIENT ID / NAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-black pl-9 pr-3 py-1.5 font-mono text-xs placeholder:text-gray-400 focus:outline-none focus:bg-surface-base"
          />
        </div>
      </div>

      {/* Account Cards Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredAccounts.length === 0 ? (
          <div className="bg-white border-3 border-black p-6 text-center font-mono text-xs text-text-muted">
            No accounts matching current criteria.
          </div>
        ) : (
          filteredAccounts.map(({ account, report, hasHighCash }) => {
            const isSelected = account.id === selectedAccountId;
            const maxDriftPct = (report.maxDrift * 100).toFixed(1);

            return (
              <div
                key={account.id}
                onClick={() => onSelectAccount(account)}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'tactile-card-selected' : 'tactile-card hover:bg-surface-base'
                } p-4`}
              >
                {/* Status Alert Banner */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-black">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-black text-white px-1.5 py-0.5">
                      #{account.accountNumber}
                    </span>
                    <span className="font-display font-black text-sm uppercase">
                      {account.clientName}
                    </span>
                  </div>

                  {report.status === 'BREACH' ? (
                    <span className="bg-signal-breach text-black font-mono font-bold text-[10px] uppercase border border-black px-1.5 py-0.5 flex items-center gap-1 shadow-hard-sm">
                      <AlertTriangle className="w-3 h-3" />
                      BREACH: +{maxDriftPct}%
                    </span>
                  ) : report.status === 'WARNING' ? (
                    <span className="bg-signal-warning text-black font-mono font-bold text-[10px] uppercase border border-black px-1.5 py-0.5 shadow-hard-sm">
                      WARNING: +{maxDriftPct}%
                    </span>
                  ) : (
                    <span className="bg-signal-safe text-black font-mono font-bold text-[10px] uppercase border border-black px-1.5 py-0.5 flex items-center gap-1 shadow-hard-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      ALIGNED: {maxDriftPct}%
                    </span>
                  )}
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs mb-3">
                  <div>
                    <span className="text-gray-500 text-[10px] block">TOTAL AUM</span>
                    <strong className="text-black">
                      ${report.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">CASH BALANCE</span>
                    <strong className={hasHighCash ? 'text-brand-violet' : 'text-black'}>
                      ${account.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">TYPE</span>
                    <span className="text-gray-800 text-[11px] truncate block font-bold">
                      {account.accountType}
                    </span>
                  </div>
                </div>

                {/* Model & Breach Asset Notes */}
                <div className="flex items-center justify-between font-mono text-[11px] text-text-muted pt-2 border-t border-dashed border-black">
                  <span>Model: <strong>{account.modelName}</strong></span>
                  <div className="flex items-center gap-1 text-black font-bold">
                    <span>INSPECT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
