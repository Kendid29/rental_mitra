export interface CustomerRentalHistoryItem {
  bookingId: string;
  bookingNumber: string;
  vehicleName: string;
  platNomor: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  durasiHari: number;
  totalBiaya: number;
  status: string;
}

export interface Customer {
  id: string;
  partnerId: string;
  nama: string;
  email: string;
  phone?: string;
  telepon?: string;
  avatar?: string;
  nomorKtp?: string;
  alamat?: string;
  kotaAsal?: string;

  totalTransaksi?: number;
  totalPenyewaan?: number;
  totalDurasiHari?: number;
  totalPengeluaran: number;
  transaksiTerakhir?: string; // ISO date
  terakhirMenyewa?: string;

  rating?: number;
  status?: 'aktif' | 'perhatian' | 'blacklist';
  statusVerifikasi?: 'terverifikasi' | 'menunggu' | 'ditolak';
  catatanOperasional?: string;
  riwayatMasalah?: string[];

  riwayatSewa?: CustomerRentalHistoryItem[];
  createdAt: string;
}
