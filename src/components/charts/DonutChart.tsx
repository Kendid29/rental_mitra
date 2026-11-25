'use client';

import React from 'react';
import { formatRupiah } from '@/lib/format';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  slices,
  centerLabel = 'Total Beban',
}: {
  slices: DonutSlice[];
  centerLabel?: string;
}) {
  const total = slices.reduce((acc, cur) => acc + cur.value, 0);

  if (total === 0 || slices.length === 0) {
    return <div className="h-44 flex items-center justify-center text-xs text-slate-400">Data kosong</div>;
  }

  // Calculate SVG stroke dashes
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;
  const processed = slices.map((slice) => {
    const fraction = slice.value / total;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeOffset;
    cumulativeOffset += fraction * circumference;
    return {
      ...slice,
      percentage: Math.round(fraction * 100),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-around">
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
          {processed.map((slice, idx) => (
            <circle
              key={idx}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth="14"
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              className="transition-all duration-300"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-[10px] text-slate-400 uppercase font-medium">{centerLabel}</span>
          <span className="text-xs font-bold text-[#102447] font-body mt-0.5">{formatRupiah(total)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 w-full max-w-xs">
        {processed.map((slice, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-slate-700 font-medium truncate">{slice.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-400 font-normal">{slice.percentage}%</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatRupiah(slice.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
