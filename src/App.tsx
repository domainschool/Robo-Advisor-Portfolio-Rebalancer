import React, { useState, useEffect } from 'react';
import { ClientAccount, StagedOrder, HIFOLotAllocation, RebalanceAuditLog } from '@/types/portfolio';
import { INITIAL_PORTFOLIOS } from '@/data/mockPortfolios';
import { executeSimulatedRebalance } from '@/utils/rebalanceEngine';
import { TopNavigationBar } from '@/components/TopNavigationBar';
import { PrimaryKPIStrip } from '@/components/PrimaryKPIStrip';
import { ClientWatchlist } from '@/components/ClientWatchlist';
import { RebalanceStagingDesk } from '@/components/RebalanceStagingDesk';
import { ComplianceMemoModal } from '@/components/ComplianceMemoModal';
import { AuditTrailModal } from '@/components/AuditTrailModal';
import { AboutLearningDeckModal } from '@/components/AboutLearningDeckModal';
import { RotateCcw } from 'lucide-react';

const STORAGE_ACCOUNTS_KEY = 'driftguard_accounts_v1';
const STORAGE_LOGS_KEY = 'driftguard_audit_logs_v1';

export const App: React.FC = () => {
  // Accounts State with LocalStorage Persistence
  const [accounts, setAccounts] = useState<ClientAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved accounts', e);
    }
    return INITIAL_PORTFOLIOS;
  });

  // Selected Account ID (defaults to first account: Eleanor Rigby #8492)
  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => {
    return accounts[0]?.id ?? 'acc-8492';
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<RebalanceAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved audit logs', e);
    }
    return [];
  });

  // Modal States
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [activeMemo, setActiveMemo] = useState('');
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isLearningDeckOpen, setIsLearningDeckOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to persist accounts', e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to persist audit logs', e);
    }
  }, [auditLogs]);

  // Selected Account Object
  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  // Handler: Execute Simulated Rebalance
  const handleExecuteRebalance = (
    orders: StagedOrder[],
    hifoAllocations: Record<string, HIFOLotAllocation[]>,
    memo: string
  ) => {
    if (!selectedAccount) return;

    setIsExecuting(true);

    // Simulate 1.2s latency to transmit over institutional FIX/brokerage gateway
    setTimeout(() => {
      const { updatedAccount, auditLog } = executeSimulatedRebalance(
        selectedAccount,
        orders,
        hifoAllocations,
        memo
      );

      // Update accounts in state
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
      );

      // Append to audit trail
      setAuditLogs((prev) => [auditLog, ...prev]);

      setIsExecuting(false);
    }, 1200);
  };

  // Handler: Update Cash Balance
  const handleUpdateCash = (newBalance: number) => {
    if (!selectedAccount) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? { ...acc, cashBalance: Math.max(0, newBalance) }
          : acc
      )
    );
  };

  // Reset to Initial Mock Data
  const handleResetDemoData = () => {
    if (confirm('Reset all accounts and audit logs to initial seed state?')) {
      setAccounts(INITIAL_PORTFOLIOS);
      setSelectedAccountId(INITIAL_PORTFOLIOS[0].id);
      setAuditLogs([]);
      localStorage.removeItem(STORAGE_ACCOUNTS_KEY);
      localStorage.removeItem(STORAGE_LOGS_KEY);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-text-primary">
      {/* 1. Global Navigation Bar */}
      <TopNavigationBar
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        onOpenLearningDeck={() => setIsLearningDeckOpen(true)}
        auditCount={auditLogs.length}
      />

      {/* 2. Primary KPI Strip */}
      <PrimaryKPIStrip
        accounts={accounts}
        stagedOrderCount={selectedAccount ? selectedAccount.holdings.length : 0}
        stagedOrderNotional={
          selectedAccount
            ? selectedAccount.holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0) * 0.12
            : 0
        }
      />

      {/* 3. Main Workspace: 65% Watchlist / 35% Staging Desk */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-b-4 border-black">
        {/* Left Watchlist: 65% width on desktop */}
        <div className="w-full lg:w-[45%] xl:w-[42%] 2xl:w-[40%] border-r-0 lg:border-r-4 border-black overflow-y-auto">
          <ClientWatchlist
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelectAccount={(account) => setSelectedAccountId(account.id)}
          />
        </div>

        {/* Right Staging Desk: 35% width on desktop */}
        <div className="w-full lg:w-[55%] xl:w-[58%] 2xl:w-[60%] flex-1 overflow-y-auto">
          {selectedAccount ? (
            <RebalanceStagingDesk
              key={selectedAccount.id}
              account={selectedAccount}
              onExecuteRebalance={handleExecuteRebalance}
              onOpenMemoModal={(memo) => {
                setActiveMemo(memo);
                setIsMemoOpen(true);
              }}
              isExecuting={isExecuting}
              onUpdateCashBalance={handleUpdateCash}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-8 font-mono text-sm">
              Please select a client account from the watchlist.
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Utility Bar */}
      <footer className="bg-surface-recessed border-t-2 border-black px-6 py-2 flex flex-wrap items-center justify-between text-xs font-mono text-text-muted">
        <div>
          <span>DRIFTGUARD AI v1.0.0-PROD</span> | <span>ENGINE: DETERMINISTIC HIFO OPTIMIZER</span> | <span>SEC RULE 206(4)-7</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="flex items-center gap-1 hover:text-black font-bold"
            title="Reset to initial seed portfolios"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET SEED DATA
          </button>
          <span>LOCAL PERSISTENCE: ACTIVE</span>
        </div>
      </footer>

      {/* 5. Compliance Memo Modal */}
      <ComplianceMemoModal
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
        memoContent={activeMemo}
      />

      {/* 6. Fiduciary Audit Trail Modal */}
      <AuditTrailModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
        logs={auditLogs}
      />

      {/* 7. Educational Learning Deck & Systems Architecture Modal */}
      <AboutLearningDeckModal
        isOpen={isLearningDeckOpen}
        onClose={() => setIsLearningDeckOpen(false)}
      />
    </div>
  );
};

export default App;
