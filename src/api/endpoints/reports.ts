import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { BusinessReport, ApiResponse } from '@/types';

export const reportsApi = {
  /**
   * Menghasilkan laporan analitik performa bisnis mitra
   */
  async getBusinessReport(
    partnerId: string,
    period: '30_hari' | '3_bulan' | 'tahun_ini' | 'semua' = '30_hari'
  ): Promise<ApiResponse<BusinessReport>> {
    await simulateDelay();

    const bookings = mockStore.getBookings(partnerId);
    const income = mockStore.getIncomeLedger(partnerId);
    const expenses = mockStore.getExpenses(partnerId);
    const vehicles = mockStore.getVehicles(partnerId);

    // Calculate totals
    const totalPendapatanKotor = income.reduce((acc, cur) => acc + cur.hargaSewaKotor, 0);
    const totalKomisiPlatform = income.reduce((acc, cur) => acc + cur.komisiPlatform, 0);
    const totalPendapatanBersih = income.reduce((acc, cur) => acc + cur.hakBersihMitra, 0);
    const totalPengeluaran = expenses.reduce((acc, cur) => acc + cur.nominal, 0);
    const profitBersihOperasional = totalPendapatanBersih - totalPengeluaran;

    // Monthly revenue trend (last 6 months simulation)
    const monthlyTrend = [
      { month: 'Jun 2026', pendapatanKotor: 18500000, pengeluaran: 4200000, profitBersih: 12450000 },
      { month: 'Jul 2026', pendapatanKotor: 22000000, pengeluaran: 5100000, profitBersih: 14700000 },
      { month: 'Agu 2026', pendapatanKotor: 26500000, pengeluaran: 6300000, profitBersih: 17550000 },
      { month: 'Sep 2026', pendapatanKotor: 24000000, pengeluaran: 4800000, profitBersih: 16800000 },
      { month: 'Okt 2026', pendapatanKotor: 31000000, pengeluaran: 7200000, profitBersih: 20700000 },
      { month: 'Nov 2026', pendapatanKotor: totalPendapatanKotor || 28500000, pengeluaran: totalPengeluaran || 5900000, profitBersih: profitBersihOperasional || 19750000 },
    ];

    // Expense breakdown by category
    const catMap: Record<string, number> = {};
    expenses.forEach((e) => {
      catMap[e.kategori] = (catMap[e.kategori] || 0) + e.nominal;
    });
    const expenseBreakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalPengeluaran > 0 ? Math.round((amount / totalPengeluaran) * 100) : 0,
    }));

    // Top performing vehicles
    const topVehicles = vehicles
      .map((v) => {
        const vehBookings = bookings.filter((b) => b.vehicleId === v.id && b.status === 'selesai');
        const vehRevenue = vehBookings.reduce((acc, cur) => acc + cur.rincianBiaya.subtotalSewa, 0);
        return {
          vehicleId: v.id,
          nama: v.nama,
          platNomor: v.platNomor,
          tipe: v.tipe,
          totalTransaksi: vehBookings.length || v.totalPenyewaan,
          totalRevenue: vehRevenue || v.hargaPerHari * 7,
          utilisasiPersen: Math.min(95, Math.max(35, Math.round(((v.totalPenyewaan * 3) / 30) * 100))),
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    const report: BusinessReport = {
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        totalPendapatanKotor,
        totalKomisiPlatform,
        totalPendapatanBersih,
        totalPengeluaran,
        profitBersihOperasional,
        totalPenyewaanSelesai: bookings.filter((b) => b.status === 'selesai').length,
        tingkatUtilisasiRataRata: 78,
      },
      monthlyTrend,
      expenseBreakdown,
      topVehicles,
    };

    return {
      success: true,
      data: report,
      message: 'Berhasil menghasilkan laporan analitik performa bisnis',
    };
  },
};
