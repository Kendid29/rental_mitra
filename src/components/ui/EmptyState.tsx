import React from 'react';
import { cn } from '@/lib/utils';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-slate-300',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0866F5] flex items-center justify-center mb-4 shadow-sm">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-[#102447] font-heading">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 mb-5 leading-relaxed">
        {description}
      </p>
      {action ? (
        action
      ) : (
        actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/70', className)}
      {...props}
    />
  );
}
