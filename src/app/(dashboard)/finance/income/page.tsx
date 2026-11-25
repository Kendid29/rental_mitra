'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { IncomeLedgerEntry } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { formatRupiah, formatDateShort } from '@/lib/format';
import { TrendingUp, Download, Receipt, Building2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IncomeLedgerPage() {
  const { partner } = useAuth();
  const { isOwner } = usePermission();

  const [entries, setEntries] = useState<IncomeLedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partner) return;
    setIsLoading(true);
    api.finance
      .getIncomeLedger(partner.id, { limit: 50 })
      .then((res) => {
        if (res.success && res.data) {
          setEntries(res.data.items);
        }
      })
      .finally(() => setIsLoading(false));
  }, [partner]);

  if (!isOwner) {
    return (
      <Card className="p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900 font-heading">Akses Dibatasi</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Hanya Pemilik Bisnis (MITRA_OWNER) yang memiliki izin untuk melihat laporan pendapatan dan pembukuan keuangan.
        </p>
      </Card>
    );
  }

  const totalKotor = entries.reduce((acc, cur) => acc + cur.hargaSewaKotor, 0);
  const totalKomisi = entries.reduce((acc, cur) => acc + cur.komisiPlatform, 0);
  const totalBersih = entries.reduce((acc, cur) => acc + cur.hakBersihMitra, 0);

  const handleExportCSV = () => {
    if (entries.length === 0) {
      toast.error('Tidak ada data pendapatan untuk diekspor');
      return;
    }

    const headers = [
      'No. Booking',
      'Kendaraan',
      'Plat Nomor',
      'Pelanggan',
      'Tanggal Selesai',
      'Harga Sewa Kotor',
      'Komisi Platform',
      'Hak Bersih Mitra',
      'Status Reimburse',
    ];

    const rows = entries.map((e) => [
      e.bookingNumber,
      `"${e.vehicleName}"`,
      e.platNomor,
      `"${e.customerName}"`,
      e.tanggalSelesai,
      e.hargaSewaKotor,
      e.komisiPlatform,
      e.hakBersihMitra,
      e.statusReimburse,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buku-pendapatan-${partner?.id || 'mitra'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Buku pendapatan berhasil diunduh dalam format CSV!');
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Buku Kas Pendapatan Sewa"
        subtitle="Rincian bruto, potongan platform (10%), dan hak bersih mitra"
        breadcrumbs={[{ label: 'Keuangan' }, { label: 'Pendapatan' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor Data (CSV)
          </Button>
        }
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="Total Transaksi Sewa Kotor"
          value={formatRupiah(totalKotor)}
          subtitle={`${entries.length} transaksi selesai`}
          icon={<Receipt className="w-4 h-4 text-[#0866F5]" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Potongan Komisi Platform"
          value={formatRupiah(totalKomisi)}
          subtitle="Rata-rata 10% per transaksi"
          icon={<TrendingUp className="w-4 h-4 text-rose-600" />}
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Hak Bersih Mitra"
          value={formatRupiah(totalBersih)}
          subtitle="Pencairan dana ke rekening"
          icon={<Building2 className="w-4 h-4 text-[#00C48C]" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Income Table */}
      <Card>
        <CardHeader>
          <CardTitle>Buku Besar Transaksi Rental Selesai</CardTitle>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {entries.length} Transaksi
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada transaksi rental yang berstatus selesai.
            </div>
          ) : (
            <div className="overflow-x-auto" data-lenis-prevent>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">No. Booking</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Kendaraan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Pelanggan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Tgl Selesai</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Sewa Kotor</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Komisi (10%)</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Hak Bersih</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">Status Reimburse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {entries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-[#102447] tabular-nums font-heading">
                        {e.bookingNumber}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-semibold text-slate-800 text-xs font-heading">{e.vehicleName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{e.platNomor}</p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-700 font-medium">
                        {e.customerName}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-600">
                        {formatDateShort(e.tanggalSelesai)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-800 font-medium tabular-nums">
                        {formatRupiah(e.hargaSewaKotor)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-rose-600 font-medium tabular-nums">
                        - {formatRupiah(e.komisiPlatform)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-bold text-emerald-600 tabular-nums">
                        {formatRupiah(e.hakBersihMitra)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                        <Badge
                          variant={e.statusReimburse === 'dibayar' || e.statusReimburse === 'sudah_dibayar' ? 'emerald' : 'amber'}
                          size="sm"
                        >
                          {e.statusReimburse === 'dibayar' || e.statusReimburse === 'sudah_dibayar' ? 'DITRANSFER' : 'MENUNGGU ADMIN'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
