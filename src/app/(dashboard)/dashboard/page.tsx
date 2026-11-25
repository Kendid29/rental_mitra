'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { DashboardMetrics, Booking } from '@/types';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatRupiah, formatDateShort, formatPhone } from '@/lib/format';
import {
  Car,
  KeyRound,
  RotateCcw,
  Wrench,
  TrendingUp,
  AlertCircle,
  Plus,
  CalendarDays,
  ReceiptText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export default function DashboardPage() {
  const { partner, user } = useAuth();
  const { isOwner } = usePermission();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partner) return;

    setIsLoading(true);
    Promise.all([
      api.dashboard.getMetrics(partner.id),
      api.bookings.getBookings(partner.id, { limit: 5 }),
    ])
      .then(([metricsRes, bookingsRes]) => {
        if (metricsRes.success && metricsRes.data) {
          setMetrics(metricsRes.data);
        }
        if (bookingsRes.success && bookingsRes.data) {
          setRecentBookings(bookingsRes.data.items);
        }
      })
      .finally(() => setIsLoading(false));
  }, [partner]);

  const monthlyTrendData = [
    { month: 'Jun', pendapatanKotor: 18500000, pengeluaran: 4200000, profitBersih: 12450000 },
    { month: 'Jul', pendapatanKotor: 22000000, pengeluaran: 5100000, profitBersih: 14700000 },
    { month: 'Agu', pendapatanKotor: 26500000, pengeluaran: 6300000, profitBersih: 17550000 },
    { month: 'Sep', pendapatanKotor: 24000000, pengeluaran: 4800000, profitBersih: 16800000 },
    { month: 'Okt', pendapatanKotor: 31000000, pengeluaran: 7200000, profitBersih: 20700000 },
    {
      month: 'Nov',
      pendapatanKotor: metrics?.keuangan.pendapatanBulanIni || 28500000,
      pengeluaran: metrics?.keuangan.pengeluaranBulanIni || 5900000,
      profitBersih:
        (metrics?.keuangan.pendapatanBulanIni || 28500000) -
        (metrics?.keuangan.pengeluaranBulanIni || 5900000),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Compact Operational Welcome Bar (~115px height) */}
      <div className="bg-[#102447] text-white rounded-xl p-4 sm:p-5 border border-[#1b3b72]/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Mitra Resmi
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {partner?.city} • Komisi Platform: {partner?.commissionRate || 10}%
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-heading tracking-tight text-white mt-1">
              {partner?.name || 'Portal Mitra'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Selamat datang, <span className="text-white font-medium">{user?.name}</span> ({user?.role === 'MITRA_OWNER' ? 'Owner' : 'Staf'}). Ringkasan armada & aktivitas operasional hari ini.
            </p>
          </div>

          {/* Compact Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/vehicles/new">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Tambah Armada
              </Button>
            </Link>
            <Link href="/availability">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                leftIcon={<CalendarDays className="w-3.5 h-3.5" />}
              >
                Kalender Jadwal
              </Button>
            </Link>
          </div>
        </div>

        {/* Integrated Fleet Distribution Strip */}
        {metrics && (
          <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                <strong className="text-white font-semibold">{metrics.armada.tersedia} Unit</strong> Tersedia
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>
                <strong className="text-white font-semibold">{metrics.armada.disewa} Unit</strong> Disewa
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>
                <strong className="text-white font-semibold">{metrics.armada.maintenance} Unit</strong> Servis
              </span>
            </div>
            <div className="sm:ml-auto text-[11px] text-slate-400">
              Total Kapasitas: <strong className="text-white font-semibold">{metrics.armada.totalUnit} Unit</strong>
            </div>
          </div>
        )}
      </div>

      {/* Primary Operational Metric Cards (4 columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Armada Siap Pakai"
          value={metrics ? `${metrics.armada.tersedia} Unit` : '...'}
          subtitle={`Total ${metrics?.armada.totalUnit || 0} unit armada`}
          icon={<Car className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Sewa Aktif Berjalan"
          value={metrics ? `${metrics.armada.disewa} Unit` : '...'}
          subtitle={`${metrics?.pesanan.menungguPengembalian || 0} jadwal kembali`}
          icon={<KeyRound className="w-4 h-4 text-[#0866F5]" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Menunggu Serah Terima"
          value={metrics ? metrics.pesanan.menungguSerahTerima : '...'}
          subtitle="Jadwal penyerahan kunci"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Unit Masuk Bengkel"
          value={metrics ? `${metrics.armada.maintenance} Unit` : '...'}
          subtitle="Sedang diservis/perbaikan"
          icon={<Wrench className="w-4 h-4 text-[#FF4D4D]" />}
          iconBg="bg-rose-50"
        />
      </div>

      {/* Financial Metrics (Only visible to MITRA_OWNER) */}
      {isOwner && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            title="Pendapatan Sewa (Bulan Ini)"
            value={metrics ? formatRupiah(metrics.keuangan.pendapatanBulanIni) : '...'}
            subtitle="Total bruto transaksi"
            trend={{ value: '+14.2%', isPositive: true, label: 'vs lalu' }}
            icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Pengeluaran Operasional"
            value={metrics ? formatRupiah(metrics.keuangan.pengeluaranBulanIni) : '...'}
            subtitle="Servis, BBM & kebutuhan"
            trend={{ value: '-5.1%', isPositive: true, label: 'efisiensi' }}
            icon={<TrendingUp className="w-4 h-4 text-rose-600" />}
            iconBg="bg-rose-50"
          />
          <StatCard
            title="Saldo Reimburse Menunggu"
            value={metrics ? formatRupiah(metrics.keuangan.saldoReimburseMenunggu) : '...'}
            subtitle="Menunggu transfer admin"
            icon={<Building2 className="w-4 h-4 text-[#0866F5]" />}
            iconBg="bg-blue-50"
          />
        </div>
      )}

      {/* Operational Attention Required Banner */}
      {metrics && metrics.pesanan.menungguKonfirmasi > 0 && (
        <div className="p-3.5 sm:p-4 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950 font-heading">
                {metrics.pesanan.menungguKonfirmasi} Pesanan Perlu Konfirmasi Kesiapan
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Pastikan unit armada telah dicuci bersih, BBM terisi, dan dokumen STNK siap.
              </p>
            </div>
          </div>
          <Link href="/bookings">
            <Button variant="primary" size="xs" className="bg-amber-600 hover:bg-amber-700 text-white border-0 shrink-0">
              Periksa
            </Button>
          </Link>
        </div>
      )}

      {/* Main Grid: Chart & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Trend Chart (2 cols) */}
        {isOwner ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Tren Finansial & Omzet 6 Bulan Terakhir</CardTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Perbandingan pendapatan kotor sewa, profit bersih, dan pengeluaran
                </p>
              </div>
              <Link href="/reports">
                <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Laporan Lengkap
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <LineAreaChart data={monthlyTrendData} height={200} />
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Ringkasan Aktivitas Operasional</CardTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tugas serah terima dan pengembalian unit aktif hari ini
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-900">Serah Terima Hari Ini</p>
                  <p className="text-xl font-bold text-[#0866F5] mt-1 tabular-nums">
                    {metrics?.pesanan.menungguSerahTerima || 0} Unit
                  </p>
                  <Link href="/handover">
                    <Button variant="primary" size="xs" className="mt-3 w-full">
                      Buka Checklist Serah Terima
                    </Button>
                  </Link>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-900">Pengembalian Hari Ini</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1 tabular-nums">
                    {metrics?.pesanan.menungguPengembalian || 0} Unit
                  </p>
                  <Link href="/returns">
                    <Button variant="success" size="xs" className="mt-3 w-full">
                      Buka Inspeksi Pengembalian
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Operations Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Aksi Cepat Operasional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/handover"
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-blue-50 text-[#0866F5] flex items-center justify-center shrink-0 border border-blue-100">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 font-heading">Checklist Serah Terima</p>
                  <p className="text-[10px] text-slate-500">Catat KM, BBM & Foto kondisi</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0866F5] transition-colors" />
            </Link>

            <Link
              href="/returns"
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 font-heading">Inspeksi Pengembalian</p>
                  <p className="text-[10px] text-slate-500">Cek denda telat & BBM</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link
              href="/maintenance/new"
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 font-heading">Jadwalkan Servis Bengkel</p>
                  <p className="text-[10px] text-slate-500">Blokir kalender otomatis</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </Link>

            <Link
              href="/finance/expenses"
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <ReceiptText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 font-heading">Catat Beban Operasional</p>
                  <p className="text-[10px] text-slate-500">Cuci, sparepart & BBM</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pesanan Rental Terbaru</CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">
              5 transaksi terakhir yang diteruskan dari sistem RentalinAja
            </p>
          </div>
          <Link href="/bookings">
            <Button variant="outline" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
              Lihat Semua
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-heading">
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">No. Pesanan</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Armada Kendaraan</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Pelanggan</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Jadwal Sewa</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Status</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Kesiapan</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-[#102447] tabular-nums font-heading">
                      {b.bookingNumber}
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                      <p className="font-semibold text-slate-800 font-heading">{b.vehicle.nama}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {b.vehicle.platNomor} • {(b.vehicle.tipe || b.vehicle.jenis || 'mobil').toUpperCase()}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                      <p className="font-medium text-slate-800">{b.customer.nama}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{formatPhone(b.customer.telepon || b.customer.phone || '')}</p>
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                      <p className="font-medium text-slate-700">
                        {formatDateShort(b.tanggalMulai)} - {formatDateShort(b.tanggalSelesai)}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{b.durasiHari} Hari Sewa</p>
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                      <StatusBadge status={b.readinessStatus} size="sm" />
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                      <Link href={`/bookings/${b.id}`}>
                        <Button variant="soft-blue" size="xs">
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
