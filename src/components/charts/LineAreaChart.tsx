'use client';

import React, { useState, useId, useMemo, useRef, useEffect } from 'react';
import { formatRupiah } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface ChartDataPoint {
  month: string;
  pendapatanKotor: number;
  pengeluaran: number;
  profitBersih: number;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Format numbers into compact Indonesian Rupiah for Y-axis ticks.
 * Example: 0 -> Rp0, 5000000 -> Rp5 jt, 15000000 -> Rp15 jt
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

/**
 * Generates an SVG cubic bezier path string through a series of points
 * using Catmull-Rom to Cubic Bezier conversion for natural, smooth curves.
 */
function getSmoothCurvePath(points: Point[], tension: number = 0.2): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

/**
 * Generates a smooth area polygon path from curve down to baseline.
 */
function getSmoothAreaPath(points: Point[], baselineY: number, tension: number = 0.2): string {
  if (points.length < 2) return '';
  const curve = getSmoothCurvePath(points, tension);
  const firstX = points[0].x.toFixed(2);
  const lastX = points[points.length - 1].x.toFixed(2);
  const base = baselineY.toFixed(2);

  return `${curve} L ${lastX} ${base} L ${firstX} ${base} Z`;
}

export function LineAreaChart({
  data,
  height = 230,
}: {
  data: ChartDataPoint[];
  height?: number;
}) {
  const chartId = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Measure container width dynamically to keep 1:1 pixel coordinate scaling
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 0) {
          setContainerWidth(measured);
        }
      }
    };

    updateWidth();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.round(entry.contentRect.width));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Toggleable series visibility state
  const [visibleSeries, setVisibleSeries] = useState({
    revenue: true,
    profit: true,
    expense: true,
  });

  const toggleSeries = (series: 'revenue' | 'profit' | 'expense') => {
    setVisibleSeries((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (activeCount === 1 && prev[series]) return prev;
      return { ...prev, [series]: !prev[series] };
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        Data grafik keuangan tidak tersedia
      </div>
    );
  }

  // Dimensions & Padding (scaled to actual container pixels)
  const width = Math.max(300, containerWidth);
  const isMobile = width < 520;
  const paddingLeft = isMobile ? 48 : 58;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 26;

  const chartWidth = Math.max(10, width - paddingLeft - paddingRight);
  const chartHeight = Math.max(10, height - paddingTop - paddingBottom);
  const baselineY = paddingTop + chartHeight;

  // Calculate maximum value rounded up to a clean multiple
  const rawMax =
    Math.max(
      ...data.flatMap((d) => [
        visibleSeries.revenue ? d.pendapatanKotor : 0,
        visibleSeries.profit ? d.profitBersih : 0,
        visibleSeries.expense ? d.pengeluaran : 0,
      ])
    ) || 1000000;

  // Compute a clean ceiling rounded to 5M or 10M
  const niceMax = useMemo(() => {
    const target = rawMax * 1.15;
    if (target > 50000000) return Math.ceil(target / 10000000) * 10000000;
    if (target > 20000000) return Math.ceil(target / 5000000) * 5000000;
    if (target > 5000000) return Math.ceil(target / 2000000) * 2000000;
    if (target > 1000000) return Math.ceil(target / 500000) * 500000;
    return Math.ceil(target / 100000) * 100000;
  }, [rawMax]);

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => {
    const clampedVal = Math.max(0, val);
    return paddingTop + chartHeight - (clampedVal / niceMax) * chartHeight;
  };

  // Build point arrays
  const revenuePoints: Point[] = data.map((d, i) => ({ x: getX(i), y: getY(d.pendapatanKotor) }));
  const profitPoints: Point[] = data.map((d, i) => ({ x: getX(i), y: getY(d.profitBersih) }));
  const expensePoints: Point[] = data.map((d, i) => ({ x: getX(i), y: getY(d.pengeluaran) }));

  // Build SVG smooth paths
  const revenueCurve = getSmoothCurvePath(revenuePoints, 0.2);
  const revenueArea = getSmoothAreaPath(revenuePoints, baselineY, 0.2);

  const profitCurve = getSmoothCurvePath(profitPoints, 0.2);
  const profitArea = getSmoothAreaPath(profitPoints, baselineY, 0.2);

  const expenseCurve = getSmoothCurvePath(expensePoints, 0.2);

  // Y-axis grid tick levels: [0, 0.25, 0.5, 0.75, 1.0]
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  // Tooltip position calculation in exact pixels
  const tooltipX = hoveredIndex !== null ? getX(hoveredIndex) : 0;
  let tooltipTransform = '-translate-x-1/2';
  if (hoveredIndex !== null) {
    if (tooltipX < 120) tooltipTransform = 'translate-x-0';
    else if (tooltipX > width - 140) tooltipTransform = '-translate-x-full';
  }

  return (
    <div className="w-full" ref={containerRef}>
      {/* Interactive Legend with Toggle Visibility */}
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-wrap">
          {/* Pendapatan Kotor */}
          <button
            type="button"
            onClick={() => toggleSeries('revenue')}
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer border select-none',
              visibleSeries.revenue
                ? 'bg-blue-50/70 border-blue-200/70 text-slate-800 shadow-2xs hover:bg-blue-100/60'
                : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60 hover:opacity-80'
            )}
            title="Klik untuk menyembunyikan/menampilkan Pendapatan Kotor"
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                visibleSeries.revenue ? 'bg-[#0866F5]' : 'bg-slate-300'
              )}
            />
            <span className={cn(!visibleSeries.revenue && 'line-through text-slate-400')}>
              Pendapatan Kotor
            </span>
          </button>

          {/* Profit Bersih */}
          <button
            type="button"
            onClick={() => toggleSeries('profit')}
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer border select-none',
              visibleSeries.profit
                ? 'bg-emerald-50/70 border-emerald-200/70 text-slate-800 shadow-2xs hover:bg-emerald-100/60'
                : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60 hover:opacity-80'
            )}
            title="Klik untuk menyembunyikan/menampilkan Profit Bersih"
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                visibleSeries.profit ? 'bg-[#00C48C]' : 'bg-slate-300'
              )}
            />
            <span className={cn(!visibleSeries.profit && 'line-through text-slate-400')}>
              Profit Bersih
            </span>
          </button>

          {/* Pengeluaran */}
          <button
            type="button"
            onClick={() => toggleSeries('expense')}
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer border select-none',
              visibleSeries.expense
                ? 'bg-rose-50/70 border-rose-200/70 text-slate-800 shadow-2xs hover:bg-rose-100/60'
                : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60 hover:opacity-80'
            )}
            title="Klik untuk menyembunyikan/menampilkan Pengeluaran"
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                visibleSeries.expense ? 'bg-[#FF4D4D]' : 'bg-slate-300'
              )}
            />
            <span className={cn(!visibleSeries.expense && 'line-through text-slate-400')}>
              Pengeluaran
            </span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
          Arahkan kursor untuk melihat rincian bulan
        </span>
      </div>

      {/* Main Chart Area: Fixed height matching prop so it never balloons up */}
      <div className="relative w-full overflow-visible" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: `${width}px`, height: `${height}px` }}
          className="overflow-visible select-none block max-w-full"
        >
          <defs>
            {/* Subtle Gradient for Pendapatan Kotor */}
            <linearGradient id={`revGrad_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0866F5" stopOpacity="0.09" />
              <stop offset="85%" stopColor="#0866F5" stopOpacity="0.00" />
            </linearGradient>

            {/* Subtle Gradient for Profit Bersih */}
            <linearGradient id={`profGrad_${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C48C" stopOpacity="0.04" />
              <stop offset="85%" stopColor="#00C48C" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((pct, idx) => {
            const y = paddingTop + chartHeight * (1 - pct);
            const tickValue = niceMax * pct;

            return (
              <g key={idx}>
                {/* Horizontal Grid Line */}
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />

                {/* Y-Axis Label */}
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontWeight="500"
                  className="font-mono tabular-nums"
                >
                  {formatRupiahCompact(tickValue)}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          {visibleSeries.revenue && (
            <path
              d={revenueArea}
              fill={`url(#revGrad_${chartId})`}
              className="transition-opacity duration-300"
            />
          )}

          {visibleSeries.profit && (
            <path
              d={profitArea}
              fill={`url(#profGrad_${chartId})`}
              className="transition-opacity duration-300"
            />
          )}

          {/* Smooth Curves */}
          {/* 1. Pendapatan Kotor Line */}
          {visibleSeries.revenue && (
            <path
              d={revenueCurve}
              fill="none"
              stroke="#0866F5"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* 2. Profit Bersih Line */}
          {visibleSeries.profit && (
            <path
              d={profitCurve}
              fill="none"
              stroke="#00C48C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* 3. Pengeluaran Line (Solid Smooth Curve) */}
          {visibleSeries.expense && (
            <path
              d={expenseCurve}
              fill="none"
              stroke="#FF4D4D"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* Vertical Crosshair Line when Hovered */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={baselineY}
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="transition-all duration-75"
            />
          )}

          {/* Data Points & Active Hover Markers */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Active Hover Markers (Hidden by default, appears on hover) */}
                {isHovered && (
                  <g className="transition-all duration-150">
                    {/* Revenue Marker */}
                    {visibleSeries.revenue && (
                      <circle
                        cx={x}
                        cy={revenuePoints[i].y}
                        r="3.5"
                        fill="#FFFFFF"
                        stroke="#0866F5"
                        strokeWidth="2"
                      />
                    )}

                    {/* Profit Marker */}
                    {visibleSeries.profit && (
                      <circle
                        cx={x}
                        cy={profitPoints[i].y}
                        r="3.5"
                        fill="#FFFFFF"
                        stroke="#00C48C"
                        strokeWidth="2"
                      />
                    )}

                    {/* Expense Marker */}
                    {visibleSeries.expense && (
                      <circle
                        cx={x}
                        cy={expensePoints[i].y}
                        r="3"
                        fill="#FFFFFF"
                        stroke="#FF4D4D"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                )}

                {/* X-Axis Month Label */}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? '#102447' : '#64748B'}
                  fontWeight={isHovered ? '700' : '500'}
                  className="transition-all duration-150 font-heading"
                >
                  {d.month}
                </text>

                {/* Transparent Interaction Hit Area */}
                <rect
                  x={x - chartWidth / (data.length - 1) / 2}
                  y={0}
                  width={chartWidth / (data.length - 1)}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onTouchStart={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Clear hover area when cursor leaves SVG */}
        <div
          className="absolute inset-0 pointer-events-none"
          onMouseLeave={() => setHoveredIndex(null)}
        />

        {/* Modern Floating Tooltip Card */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            style={{
              left: `${tooltipX}px`,
              top: '4px',
            }}
            className={cn(
              'absolute z-20 pointer-events-none transition-all duration-150 ease-out',
              tooltipTransform
            )}
          >
            <div className="bg-white/95 backdrop-blur-md text-slate-800 text-xs rounded-xl p-2.5 shadow-xl shadow-slate-900/10 border border-slate-200/90 min-w-[200px]">
              {/* Header: Month Title */}
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                <span className="text-[11px] font-bold text-[#102447] font-heading uppercase tracking-wider">
                  Bulan {data[hoveredIndex].month}
                </span>
                <span className="text-[10px] text-slate-400">Rincian Finansial</span>
              </div>

              {/* Series Data Rows */}
              <div className="space-y-1">
                {/* Pendapatan Kotor */}
                {visibleSeries.revenue && (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0866F5] shrink-0" />
                      <span className="text-slate-500 text-[11px]">Pendapatan Kotor</span>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatRupiah(data[hoveredIndex].pendapatanKotor)}
                    </span>
                  </div>
                )}

                {/* Profit Bersih */}
                {visibleSeries.profit && (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C] shrink-0" />
                      <span className="text-slate-500 text-[11px]">Profit Bersih</span>
                    </div>
                    <span className="font-bold text-emerald-600 tabular-nums">
                      {formatRupiah(data[hoveredIndex].profitBersih)}
                    </span>
                  </div>
                )}

                {/* Pengeluaran */}
                {visibleSeries.expense && (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] shrink-0" />
                      <span className="text-slate-500 text-[11px]">Pengeluaran</span>
                    </div>
                    <span className="font-bold text-rose-600 tabular-nums">
                      {formatRupiah(data[hoveredIndex].pengeluaran)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
