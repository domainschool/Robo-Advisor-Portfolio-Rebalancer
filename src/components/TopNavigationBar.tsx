import React from 'react';
import { Activity, ShieldCheck, History, HelpCircle } from 'lucide-react';

interface TopNavigationBarProps {
  onOpenAuditLogs: () => void;
  onOpenLearningDeck: () => void;
  auditCount: number;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  onOpenAuditLogs,
  onOpenLearningDeck,
  auditCount,
}) => {
  return (
    <header className="h-16 w-full bg-surface-base border-b-4 border-black px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-pink border-2 border-black flex items-center justify-center shadow-hard-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tight uppercase">
            DriftGuard<span className="text-brand-pink"> AI</span>
          </span>
        </div>

        {/* Live Custodian Connection Status */}
        <div className="hidden md:flex items-center gap-1.5 bg-signal-safe border-2 border-black px-2.5 py-0.5 text-xs font-mono font-bold shadow-hard-sm animate-pulse">
          <span className="w-2 h-2 bg-black inline-block"></span>
          CUSTODIAN FEED ACTIVE
        </div>
      </div>

      {/* Global Proxies Ticker Tape */}
      <div className="hidden lg:flex items-center gap-4 bg-white border-2 border-black px-3 py-1 font-mono text-xs shadow-hard-sm">
        <div className="flex items-center gap-1">
          <span className="font-bold">VTI</span>
          <span>$220.00</span>
          <span className="text-signal-safe font-bold">▲ +0.8%</span>
        </div>
        <span className="text-gray-400">|</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">BND</span>
          <span>$72.00</span>
          <span className="text-signal-breach font-bold">▼ -0.2%</span>
        </div>
        <span className="text-gray-400">|</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">VXUS</span>
          <span>$58.00</span>
          <span className="text-signal-safe font-bold">▲ +0.4%</span>
        </div>
        <span className="text-gray-400">|</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">QQQ</span>
          <span>$480.00</span>
          <span className="text-signal-safe font-bold">▲ +1.6%</span>
        </div>
      </div>

      {/* User Controls & Educational Learning Deck */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLearningDeck}
          className="tactile-btn-primary bg-brand-violet hover:bg-black px-3 py-1 text-xs font-mono flex items-center gap-1.5 shadow-hard-sm"
          title="Open Educational Learning Deck & Systems Architecture"
        >
          <HelpCircle className="w-3.5 h-3.5 text-signal-safe" />
          <span className="hidden sm:inline">ABOUT &amp; ARCHITECTURE</span>
          <span className="sm:hidden">ABOUT</span>
        </button>

        <button
          onClick={onOpenAuditLogs}
          className="tactile-btn-secondary px-3 py-1 text-xs font-mono flex items-center gap-1.5"
          title="View Historical Rebalance Logs"
        >
          <History className="w-3.5 h-3.5" />
          <span>AUDIT LOGS ({auditCount})</span>
        </button>

        <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1 font-mono text-xs shadow-hard-sm">
          <ShieldCheck className="w-4 h-4 text-brand-violet" />
          <span className="font-bold">D. VANCE, RIA</span>
          <span className="hidden sm:inline text-gray-500 text-[10px]">#CRD-89410</span>
        </div>
      </div>
    </header>
  );
};
