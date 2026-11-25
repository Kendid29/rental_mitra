'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { NotificationItem, PartnerBusiness } from '@/types';
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  CheckCircle2,
  LogOut,
  Store,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { formatDateTimeIndo } from '@/lib/format';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user, partner, switchPartner, switchUserRole, logout } = useAuth();

  const [partnersList, setPartnersList] = useState<PartnerBusiness[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [isPartnerMenuOpen, setIsPartnerMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const partnerMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load partners for switcher
    api.auth.getPartnersList().then((res) => {
      if (res.success && res.data) {
        setPartnersList(res.data);
      }
    });

    // Close popups on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (partnerMenuRef.current && !partnerMenuRef.current.contains(e.target as Node)) {
        setIsPartnerMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!partner) return;
    api.notifications.getNotifications(partner.id).then((res) => {
      if (res.success && res.data) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.isRead).length);
      }
    });
  }, [partner]);

  const handleMarkAllRead = async () => {
    if (!partner) return;
    await api.notifications.markAllAsRead(partner.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // Generate dynamic breadcrumb label
  const getBreadcrumbLabel = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0 || parts[0] === 'dashboard') return 'Dashboard';

    const map: Record<string, string> = {
      vehicles: 'Armada Kendaraan',
      availability: 'Ketersediaan Armada',
      bookings: 'Penyewaan',
      handover: 'Serah Terima',
      returns: 'Pengembalian',
      customers: 'Pelanggan',
      maintenance: 'Maintenance',
      finance: 'Keuangan',
      income: 'Pendapatan',
      expenses: 'Pengeluaran',
      reimbursements: 'Reimbursement',
      'bank-accounts': 'Rekening Bank',
      reports: 'Laporan',
      team: 'Tim & Staff',
      settings: 'Pengaturan',
      business: 'Profil Bisnis',
      account: 'Akun Pengguna',
      notifications: 'Notifikasi',
      help: 'Bantuan & SOP',
      new: 'Tambah Baru',
      edit: 'Edit Data',
    };

    return parts.map((p) => map[p] || p).join(' / ');
  };

  return (
    <header className="h-14 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 sticky top-0 z-30 px-3.5 sm:px-5 flex items-center justify-between transition-all shadow-xs">
      {/* Left side: Hamburger, Breadcrumbs */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
          title="Buka Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs for Desktop */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors font-medium">
            Portal Mitra
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#102447] font-semibold">{getBreadcrumbLabel()}</span>
        </div>
      </div>

      {/* Right side: Partner Switcher, Role Switcher, Notification, and User Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Partner Switcher Dropdown */}
        <div className="relative" ref={partnerMenuRef}>
          <button
            onClick={() => setIsPartnerMenuOpen(!isPartnerMenuOpen)}
            className="h-8 flex items-center gap-2 px-2.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors text-left shadow-xs cursor-pointer"
          >
            <div className="w-5 h-5 rounded-md bg-blue-50 text-[#0866F5] flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
              <Building2 className="w-3 h-3" />
            </div>
            <div className="hidden md:block truncate max-w-[140px]">
              <p className="text-xs font-semibold text-slate-800 truncate leading-none">
                {partner?.name || 'Pilih Mitra'}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Partner Switcher Popover */}
          {isPartnerMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-68 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 font-heading">Ganti Akun Mitra</p>
                <p className="text-[11px] text-slate-400">Pilih tenant rental kendaraan</p>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {partnersList.map((p) => {
                  const isCurrent = partner?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchPartner(p.id);
                        setIsPartnerMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="truncate pr-2">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isCurrent ? 'text-[#0866F5]' : 'text-slate-800'
                          }`}
                        >
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {p.city}
                        </p>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#0866F5] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Pill (Owner vs Staff) */}
        <div className="hidden sm:flex items-center h-8 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            onClick={() => switchUserRole('MITRA_OWNER')}
            className={`h-7 px-2.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              user?.role === 'MITRA_OWNER'
                ? 'bg-white text-[#102447] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Owner
          </button>
          <button
            onClick={() => switchUserRole('MITRA_STAFF')}
            className={`h-7 px-2.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              user?.role === 'MITRA_STAFF'
                ? 'bg-white text-[#102447] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Staff
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors border border-slate-200/80 bg-white shadow-xs flex items-center justify-center cursor-pointer"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF4D4D] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-1.5 w-80 sm:w-88 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#102447] font-heading">Notifikasi</h4>
                  <p className="text-[10px] text-slate-400">
                    {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua terbaca'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-semibold text-[#0866F5] hover:underline cursor-pointer"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">Tidak ada notifikasi</div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                        !notif.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-800 text-xs">{notif.title}</p>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0866F5] shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatDateTimeIndo(notif.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-semibold text-[#0866F5] hover:underline block py-0.5"
                >
                  Lihat Semua Notifikasi
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="h-8 flex items-center gap-2 px-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/80 bg-white shadow-xs cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#102447] text-white font-bold flex items-center justify-center text-[10px] shrink-0 select-none">
              {user?.name.charAt(0) || 'M'}
            </div>
            <div className="hidden lg:block text-left pr-0.5">
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[90px] leading-none">
                {user?.name}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-50 text-[#0866F5] border border-blue-100 uppercase tracking-wide">
                    {user?.role === 'MITRA_OWNER' ? 'Owner (Full)' : 'Staff (Operasional)'}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/settings/account"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pengaturan Akun</span>
                </Link>
                <Link
                  href="/settings/business"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profil Bisnis</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
