'use client';

import React, { useState } from 'react';
import { formatRupiah } from '@/lib/format';

export interface ChartDataPoint {
  month: string;
  pendapatanKotor: number;
  pengeluaran: number;
  profitBersih: number;
}

export function LineAreaChart({
  data,
  height = 240,
}: {
  data: ChartDataPoint[];
  height?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-xs text-slate-400">Data grafik kosong</div>;
  }

  // Find max value
  const maxVal = Math.max(...data.flatMap((d) => [d.pendapatanKotor, d.profitBersih, d.pengeluaran])) * 1.15 || 1000000;

  const width = 640;
  const paddingX = 40;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  // Build SVG path strings
  const revenuePoints = data.map((d, i) => `${getX(i)},${getY(d.pendapatanKotor)}`).join(' ');
  const profitPoints = data.map((d, i) => `${getX(i)},${getY(d.profitBersih)}`).join(' ');
  const expensePoints = data.map((d, i) => `${getX(i)},${getY(d.pengeluaran)}`).join(' ');

  const revenueArea = `${getX(0)},${paddingTop + chartHeight} ${revenuePoints} ${getX(data.length - 1)},${paddingTop + chartHeight}`;

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center gap-5 text-xs mb-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0866F5]" />
          <span className="text-slate-600 font-medium">Pendapatan Kotor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#00C48C]" />
          <span className="text-slate-600 font-medium">Profit Bersih</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF4D4D]" />
          <span className="text-slate-600 font-medium">Pengeluaran</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0866F5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0866F5" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * pct;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Revenue Area */}
          <polygon points={revenueArea} fill="url(#revenueGrad)" />

          {/* Revenue Line */}
          <polyline
            points={revenuePoints}
            fill="none"
            stroke="#0866F5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Profit Line */}
          <polyline
            points={profitPoints}
            fill="none"
            stroke="#00C48C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Expense Line */}
          <polyline
            points={expensePoints}
            fill="none"
            stroke="#FF4D4D"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const yRev = getY(d.pendapatanKotor);
            const yProf = getY(d.profitBersih);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i} className="cursor-pointer">
                {/* Vertical hover indicator */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={paddingTop + chartHeight}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Revenue circle */}
                <circle
                  cx={x}
                  cy={yRev}
                  r={isHovered ? 6 : 4}
                  fill="#FFFFFF"
                  stroke="#0866F5"
                  strokeWidth="2.5"
                />

                {/* Profit circle */}
                <circle
                  cx={x}
                  cy={yProf}
                  r={isHovered ? 5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#00C48C"
                  strokeWidth="2"
                />

                {/* Month labels */}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748B"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {d.month}
                </text>

                {/* Transparent hit area */}
                <rect
                  x={x - 25}
                  y={paddingTop}
                  width="50"
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-sm pointer-events-none z-10 transition-all flex items-center gap-4 border border-slate-700"
          >
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Bulan</p>
              <p className="font-bold">{data[hoveredIndex].month}</p>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <p className="text-[10px] text-blue-400 font-medium">Kotor</p>
              <p className="font-semibold">{formatRupiah(data[hoveredIndex].pendapatanKotor)}</p>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <p className="text-[10px] text-emerald-400 font-medium">Profit</p>
              <p className="font-semibold">{formatRupiah(data[hoveredIndex].profitBersih)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
