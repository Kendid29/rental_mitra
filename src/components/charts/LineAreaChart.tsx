'use client';

import React, { useState, useId } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatRupiah } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface ChartDataPoint {
  month: string;
  pendapatanKotor: number;
  pengeluaran: number;
  profitBersih: number;
}

/**
 * Format numbers into compact Indonesian Rupiah for Y-axis ticks.
 * Example: 0 -> Rp0, 10000000 -> Rp10 jt, 40000000 -> Rp40 jt
 */
function formatRupiahCompact(val: number): string {
  if (val <= 0) return 'Rp0';
  if (val >= 1000000000) {
    const m = (val / 1000000000).toFixed(1).replace(/\.0$/, '');
    return `Rp${m} M`;
  }
  if (val >= 1000000) {
    const jt = (val / 1000000).toFixed(1).replace(/\.0$/, '');
    return `Rp${jt} jt`;
  }
  if (val >= 1000) {
    return `Rp${Math.round(val / 1000)} rb`;
  }
  return `Rp${val}`;
}

const chartConfig = {
  pendapatanKotor: {
    label: 'Pendapatan Kotor',
    color: '#0866F5',
  },
  profitBersih: {
    label: 'Profit Bersih',
    color: '#00C48C',
  },
  pengeluaran: {
    label: 'Pengeluaran',
    color: '#FF4D4D',
  },
} satisfies ChartConfig;

export function LineAreaChart({
  data,
  height = 240,
}: {
  data: ChartDataPoint[];
  height?: number;
}) {
  const chartId = useId().replace(/:/g, '');

  // Toggleable series visibility state
  const [visibleSeries, setVisibleSeries] = useState({
    pendapatanKotor: true,
    profitBersih: true,
    pengeluaran: true,
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      // Prevent hiding all series
      if (prev[key] && activeCount <= 1) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <div className="w-full">
      {/* Interactive Legend with Modern Toggle Pills */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-wrap">
          {/* Pendapatan Kotor Pill */}
          <button
            type="button"
            onClick={() => toggleSeries('pendapatanKotor')}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border select-none active:scale-98',
              visibleSeries.pendapatanKotor
                ? 'bg-blue-50/80 border-blue-200/80 text-slate-800 shadow-2xs hover:bg-blue-100/70'
                : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60 hover:opacity-80'
            )}
            title="Klik untuk menyembunyikan/menampilkan Pendapatan Kotor"
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                visibleSeries.pendapatanKotor ? 'bg-[#0866F5]' : 'bg-slate-300'
              )}
            />
            <span className={cn(!visibleSeries.pendapatanKotor && 'line-through text-slate-400')}>
              Pendapatan Kotor
            </span>
          </button>

          {/* Profit Bersih Pill */}
          <button
            type="button"
            onClick={() => toggleSeries('profitBersih')}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border select-none active:scale-98',
              visibleSeries.profitBersih
                ? 'bg-emerald-50/80 border-emerald-200/80 text-slate-800 shadow-2xs hover:bg-emerald-100/70'
                : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60 hover:opacity-80'
            )}
            title="Klik untuk menyembunyikan/menampilkan Profit Bersih"
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                visibleSeries.profitBersih ? 'bg-[#00C48C]' : 'bg-slate-300'
              )}
            />
            <span className={cn(!visibleSeries.profitBersih && 'line-through text-slate-400')}>
              Profit Bersih
            </span>
          </button>

          {/* Pengeluaran Pill */}
          <button
            type="button"
            onClick={() => toggleSeries('pengeluaran')}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border select-none active:scale-98',
              visibleSeries.pengeluaran
                ? 'bg-rose-50/80 border-rose-200/80 text-slate-800 shadow-2xs hover:bg-rose-100/70'
                : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60 hover:opacity-80'
            )}
            title="Klik untuk menyembunyikan/menampilkan Pengeluaran"
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                visibleSeries.pengeluaran ? 'bg-[#FF4D4D]' : 'bg-slate-300'
              )}
            />
            <span className={cn(!visibleSeries.pengeluaran && 'line-through text-slate-400')}>
              Pengeluaran
            </span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
          Arahkan kursor untuk melihat rincian bulan
        </span>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Pendapatan Kotor Subtle Gradient */}
              <linearGradient id={`fillRevenue_${chartId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0866F5" stopOpacity={0.12} />
                <stop offset="90%" stopColor="#0866F5" stopOpacity={0.00} />
              </linearGradient>

              {/* Profit Bersih Subtle Gradient */}
              <linearGradient id={`fillProfit_${chartId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C48C" stopOpacity={0.06} />
                <stop offset="90%" stopColor="#00C48C" stopOpacity={0.00} />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Only */}
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#F1F5F9"
            />

            {/* X-Axis Month Labels */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />

            {/* Y-Axis Compact Rupiah Labels */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={formatRupiahCompact}
              width={56}
            />

            {/* shadcn Floating Tooltip */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => `Bulan ${value}`}
                  formatter={(value) => formatRupiah(Number(value))}
                />
              }
            />

            {/* Pendapatan Kotor Area Curve */}
            {visibleSeries.pendapatanKotor && (
              <Area
                type="monotone"
                dataKey="pendapatanKotor"
                stroke="#0866F5"
                strokeWidth={2.2}
                fill={`url(#fillRevenue_${chartId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#FFFFFF',
                  stroke: '#0866F5',
                  strokeWidth: 2.2,
                }}
              />
            )}

            {/* Profit Bersih Area Curve */}
            {visibleSeries.profitBersih && (
              <Area
                type="monotone"
                dataKey="profitBersih"
                stroke="#00C48C"
                strokeWidth={2.0}
                fill={`url(#fillProfit_${chartId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#FFFFFF',
                  stroke: '#00C48C',
                  strokeWidth: 2.0,
                }}
              />
            )}

            {/* Pengeluaran Line Curve */}
            {visibleSeries.pengeluaran && (
              <Area
                type="monotone"
                dataKey="pengeluaran"
                stroke="#FF4D4D"
                strokeWidth={1.8}
                fill="none"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#FFFFFF',
                  stroke: '#FF4D4D',
                  strokeWidth: 1.8,
                }}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
