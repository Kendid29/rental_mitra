import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'slate',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-md select-none tracking-tight';

  const variants = {
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    blue: 'bg-blue-50 text-[#0866F5] border border-blue-200/60',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    red: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    purple: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'bg-transparent text-slate-600 border border-slate-300',
  };

  const dots = {
    emerald: 'bg-[#00C48C]',
    blue: 'bg-[#0866F5]',
    amber: 'bg-[#FFB800]',
    red: 'bg-[#FF4D4D]',
    purple: 'bg-indigo-600',
    slate: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />
      )}
      {children}
    </span>
  );
}
