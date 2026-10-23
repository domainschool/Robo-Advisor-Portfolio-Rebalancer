import React from 'react';
import { X, History } from 'lucide-react';
import { RebalanceAuditLog } from '@/types/portfolio';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: RebalanceAuditLog[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none select-none">
      <div className="bg-white border-4 border-black shadow-hard-lg max-w-4xl w-full p-5 sm:p-6 relative max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white border-2 border-black flex items-center justify-center">
              <History className="w-4 h-4 text-signal-safe" />
            </div>
            <div>
              <span className="font-display font-black text-sm uppercase tracking-wide block">
                FIDUCIARY AUDIT TRAIL & REBALANCE ARCHIVE
              </span>
              <span className="font-mono text-[10px] text-text-muted block">
                IMMUTABLE HISTORICAL EXECUTION LOGS ({logs.length} RECORDED)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 border-2 border-black hover:bg-surface-recessed transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Logs Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {logs.length === 0 ? (
            <div className="bg-surface-recessed border-2 border-black p-8 text-center font-mono text-xs text-text-muted">
              No rebalancing operations executed in this session yet. Staged orders will be archived here.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-white border-2 border-black p-4 shadow-hard-sm"
              >
                <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-black font-mono text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-1.5 py-0.5 font-bold">
                      #{log.accountNumber}
                    </span>
                    <strong className="text-black font-display text-sm uppercase">
                      {log.clientName}
                    </strong>
                  </div>
                  <div className="text-text-muted text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs mb-3">
                  <div className="bg-surface-recessed p-2 border border-black">
                    <span className="text-[10px] text-gray-500 block">PRE-DRIFT</span>
                    <span className="text-signal-breach font-bold">+{log.preRebalanceDrift}%</span>
                  </div>
                  <div className="bg-surface-recessed p-2 border border-black">
                    <span className="text-[10px] text-gray-500 block">POST-DRIFT</span>
                    <span className="text-signal-safe font-bold">+{log.postRebalanceDrift}%</span>
                  </div>
                  <div className="bg-surface-recessed p-2 border border-black">
                    <span className="text-[10px] text-gray-500 block">CASH DEPLOYED</span>
                    <span className="font-bold">${log.cashDeployed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-surface-recessed p-2 border border-black">
                    <span className="text-[10px] text-gray-500 block">TAX LOSS HARVESTED</span>
                    <span className="text-signal-safe font-bold">
                      -${log.netTaxAlpha.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Orders List */}
                <div className="border border-black bg-surface-base p-2 font-mono text-[11px] mb-2">
                  <span className="font-bold uppercase text-[10px] text-gray-700 block mb-1">
                    EXECUTED BROKERAGE ORDERS:
                  </span>
                  <div className="space-y-1">
                    {log.orders.map((o) => (
                      <div key={o.id} className="flex justify-between items-center text-xs">
                        <span>
                          <strong className={o.side === 'BUY' ? 'text-signal-safe' : 'text-brand-pink'}>
                            {o.side}
                          </strong>{' '}
                          {o.shares} shs <strong>{o.ticker}</strong> @ ~${o.estimatedPrice.toFixed(2)}
                          {o.isProxySubstitution && (
                            <span className="text-brand-violet text-[10px] ml-1 font-bold">
                              [PROXY: {o.originalTicker}]
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500 text-[10px]">
                          ALPACA ID: {o.alpacaOrderId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t-2 border-black flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="tactile-btn-primary px-4 py-1.5 font-mono text-xs font-bold"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
