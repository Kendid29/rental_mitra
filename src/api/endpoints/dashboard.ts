import { USE_MOCK, request } from '../client';
import { mockStore } from '@/mocks/store';
import { simulatedDelay } from '@/mocks/delay';
import { Booking, Vehicle, MaintenanceRecord, Reimbursement, DashboardMetrics, ApiResponse } from '@/types';

export interface MonthlyChartPoint {
  bulan: string;
  pendapatanKotor: number;
  pendapatanBersih: number;
  pengeluaran: number;
}

export interface StatusDistributionPoint {
  status: string;
  count: number;
  color: string;
}

export interface DashboardData {
  metrics: {
    totalKendaraan: number;
    kendaraanTersedia: number;
    kendaraanDisewa: number;
    kendaraanMaintenance: number;
    pesananMasuk: number;
    pesananAktif: number;
    pesananSelesai: number;
    totalPendapatanBulanIni: number;
    pendapatanBersihBulanIni: number;
    pengeluaranBulanIni: number;
    labaOperasionalBulanIni: number;
    reimburseBelumDiterima: number;
  };
  monthlyRevenueChart: MonthlyChartPoint[];
  statusDistribution: StatusDistributionPoint[];
  todaySchedule: {
    pickups: Booking[];
    returns: Booking[];
  };
  recentBookings: Booking[];
  activeMaintenance: MaintenanceRecord[];
  pendingReimbursements: Reimbursement[];
}

export const dashboardApi = {
  async getMetrics(partnerId?: string): Promise<ApiResponse<DashboardMetrics>> {
    await simulatedDelay(150, 300);
    const pId = partnerId || mockStore.getCurrentPartner().id;
    const vehicles = mockStore.getVehicles(pId);
    const bookings = mockStore.getBookings(pId);
    const income = mockStore.getIncomeLedger(pId);
    const expenses = mockStore.getExpenses(pId);
    const reimbursements = mockStore.getReimbursements(pId);

    const gross = income.reduce((acc, cur) => acc + cur.hargaSewaKotor, 0) || 28500000;
    const exp = expenses.reduce((acc, cur) => acc + cur.nominal, 0) || 5900000;
    const pendingReimb = reimbursements
      .filter((r) => r.status === 'belum_dibayar')
      .reduce((acc, cur) => acc + cur.nominalBersihMitra, 0);

    const metrics: DashboardMetrics = {
      armada: {
        totalUnit: vehicles.length,
        tersedia: vehicles.filter((v) => v.status === 'tersedia').length,
        disewa: vehicles.filter((v) => v.status === 'disewa').length,
        maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
      },
      pesanan: {
        total: bookings.length,
        menungguKonfirmasi: bookings.filter((b) => b.readinessStatus === 'pending').length,
        menungguSerahTerima: bookings.filter((b) => b.status === 'diteruskan_mitra').length,
        menungguPengembalian: bookings.filter((b) => b.status === 'berjalan').length,
        berjalan: bookings.filter((b) => b.status === 'berjalan').length,
        selesai: bookings.filter((b) => b.status === 'selesai').length,
      },
      keuangan: {
        pendapatanBulanIni: gross,
        pengeluaranBulanIni: exp,
        saldoReimburseMenunggu: pendingReimb,
        totalProfitBersih: gross - exp,
      },
    };

    return {
      success: true,
      data: metrics,
      message: 'Berhasil memuat metrik dashboard',
    };
  },

  async getDashboardData(partnerId?: string, timeFilter = 'bulan_ini'): Promise<DashboardData> {
    if (USE_MOCK) {
      await simulatedDelay(300, 600);
      const activePartnerId = partnerId || mockStore.getCurrentPartner().id;

      const vehicles = mockStore.getVehicles(activePartnerId);
      const bookings = mockStore.getBookings(activePartnerId);
      const maintenance = mockStore.getMaintenance(activePartnerId);
      const incomeLedger = mockStore.getIncomeLedger(activePartnerId);
      const expenses = mockStore.getExpenses(activePartnerId);
      const reimbursements = mockStore.getReimbursements(activePartnerId);

      // Metrics calculation
      const totalKendaraan = vehicles.length;
      const kendaraanTersedia = vehicles.filter((v) => v.status === 'tersedia').length;
      const kendaraanDisewa = vehicles.filter((v) => v.status === 'disewa').length;
      const kendaraanMaintenance = vehicles.filter((v) => v.status === 'maintenance').length;

      const pesananMasuk = bookings.filter((b) => b.status === 'diteruskan_mitra').length;
      const pesananAktif = bookings.filter((b) => b.status === 'berjalan').length;
      const pesananSelesai = bookings.filter((b) => b.status === 'selesai').length;

      const totalPendapatanBulanIni = incomeLedger.reduce((sum, i) => sum + i.hargaSewaKotor, 0);
      const pendapatanBersihBulanIni = incomeLedger.reduce((sum, i) => sum + i.hakBersihMitra, 0);
      const pengeluaranBulanIni = expenses.reduce((sum, e) => sum + e.nominal, 0);
      const labaOperasionalBulanIni = pendapatanBersihBulanIni - pengeluaranBulanIni;

      const reimburseBelumDiterima = reimbursements
        .filter((r) => r.status === 'belum_dibayar')
        .reduce((sum, r) => sum + r.nominalBersihMitra, 0);

      // Monthly Chart Points (last 6 months simulation)
      const months = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'];
      const monthlyRevenueChart: MonthlyChartPoint[] = months.map((m, idx) => {
        const factor = 0.6 + idx * 0.08;
        const gross = Math.round(totalPendapatanBulanIni * factor);
        const net = Math.round(gross * 0.9);
        const exp = Math.round(pengeluaranBulanIni * (0.7 + idx * 0.05));
        return {
          bulan: m,
          pendapatanKotor: idx === 5 ? totalPendapatanBulanIni : gross,
          pendapatanBersih: idx === 5 ? pendapatanBersihBulanIni : net,
          pengeluaran: idx === 5 ? pengeluaranBulanIni : exp,
        };
      });

      // Status distribution
      const statusDistribution: StatusDistributionPoint[] = [
        { status: 'Tersedia', count: kendaraanTersedia, color: '#00C48C' },
        { status: 'Disewa', count: kendaraanDisewa, color: '#0866F5' },
        { status: 'Perawatan', count: kendaraanMaintenance, color: '#FFB800' },
        { status: 'Nonaktif', count: vehicles.filter((v) => v.status === 'nonaktif').length, color: '#94A3B8' },
      ];

      // Today schedule simulation
      const todayDate = '2026-11-19';
      const pickups = bookings.filter((b) => b.tanggalMulai === todayDate && b.status !== 'dibatalkan');
      const returns = bookings.filter((b) => b.tanggalSelesai === todayDate && b.status !== 'dibatalkan');

      return {
        metrics: {
          totalKendaraan,
          kendaraanTersedia,
          kendaraanDisewa,
          kendaraanMaintenance,
          pesananMasuk,
          pesananAktif,
          pesananSelesai,
          totalPendapatanBulanIni,
          pendapatanBersihBulanIni,
          pengeluaranBulanIni,
          labaOperasionalBulanIni,
          reimburseBelumDiterima,
        },
        monthlyRevenueChart,
        statusDistribution,
        todaySchedule: {
          pickups,
          returns,
        },
        recentBookings: bookings.slice(0, 5),
        activeMaintenance: maintenance.filter((m) => m.status === 'sedang_dikerjakan'),
        pendingReimbursements: reimbursements.filter((r) => r.status === 'belum_dibayar'),
      };
    }
    return request<DashboardData>(`/dashboard?timeFilter=${timeFilter}`);
  },
};
