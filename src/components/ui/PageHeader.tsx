import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={cn('flex items-center text-[11px] text-slate-500 gap-1.5', className)}>
      <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
        Portal Mitra
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900 transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#102447] font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5', className)}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-1">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
        <h1 className="text-lg sm:text-xl font-bold text-[#102447] font-heading tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 leading-normal">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
}
