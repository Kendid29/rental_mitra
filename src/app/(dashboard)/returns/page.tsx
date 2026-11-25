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
import { RotateCcw, ArrowRight, Eye } from 'lucide-react';

export default function ReturnsListPage() {
  const { partner } = useAuth();
  const [activeRentals, setActiveRentals] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partner) return;
    setIsLoading(true);
    api.bookings
      .getBookings(partner.id, { status: 'berjalan' })
      .then((res) => {
        if (res.success && res.data) {
          setActiveRentals(res.data.items);
        }
      })
      .finally(() => setIsLoading(false));
  }, [partner]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Pengembalian & Inspeksi Armada"
        subtitle="Daftar kendaraan yang saat ini sedang disewa aktif dan menunggu pengembalian unit"
        breadcrumbs={[{ label: 'Pengembalian' }]}
      />

      {/* Info Banner */}
      <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 shadow-xs">
        <div className="w-7 h-7 rounded-lg bg-[#00C48C] text-white flex items-center justify-center font-bold shrink-0">
          <RotateCcw className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="font-bold">SOP Pengembalian & Penutupan Sewa:</p>
          <p className="text-emerald-700 text-[11px] mt-0.5">
            Lakukan inspeksi fisik teliti (bodi, interior, ban), bandingkan level BBM dan KM aktual, serta hitung penalti keterlambatan jika penyewa mengembalikan lewat dari jadwal.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unit Sedang Disewa (Menunggu Pengembalian)</CardTitle>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {activeRentals.length} Berjalan
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : activeRentals.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada unit yang sedang disewa saat ini. Seluruh armada berada di pool atau bengkel.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeRentals.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-100">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#102447] text-xs font-heading">
                          #{b.bookingNumber}
                        </span>
                        <Badge variant="blue" size="sm" dot>
                          AKTIF BERJALAN
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5 font-heading">
                        {b.vehicle.nama} ({b.vehicle.platNomor})
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Penyewa: <span className="font-medium text-slate-700">{b.customer.nama}</span> ({formatPhone(b.customer.telepon || b.customer.phone || '')})
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Jatuh Tempo: <span className="font-semibold text-emerald-700">{formatDateIndo(b.tanggalSelesai)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link href={`/bookings/${b.id}`} title="Lihat Detail Pesanan">
                      <Button variant="outline" size="icon-sm" title="Lihat Detail" aria-label="Lihat Detail">
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                      </Button>
                    </Link>
                    <Link href={`/returns/${b.id}`}>
                      <Button
                        variant="success"
                        size="xs"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                      >
                        Mulai Inspeksi
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
