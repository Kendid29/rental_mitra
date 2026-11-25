export interface MonthlyFinancialData {
  bulan: string; // e.g. "Jan", "Feb", ...
  bulanTahun: string; // e.g. "Jan 2026"
  pendapatanKotor: number;
  komisiPlatform: number;
  pendapatanBersih: number;
  pengeluaran: number;
  labaOperasional: number;
  totalTransaksi: number;
}

export interface VehicleUtilizationData {
  vehicleId: string;
  vehicleName: string;
  platNomor: string;
  jenis: 'mobil' | 'motor';
  hariDisewa: number;
  totalHariPeriode: number;
  persentaseUtilisasi: number;
  totalPendapatan: number;
}

export interface ExpenseCategoryBreakdown {
  kategori: string;
  nominal: number;
  persentase: number;
}

export interface BusinessReportData {
  periodeLabel: string;
  rentangTanggal: { mulai: string; selesai: string };
  ringkasan: {
    totalOmzetKotor: number;
    totalKomisi: number;
    pendapatanBersih: number;
    totalPengeluaran: number;
    labaBersihOperasional: number;
    marginPersen: number;
    totalTransaksiSelesai: number;
    rataRataTransaksi: number;
  };
  trenBulanan: MonthlyFinancialData[];
  utilisasiArmada: VehicleUtilizationData[];
  distribusiPengeluaran: ExpenseCategoryBreakdown[];
}

export interface BusinessReportSummary {
  totalPendapatanKotor: number;
  totalKomisiPlatform: number;
  totalPendapatanBersih: number;
  totalPengeluaran: number;
  profitBersihOperasional: number;
  totalPenyewaanSelesai: number;
  tingkatUtilisasiRataRata: number;
}

export interface BusinessReportMonthlyTrend {
  month: string;
  pendapatanKotor: number;
  pengeluaran: number;
  profitBersih: number;
}

export interface BusinessReportExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface BusinessReportTopVehicle {
  vehicleId: string;
  nama: string;
  platNomor: string;
  tipe?: string;
  totalTransaksi: number;
  totalRevenue: number;
  utilisasiPersen: number;
}

export interface BusinessReport {
  period: string;
  generatedAt: string;
  summary: BusinessReportSummary;
  monthlyTrend: BusinessReportMonthlyTrend[];
  expenseBreakdown: BusinessReportExpenseBreakdown[];
  topVehicles: BusinessReportTopVehicle[];
}
