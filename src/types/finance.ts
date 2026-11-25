export interface IncomeLedgerEntry {
  id: string;
  partnerId: string;
  bookingId: string;
  bookingNumber: string;
  vehicleId: string;
  vehicleName: string;
  platNomor: string;
  customerName: string;
  tanggalSelesai: string;

  hargaSewaKotor: number;
  komisiPlatform: number;
  persentaseKomisi: number;
  penyesuaian: number;
  hakBersihMitra: number;

  statusReimburse: 'belum_dibayar' | 'sudah_dibayar' | 'dibayar';
  reimbursementId?: string;
  createdAt: string;
}

export interface ExpenseEntry {
  id: string;
  nomorPengeluaran: string;
  partnerId: string;
  kategori: string;
  tanggal: string; // YYYY-MM-DD
  deskripsi: string;
  nominal: number;
  metodePembayaran: string;

  vehicleId?: string;
  vehicleName?: string;
  platNomor?: string;

  buktiFoto?: string;
  dicatatOleh: string;
  createdAt: string;
}

export interface FinanceSummary {
  totalPendapatanKotor: number;
  totalKomisiPlatform: number;
  totalPendapatanBersih: number;
  totalPengeluaranOperasional: number;
  labaOperasional: number;
  totalReimburseDiterima: number;
  totalReimburseBelumDibayar: number;
}
