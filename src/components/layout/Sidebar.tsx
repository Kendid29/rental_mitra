'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { modalBackdropVariants } from '@/lib/motion/variants';
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  ReceiptText,
  KeyRound,
  RotateCcw,
  Users,
  Wrench,
  TrendingUp,
  Receipt,
  FileCheck2,
  Building2,
  BarChart3,
  UserCog,
  Store,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { partner, user, logout } = useAuth();
  const { isOwner } = usePermission();

  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(0);

  useEffect(() => {
    if (!partner) return;
    api.notifications.getNotifications(partner.id).then((res) => {
      if (res.success && res.data) {
        setUnreadNotifCount(res.data.filter((n) => !n.isRead).length);
      }
    });
    api.bookings.getBookings(partner.id, { limit: 100 }).then((res) => {
      if (res.success && res.data) {
        const count = res.data.items.filter(
          (b) => b.status === 'diteruskan_mitra' || b.status === 'berjalan'
        ).length;
        setActiveBookingsCount(count);
      }
    });
  }, [partner]);

  const navigationSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'OPERASIONAL',
      items: [
        { label: 'Kendaraan', href: '/vehicles', icon: Car },
        { label: 'Ketersediaan Armada', href: '/availability', icon: CalendarDays },
        {
          label: 'Penyewaan',
          href: '/bookings',
          icon: ReceiptText,
          badge: activeBookingsCount > 0 ? String(activeBookingsCount) : undefined,
          badgeColor: 'bg-[#0866F5] text-white',
        },
        { label: 'Serah Terima', href: '/handover', icon: KeyRound },
        { label: 'Pengembalian', href: '/returns', icon: RotateCcw },
        { label: 'Pelanggan', href: '/customers', icon: Users },
        { label: 'Maintenance', href: '/maintenance', icon: Wrench },
      ],
    },
    ...(isOwner
      ? [
          {
            title: 'KEUANGAN',
            items: [
              { label: 'Pendapatan', href: '/finance/income', icon: TrendingUp },
              { label: 'Pengeluaran', href: '/finance/expenses', icon: Receipt },
              { label: 'Reimburse', href: '/finance/reimbursements', icon: FileCheck2 },
              { label: 'Rekening Bank', href: '/finance/bank-accounts', icon: Building2 },
            ],
          },
          {
            title: 'ANALISIS',
            items: [
              { label: 'Laporan', href: '/reports', icon: BarChart3 },
            ],
          },
          {
            title: 'PENGELOLAAN',
            items: [
              { label: 'Tim & Staff', href: '/team', icon: UserCog },
              { label: 'Profil Bisnis', href: '/settings/business', icon: Store },
              { label: 'Pengaturan Akun', href: '/settings/account', icon: Settings },
            ],
          },
        ]
      : [
          {
            title: 'PENGELOLAAN',
            items: [
              { label: 'Pengaturan Akun', href: '/settings/account', icon: Settings },
            ],
          },
        ]),
    {
      title: 'LAINNYA',
      items: [
        {
          label: 'Notifikasi',
          href: '/notifications',
          icon: Bell,
          badge: unreadNotifCount > 0 ? String(unreadNotifCount) : undefined,
          badgeColor: 'bg-emerald-500 text-white',
        },
        { label: 'Bantuan & SOP', href: '/help', icon: HelpCircle },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={modalBackdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container: Standardized 256px (w-64) */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#102447] text-white flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 border-r border-[#1a386c] shadow-[2px_0_12px_rgba(0,15,43,0.2)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header: Compact h-14 (56px) */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#1b3b72] shrink-0 bg-[#0d1d3a]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0866F5] flex items-center justify-center font-bold text-white text-base tracking-tight shrink-0 shadow-xs">
              R
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight font-heading text-white">
                  RentalinAja
                </span>
                <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                  Mitra
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[130px] font-medium leading-none mt-0.5">
                {partner?.city || 'Partner Portal'}
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Partner Info Mini Card */}
        <div className="px-3 py-2.5 bg-[#0d1d3a]/80 border-b border-[#1b3b72]/60 shrink-0">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-2">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate font-heading leading-tight">{partner?.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{partner?.city}</span>
              </div>
            </div>
            <span
              className={cn(
                'text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 uppercase tracking-wider',
                user?.role === 'MITRA_OWNER'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              )}
            >
              {user?.role === 'MITRA_OWNER' ? 'Owner' : 'Staff'}
            </span>
          </div>
        </div>

        {/* Navigation List: Compact spacing and item height */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 custom-scrollbar">
          {navigationSections.map((sec, sIdx) => (
            <div key={sIdx}>
              <div className="px-2 mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400/90 font-heading">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group select-none relative',
                        isActive
                          ? 'bg-[#0866F5] text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/8'
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-colors',
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {item.badge && (
                          <span
                            className={cn(
                              'px-1.5 py-0.2 rounded text-[9px] font-bold tabular-nums',
                              item.badgeColor || 'bg-blue-500 text-white'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3 h-3 opacity-80" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / User Profile & Logout */}
        <div className="p-2.5 border-t border-[#1b3b72] bg-[#0d1d3a] shrink-0">
          <div className="flex items-center gap-2 mb-2 px-1 truncate">
            <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold flex items-center justify-center text-[11px] shrink-0 select-none">
              {user?.name.charAt(0) || 'M'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full h-8 flex items-center justify-center gap-1.5 px-2.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-600/30 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
