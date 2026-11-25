'use client';

import React from 'react';
import { formatRupiah } from '@/lib/format';

export interface BarChartItem {
  label: string;
  subLabel?: string;
  value: number;
  highlightValue?: string;
}

export function BarChart({
  items,
  valueFormatter = (val) => formatRupiah(val),
}: {
  items: BarChartItem[];
  valueFormatter?: (val: number) => string;
}) {
  if (!items || items.length === 0) {
    return <div className="h-40 flex items-center justify-center text-xs text-slate-400">Data kosong</div>;
  }

  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3.5">
      {items.map((item, idx) => {
        const percent = Math.min(100, Math.round((item.value / maxValue) * 100));
        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {item.label}
                {item.subLabel && <span className="text-slate-400 font-normal ml-1.5">({item.subLabel})</span>}
              </span>
              <span className="font-bold text-[#102447] tabular-nums">
                {item.highlightValue || valueFormatter(item.value)}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0866F5] to-blue-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
