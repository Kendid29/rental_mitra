'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { Booking } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateIndo, formatPhone } from '@/lib/format';
import { KeyRound, ArrowRight } from 'lucide-react';

export default function HandoverListPage() {
  const { partner } = useAuth();
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partner) return;
    setIsLoading(true);
    api.bookings
      .getBookings(partner.id, { status: 'diteruskan_mitra' })
      .then((res) => {
        if (res.success && res.data) {
          setPendingBookings(res.data.items);
        }
      })
      .finally(() => setIsLoading(false));
  }, [partner]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Serah Terima Kunci Kendaraan"
        subtitle="Daftar pesanan aktif yang siap diserahterimakan kepada penyewa hari ini"
        breadcrumbs={[{ label: 'Serah Terima' }]}
      />

      {/* Info Card */}
      <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-center gap-2.5 text-xs text-blue-900 shadow-xs">
        <div className="w-7 h-7 rounded-lg bg-[#0866F5] text-white flex items-center justify-center font-bold shrink-0">
          <KeyRound className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="font-bold">SOP Serah Terima RentalinAja:</p>
          <p className="text-blue-700 text-[11px] mt-0.5">
            Periksa KTP/SIM fisik penyewa, catat KM & BBM aktual, serta dokumentasikan foto 4 sisi kendaraan bersama penyewa sebelum penyerahan kunci.
          </p>
        </div>
      </div>

      {/* Pending Handover List */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Siap Diserahterimakan</CardTitle>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {pendingBookings.length} Menunggu
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada serah terima yang tertunda. Semua unit yang diteruskan telah diserahkan.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0866F5] flex items-center justify-center font-bold shrink-0 border border-blue-100">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#102447] text-xs font-heading">
                          #{b.bookingNumber}
                        </span>
                        <Badge
                          variant={b.readinessStatus === 'ready' ? 'emerald' : 'amber'}
                          size="sm"
                        >
                          {b.readinessStatus === 'ready' ? 'Unit Siap' : 'Perlu Cek'}
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5 font-heading">
                        {b.vehicle.nama} ({b.vehicle.platNomor})
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Penyewa: <span className="font-medium text-slate-700">{b.customer.nama}</span> ({formatPhone(b.customer.telepon || b.customer.phone || '')})
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Jadwal: <span className="font-semibold text-blue-700">{formatDateIndo(b.tanggalMulai)}</span> ({b.durasiHari} Hari)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link href={`/bookings/${b.id}`}>
                      <Button variant="outline" size="xs">
                        Detail
                      </Button>
                    </Link>
                    <Link href={`/handover/${b.id}`}>
                      <Button
                        variant="primary"
                        size="xs"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                      >
                        Isi Checklist
                      </Button>
                    </Link>
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
