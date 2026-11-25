import React from 'react';
import { cn } from '@/lib/utils';

export type DomainStatus =
  // Vehicle status
  | 'aktif'
  | 'tersedia'
  | 'disewa'
  | 'maintenance'
  | 'nonaktif'
  // Booking status
  | 'menunggu_konfirmasi'
  | 'terkonfirmasi'
  | 'diteruskan_mitra'
  | 'berjalan'
  | 'selesai'
  | 'dibatalkan'
  // Readiness
  | 'pending'
  | 'ready'
  | 'issue_reported'
  // Reimbursement / Payment
  | 'belum_dibayar'
  | 'dibayar'
  | 'lunas'
  | 'refunded'
  // Cleanliness
  | 'sangat_bersih'
  | 'cukup_bersih'
  | 'kotor';

interface StatusBadgeProps {
  status: DomainStatus | string;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  // Vehicle
  aktif: {
    label: 'Tersedia',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  tersedia: {
    label: 'Tersedia',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  disewa: {
    label: 'Disewa',
    bg: 'bg-blue-50',
    text: 'text-[#0866F5]',
    border: 'border-blue-200/60',
    dot: 'bg-[#0866F5]',
  },
  maintenance: {
    label: 'Servis Bengkel',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    dot: 'bg-amber-500',
  },
  nonaktif: {
    label: 'Nonaktif',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },

  // Booking
  menunggu_konfirmasi: {
    label: 'Menunggu Konfirmasi',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    dot: 'bg-amber-500',
  },
  terkonfirmasi: {
    label: 'Terkonfirmasi',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/60',
    dot: 'bg-blue-500',
  },
  diteruskan_mitra: {
    label: 'Diteruskan Mitra',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/60',
    dot: 'bg-indigo-500',
  },
  berjalan: {
    label: 'Aktif Berjalan',
    bg: 'bg-blue-50',
    text: 'text-[#0866F5]',
    border: 'border-blue-200/60',
    dot: 'bg-[#0866F5]',
  },
  selesai: {
    label: 'Selesai',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/60',
    dot: 'bg-rose-500',
  },

  // Partner Readiness
  ready: {
    label: 'Armada Siap',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Perlu Cek Kesiapan',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    dot: 'bg-amber-500',
  },
  issue_reported: {
    label: 'Kendala Dilaporkan',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/60',
    dot: 'bg-rose-500',
  },

  // Payment / Reimburse
  belum_dibayar: {
    label: 'Belum Ditransfer',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    dot: 'bg-amber-500',
  },
  dibayar: {
    label: 'Sudah Ditransfer',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  lunas: {
    label: 'Lunas',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  refunded: {
    label: 'Refund',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },

  // Cleanliness
  sangat_bersih: {
    label: 'Sangat Bersih',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  cukup_bersih: {
    label: 'Cukup Bersih',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/60',
    dot: 'bg-blue-500',
  },
  kotor: {
    label: 'Kotor',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    dot: 'bg-amber-500',
  },
};

export function StatusBadge({
  status,
  label,
  size = 'sm',
  showDot = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status.replace(/_/g, ' '),
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1 font-medium rounded',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border select-none tracking-tight whitespace-nowrap',
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span className={cn('inline-block rounded-full shrink-0', size === 'xs' ? 'w-1 h-1' : 'w-1.5 h-1.5', config.dot)} />
      )}
      <span>{label || config.label}</span>
    </span>
  );
}
