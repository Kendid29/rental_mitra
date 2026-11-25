import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Skeleton } from './EmptyState';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  className?: string;
  striped?: boolean;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'Belum ada data',
  emptyDescription = 'Data belum tersedia untuk kriteria filter yang Anda pilih.',
  emptyAction,
  page = 1,
  totalPages = 1,
  totalItems,
  onPageChange,
  onRowClick,
  className,
  striped = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs', className)}>
        <div className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-8 w-1/4 rounded-lg ml-auto" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto" data-lenis-prevent>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none font-heading whitespace-nowrap',
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px]">
            {data.map((row, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <tr
                  key={row.id ? String(row.id) : idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'transition-colors duration-100',
                    striped && isEven ? 'bg-slate-50/30' : 'bg-white',
                    onRowClick
                      ? 'hover:bg-blue-50/40 cursor-pointer active:bg-blue-50/60'
                      : 'hover:bg-slate-50/60'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-2.5 sm:py-3 text-slate-700', col.className)}>
                      {col.cell(row, idx)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && onPageChange && (
        <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between gap-3 flex-wrap text-xs text-slate-500">
          <div>
            Halaman <span className="font-semibold text-slate-800">{page}</span> dari{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span>
            {totalItems !== undefined && (
              <span className="ml-1 text-slate-400">
                ({totalItems} data)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Halaman Pertama"
            >
              <ChevronsLeft className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <span className="px-2.5 py-1 text-xs font-semibold text-[#0866F5] bg-blue-50/80 rounded-md border border-blue-100 tabular-nums">
              {page}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Halaman Terakhir"
            >
              <ChevronsRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
