import React from 'react';
import { AssetDriftMetric } from '@/types/portfolio';

interface CorridorGaugeProps {
  metric: AssetDriftMetric;
  corridor: number; // e.g. 0.05
}

export const CorridorGauge: React.FC<CorridorGaugeProps> = ({ metric, corridor }) => {
  const actualPct = metric.actualWeight * 100;
  const targetPct = metric.targetWeight * 100;
  const corridorPct = corridor * 100;

  // Calculate safe window bounds (clamped between 0 and 100)
  const safeMin = Math.max(0, targetPct - corridorPct);
  const safeMax = Math.min(100, targetPct + corridorPct);
  const safeWidth = Math.max(0, safeMax - safeMin);

  // Status determination
  const isBreached = metric.absDrift >= corridor;
  const isWarning = !isBreached && metric.absDrift >= 0.03;

  const barWidth = Math.min(100, Math.max(0, actualPct));

  return (
    <div className="w-full bg-white border-2 border-black p-3 mb-3 shadow-hard-sm">
      {/* Header with Asset Ticker and Drift Readout */}
      <div className="flex flex-wrap items-center justify-between font-mono text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-sm bg-black text-white px-1.5 py-0.5">
            {metric.ticker}
          </span>
          <span className="font-bold text-gray-800 hidden sm:inline">{metric.assetName}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted">
            ACTUAL: <strong className="text-black">{actualPct.toFixed(1)}%</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-text-muted">
            TGT: <strong className="text-black">{targetPct.toFixed(1)}%</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-text-muted">
            DELTA:{' '}
            <strong
              className={
                metric.drift > 0
                  ? 'text-signal-breach'
                  : metric.drift < 0
                  ? 'text-brand-pink'
                  : 'text-signal-safe'
              }
            >
              {metric.drift > 0 ? `+${(metric.drift * 100).toFixed(1)}%` : `${(metric.drift * 100).toFixed(1)}%`}
            </strong>
          </span>

          {/* Status Badge */}
          {isBreached ? (
            <span className="bg-signal-breach text-black font-bold border border-black px-1.5 py-0.2 text-[10px] uppercase shadow-[1px_1px_0px_0px_#000000]">
              BREACH
            </span>
          ) : isWarning ? (
            <span className="bg-signal-warning text-black font-bold border border-black px-1.5 py-0.2 text-[10px] uppercase shadow-[1px_1px_0px_0px_#000000]">
              WARNING
            </span>
          ) : (
            <span className="bg-signal-safe text-black font-bold border border-black px-1.5 py-0.2 text-[10px] uppercase shadow-[1px_1px_0px_0px_#000000]">
              SAFE
            </span>
          )}
        </div>
      </div>

      {/* Visual Corridor Track */}
      <div className="relative h-7 w-full bg-surface-recessed border-2 border-black overflow-hidden">
        {/* 1. Safe Corridor Window (Dashed inner bounds) */}
        <div
          className="absolute top-0 bottom-0 bg-[#00FF66]/35 border-l-2 border-r-2 border-black border-dashed z-10 pointer-events-none"
          style={{
            left: `${safeMin}%`,
            width: `${safeWidth}%`,
          }}
          title={`Safe Corridor: ${safeMin.toFixed(1)}% - ${safeMax.toFixed(1)}%`}
        />

        {/* 2. Target Marker Line with Pointer */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-black z-20 pointer-events-none"
          style={{ left: `${targetPct}%` }}
        >
          <div className="absolute -top-1 -left-1 text-[8px] text-black select-none">▼</div>
        </div>

        {/* 3. Actual Weight Fill Bar */}
        <div
          className={`h-full transition-all duration-300 border-r-2 border-black ${
            isBreached
              ? 'hazard-stripes-breach'
              : isWarning
              ? 'hazard-stripes-warning'
              : 'bg-signal-safe'
          }`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Legend / Range labels */}
      <div className="flex justify-between font-mono text-[10px] text-text-muted mt-1">
        <span>0%</span>
        <span>Inner Band: ±{corridorPct.toFixed(1)}%</span>
        <span>Target: {targetPct.toFixed(1)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};
