import React, { useState } from 'react';
import { Bot, Send, ShieldAlert } from 'lucide-react';
import { StagedOrder } from '@/types/portfolio';

interface ExecutionDispatchBarProps {
  orders: StagedOrder[];
  onGenerateMemo: () => void;
  onDispatchOrders: () => void;
  isExecuting: boolean;
}

export const ExecutionDispatchBar: React.FC<ExecutionDispatchBarProps> = ({
  orders,
  onGenerateMemo,
  onDispatchOrders,
  isExecuting,
}) => {
  const [isComplianceVerified, setIsComplianceVerified] = useState(false);

  const buyOrders = orders.filter((o) => o.side === 'BUY');
  const sellOrders = orders.filter((o) => o.side === 'SELL');

  const totalBuyNotional = buyOrders.reduce((sum, o) => sum + o.estimatedNotional, 0);
  const totalSellNotional = sellOrders.reduce((sum, o) => sum + o.estimatedNotional, 0);

  const hasOrders = orders.length > 0;

  return (
    <div className="bg-white border-3 border-black shadow-hard p-4 mt-4">
      {/* Metrics Row */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b-2 border-black font-mono text-xs gap-2">
        <div className="flex items-center gap-3">
          <span className="font-bold">
            TOTAL ORDERS: <span className="bg-black text-white px-1.5 py-0.2">{orders.length}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-signal-breach font-bold">
            SELL: ${totalSellNotional.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-signal-safe font-bold">
            BUY: ${totalBuyNotional.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="text-text-muted">
          SLIPPAGE TOL: <strong>0.10%</strong> | EXECUTION: <strong>ALPACAFRACTIONAL</strong>
        </div>
      </div>

      {/* Compliance Verification Checkbox */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isComplianceVerified}
            onChange={(e) => setIsComplianceVerified(e.target.checked)}
            className="w-4 h-4 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer accent-black"
          />
          <span className="font-mono text-xs font-bold text-black flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-pink" />
            I VERIFY IPS COMPLIANCE (SEC RULE 206(4)-7 FIDUCIARY MANDATE)
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* AI Compliance Memo Generator */}
        <button
          type="button"
          onClick={onGenerateMemo}
          className="tactile-btn-secondary bg-surface-recessed hover:bg-brand-violet hover:text-white border-3 border-black py-2.5 px-4 font-mono font-bold text-xs flex items-center justify-center gap-2"
        >
          <Bot className="w-4 h-4 text-brand-violet group-hover:text-white" />
          <span>[AI] GENERATE COMPLIANCE MEMO</span>
        </button>

        {/* Dispatch Orders Button */}
        <button
          type="button"
          disabled={!isComplianceVerified || !hasOrders || isExecuting}
          onClick={onDispatchOrders}
          className={`py-2.5 px-4 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
            isExecuting
              ? 'hazard-stripes-executing text-black border-3 border-black cursor-wait font-black'
              : !isComplianceVerified || !hasOrders
              ? 'bg-gray-200 text-gray-500 border-2 border-gray-400 shadow-none cursor-not-allowed'
              : 'tactile-btn-primary'
          }`}
        >
          {isExecuting ? (
            <span>TRANSMITTING TO FIX GATEWAY...</span>
          ) : (
            <>
              <span>DISPATCH BATCH TO ALPACA ({orders.length} TRADES)</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
