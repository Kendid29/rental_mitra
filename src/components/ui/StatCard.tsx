import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  accentGradient?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-slate-50 text-slate-600',
  iconColor,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="truncate">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-heading truncate">
            {title}
          </p>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-[#102447] tracking-tight tabular-nums font-body">
            {value}
          </div>
        </div>

        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-100',
            iconBg,
            iconColor
          )}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: 'w-4 h-4',
              })
            : icon}
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-1">
          {trend ? (
            <div className="flex items-center gap-1 font-medium">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.2 rounded',
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {trend.value}
              </span>
              <span className="text-slate-400 text-[10px]">{trend.label || 'vs bln lalu'}</span>
            </div>
          ) : (
            <div />
          )}

          {subtitle && (
            <span className="text-slate-400 text-[11px] truncate max-w-[170px]">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
