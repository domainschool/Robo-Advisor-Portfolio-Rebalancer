import React, { useState } from 'react';
import { X, Copy, Check, Bot } from 'lucide-react';

interface ComplianceMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoContent: string;
}

export const ComplianceMemoModal: React.FC<ComplianceMemoModalProps> = ({
  isOpen,
  onClose,
  memoContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [isAttached, setIsAttached] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(memoContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none select-none">
      <div className="bg-white border-4 border-black shadow-hard-lg max-w-2xl w-full p-5 sm:p-6 relative animate-in fade-in zoom-in-95 duration-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-violet text-white border-2 border-black flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-black text-sm uppercase tracking-wide block">
                FIDUCIARY COMPLIANCE TRADE MEMO
              </span>
              <span className="font-mono text-[10px] text-text-muted block">
                SEC RULE 206(4)-7 INVESTMENT POLICY STATEMENT AUDIT RECORD
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

        {/* Memo Body in Recessed Trench */}
        <div className="bg-surface-recessed border-2 border-black p-4 font-mono text-xs leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-line text-black select-text">
          {memoContent}
        </div>

        {/* Modal Actions */}
        <div className="mt-4 pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
            <input
              type="checkbox"
              checked={isAttached}
              onChange={(e) => setIsAttached(e.target.checked)}
              className="w-4 h-4 border-2 border-black rounded-none accent-brand-violet"
            />
            <span className="font-bold">ATTACH TO CRM / IPS AUDIT VAULT</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="tactile-btn-secondary px-3 py-1.5 font-mono text-xs font-bold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-signal-safe" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY MEMO TEXT'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="tactile-btn-primary bg-brand-violet px-4 py-1.5 font-mono text-xs font-bold"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
