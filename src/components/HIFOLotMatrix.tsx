import React from 'react';
import { HIFOLotAllocation } from '@/types/portfolio';
import { TrendingDown, AlertCircle, CheckSquare, Square } from 'lucide-react';

interface HIFOLotMatrixProps {
  ticker: string;
  totalTrimShares: number;
  lotAllocations: HIFOLotAllocation[];
  onToggleLot: (lotId: string) => void;
  netGainLoss: number;
  taxLossHarvested: number;
}

export const HIFOLotMatrix: React.FC<HIFOLotMatrixProps> = ({
  ticker,
  totalTrimShares,
  lotAllocations,
  onToggleLot,
  netGainLoss,
  taxLossHarvested,
}) => {
  return (
    <div className="bg-white border-3 border-black shadow-hard p-4 mb-4">
      {/* Matrix Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b-2 border-black gap-2">
        <div>
          <div className="font-display font-black text-sm tracking-wide uppercase flex items-center gap-2">
            <span>STAGED LOTS FOR LIQUIDATION:</span>
            <span className="bg-brand-pink text-white px-2 py-0.5 text-xs font-mono font-bold">
              {ticker}
            </span>
          </div>
          <div className="font-mono text-xs text-text-muted mt-0.5">
            Total Trim Target: <strong>{totalTrimShares.toFixed(4)} Shares</strong> (HIFO Sequenced)
          </div>
        </div>

        {/* Tax Alpha Harvest Badge */}
        {taxLossHarvested > 0 ? (
          <div className="bg-signal-safe border-2 border-black px-2.5 py-1 font-mono text-xs font-bold flex items-center gap-1 shadow-hard-sm">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>HARVESTING -${taxLossHarvested.toLocaleString('en-US', { minimumFractionDigits: 2 })} TAX LOSS</span>
          </div>
        ) : (
          <div className="bg-surface-recessed border-2 border-black px-2.5 py-1 font-mono text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-brand-violet" />
            <span>NET GAIN: ${netGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>

      {/* Lot Ledger Table */}
      {lotAllocations.length === 0 ? (
        <div className="bg-surface-recessed border-2 border-black p-4 text-center font-mono text-xs text-text-muted">
          No tax lots available or required for liquidation under current allocations.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs text-left">
            <thead>
              <tr className="bg-surface-recessed border-b-2 border-black uppercase text-[10px] tracking-wider text-black font-bold">
                <th className="py-2 px-2 border-r border-black">QUEUE</th>
                <th className="py-2 px-2 border-r border-black">PURCHASE DATE</th>
                <th className="py-2 px-2 border-r border-black text-right">STAGED SHARES</th>
                <th className="py-2 px-2 border-r border-black text-right">COST BASIS</th>
                <th className="py-2 px-2 border-r border-black text-right">MKT PRICE</th>
                <th className="py-2 px-2 border-r border-black text-right">TAX GAIN / LOSS</th>
                <th className="py-2 px-2 text-center">EXCLUDE</th>
              </tr>
            </thead>
            <tbody>
              {lotAllocations.map((lot, index) => {
                const isHarvest = lot.isHarvestLoss;
                const rowBg = isHarvest ? 'bg-[#00FF66]/10' : 'bg-[#FFE600]/10';

                return (
                  <tr
                    key={lot.lotId}
                    className={`border-b border-black hover:bg-surface-base transition-colors ${rowBg}`}
                  >
                    <td className="py-2 px-2 border-r border-black font-bold text-center">
                      [{String(index + 1).padStart(2, '0')}]
                    </td>
                    <td className="py-2 px-2 border-r border-black">
                      {lot.purchaseDate}
                      <span className="text-[10px] text-gray-500 block">
                        {lot.isShortTerm ? 'Short-Term (<1yr)' : 'Long-Term (>1yr)'}
                      </span>
                    </td>
                    <td className="py-2 px-2 border-r border-black text-right font-bold">
                      {lot.sharesToSell.toFixed(4)}
                    </td>
                    <td className="py-2 px-2 border-r border-black text-right">
                      ${lot.costBasis.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 border-r border-black text-right">
                      ${lot.marketPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 border-r border-black text-right font-bold">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={
                            isHarvest
                              ? 'text-black bg-signal-safe px-1 border border-black'
                              : 'text-black bg-signal-warning px-1 border border-black'
                          }
                        >
                          {lot.realizedGainLoss < 0
                            ? `-$${Math.abs(lot.realizedGainLoss).toFixed(2)}`
                            : `+$${lot.realizedGainLoss.toFixed(2)}`}
                        </span>
                        <span className="text-[9px] uppercase font-bold hidden sm:inline">
                          {isHarvest ? '[TLH]' : '[GAIN]'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleLot(lot.lotId)}
                        className="inline-flex items-center justify-center p-1 hover:bg-black/10"
                        title={lot.isSelected ? 'Exclude this lot from sale' : 'Include this lot'}
                      >
                        {lot.isSelected ? (
                          <CheckSquare className="w-4 h-4 text-black" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-3 pt-2 border-t-2 border-black flex flex-wrap items-center justify-between font-mono text-xs">
        <span className="font-bold">
          * METHOD: HIGHEST-IN, FIRST-OUT (HIFO) LOT PRIORITIZATION
        </span>
        <span className="font-bold text-signal-safe bg-black text-white px-2 py-0.5">
          NET TAX BENEFIT: -${taxLossHarvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
