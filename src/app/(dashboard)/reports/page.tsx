'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { BusinessReport } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { formatRupiah } from '@/lib/format';
import {
  TrendingUp,
  Download,
  Percent,
  Receipt,
  Car,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { partner } = useAuth();
  const { isOwner } = usePermission();

  const [period, setPeriod] = useState<'30_hari' | '3_bulan' | 'tahun_ini' | 'semua'>('30_hari');
  const [report, setReport] = useState<BusinessReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partner) return;
    setIsLoading(true);
    api.reports
      .getBusinessReport(partner.id, period)
      .then((res) => {
        if (res.success && res.data) {
          setReport(res.data);
        }
      })
      .finally(() => setIsLoading(false));
  }, [partner, period]);

  if (!isOwner) {
    return (
      <Card className="p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900 font-heading">Akses Dibatasi</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Hanya Pemilik Bisnis (MITRA_OWNER) yang memiliki izin untuk menganalisis laporan performa bisnis dan margin laba.
        </p>
      </Card>
    );
  }

  const handleExportCSV = () => {
    if (!report) return;

    const summaryRows = [
      ['Indikator Finansial', 'Nominal (Rp)'],
      ['Total Pendapatan Kotor', report.summary.totalPendapatanKotor],
      ['Komisi Platform', report.summary.totalKomisiPlatform],
      ['Total Pendapatan Bersih', report.summary.totalPendapatanBersih],
      ['Total Pengeluaran Operasional', report.summary.totalPengeluaran],
      ['Profit Bersih Operasional', report.summary.profitBersihOperasional],
      ['Tingkat Utilisasi Rata-rata', `${report.summary.tingkatUtilisasiRataRata}%`],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + summaryRows.map((r) => r.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-analisis-bisnis-${partner?.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Laporan bisnis berhasil diekspor ke CSV!');
  };

  const donutColors = ['#0866F5', '#00C48C', '#FFB800', '#FF4D4D', '#8B5CF6', '#64748B'];

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Laporan Analitik & Performa Bisnis"
        subtitle="Analisis profitabilitas, efisiensi beban operasional, dan utilisasi armada"
        breadcrumbs={[{ label: 'Laporan Bisnis' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200/90 rounded-lg p-0.5 text-xs font-semibold h-8 shadow-xs">
              <button
                onClick={() => setPeriod('30_hari')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  period === '30_hari' ? 'bg-[#0866F5] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Hari
              </button>
              <button
                onClick={() => setPeriod('3_bulan')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  period === '3_bulan' ? 'bg-[#0866F5] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3 Bulan
              </button>
              <button
                onClick={() => setPeriod('tahun_ini')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  period === 'tahun_ini' ? 'bg-[#0866F5] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tahun Ini
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Ekspor CSV
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Pendapatan Sewa Kotor"
          value={report ? formatRupiah(report.summary.totalPendapatanKotor) : '...'}
          subtitle="Sebelum potongan komisi"
          icon={<Receipt className="w-4 h-4 text-[#0866F5]" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Hak Bersih Mitra"
          value={report ? formatRupiah(report.summary.totalPendapatanBersih) : '...'}
          subtitle="Setelah komisi 10%"
          icon={<TrendingUp className="w-4 h-4 text-[#00C48C]" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Pengeluaran Operasional"
          value={report ? formatRupiah(report.summary.totalPengeluaran) : '...'}
          subtitle="Beban armada & bengkel"
          icon={<Receipt className="w-4 h-4 text-rose-600" />}
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Laba Bersih Operasional"
          value={report ? formatRupiah(report.summary.profitBersihOperasional) : '...'}
          subtitle={`Utilisasi armada: ${report?.summary.tingkatUtilisasiRataRata || 78}%`}
          icon={<Percent className="w-4 h-4 text-emerald-700" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Monthly Financial Trend Chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Tren Finansial Bulanan</CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Omzet kotor, beban pengeluaran, dan profit bersih bulanan
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {report && <LineAreaChart data={report.monthlyTrend} height={200} />}
        </CardContent>
      </Card>

      {/* Breakdown Grid: Top Vehicles & Expense Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Top Performing Vehicles */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#0866F5]" />
              <CardTitle>Unit Paling Menguntungkan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {report && (
              <BarChart
                items={report.topVehicles.map((v: any) => ({
                  label: v.nama,
                  subLabel: v.platNomor,
                  value: v.totalRevenue,
                }))}
              />
            )}
          </CardContent>
        </Card>

        {/* Expense Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Beban Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            {report && (
              <DonutChart
                slices={report.expenseBreakdown.map((e: any, idx: number) => ({
                  label: e.category,
                  value: e.amount,
                  color: donutColors[idx % donutColors.length],
                }))}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
