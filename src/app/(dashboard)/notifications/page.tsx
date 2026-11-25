'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { NotificationItem } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDateTimeIndo } from '@/lib/format';
import { Bell, CheckCheck, ExternalLink, KeyRound, Receipt, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { partner } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifs = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const res = await api.notifications.getNotifications(partner.id);
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, [partner]);

  const handleMarkAsRead = async (id: string) => {
    if (!partner) return;
    await api.notifications.markAsRead(partner.id, id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    if (!partner) return;
    await api.notifications.markAllAsRead(partner.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Semua notifikasi ditandai telah dibaca');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'pesanan':
        return <KeyRound className="w-3.5 h-3.5 text-blue-600" />;
      case 'keuangan':
        return <Receipt className="w-3.5 h-3.5 text-emerald-600" />;
      case 'maintenance':
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Pusat Notifikasi & Aktivitas"
        subtitle="Pemberitahuan transaksi sewa baru, serah terima, pengembalian, dan konfirmasi reimburse"
        breadcrumbs={[{ label: 'Notifikasi' }]}
        actions={
          notifications.some((n) => !n.isRead) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
            >
              Tandai Semua Dibaca
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada notifikasi saat ini.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 sm:p-4 flex items-start justify-between gap-3 transition-colors ${
                    !n.isRead ? 'bg-blue-50/25' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-800 text-xs font-heading">
                          {n.title}
                        </span>
                        {!n.isRead && (
                          <Badge variant="blue" size="sm">
                            BARU
                          </Badge>
                        )}
                        <Badge variant="slate" size="sm">
                          {n.category.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatDateTimeIndo(n.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!n.isRead && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleMarkAsRead(n.id)}
                      >
                        Dibaca
                      </Button>
                    )}
                    {n.link && (
                      <Link href={n.link} onClick={() => handleMarkAsRead(n.id)}>
                        <Button variant="outline" size="xs" rightIcon={<ExternalLink className="w-3 h-3" />}>
                          Buka
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
