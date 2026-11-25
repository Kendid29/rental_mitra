export type TransaksiStatus =
  | 'menunggu_konfirmasi'
  | 'terkonfirmasi'
  | 'diteruskan_mitra'
  | 'berjalan'
  | 'selesai'
  | 'dibatalkan';

export type BookingStatus = TransaksiStatus;

export type PartnerReadinessStatus = 'pending' | 'ready' | 'issue_reported';

export interface BookingTimelineItem {
  status: TransaksiStatus | string;
  label: string;
  timestamp: string;
  actor: string;
  notes?: string;
}

export interface BookingPriceBreakdown {
  hargaHarian: number;
  durasiHari: number;
  subtotalSewa: number;
  biayaProteksi: number;
  deposit: number;
  diskon: number;
  biayaTambahan: number;
  biayaSopir?: number;
  totalAkhir: number;
}

export interface BookingCustomer {
  id: string;
  nama: string;
  email: string;
  phone?: string;
  telepon?: string;
  nomorKtp?: string;
  kotaAsal?: string;
  avatar?: string;
}

export interface BookingVehicleSummary {
  id: string;
  nama: string;
  brand?: string;
  merek?: string;
  jenis?: 'mobil' | 'motor';
  tipe?: 'mobil' | 'motor';
  platNomor: string;
  transmisi?: 'Manual' | 'Matic' | 'manual' | 'otomatis';
  gambarUtama?: string;
  fotoUtama?: string;
  hargaPerHari: number;
  odometerKm?: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  partnerId: string;
  vehicleId: string;
  customerId: string;

  vehicle: BookingVehicleSummary;
  customer: BookingCustomer;

  tanggalMulai: string; // YYYY-MM-DD
  tanggalSelesai: string; // YYYY-MM-DD
  jamPengambilan?: string; // HH:mm
  jamPengembalian?: string; // HH:mm
  durasiHari: number;

  lokasiPengambilan?: string;
  lokasiPengembalian?: string;
  layananSewa?: 'lepas_kunci' | 'dengan_sopir';
  layanan?: {
    lepasKunci: boolean;
    denganSopir: boolean;
  };
  catatanPelanggan?: string;

  rincianBiaya: BookingPriceBreakdown;
  metodePembayaran?: string;
  adminPaymentConfirmed?: boolean;

  status: TransaksiStatus;
  readinessStatus: PartnerReadinessStatus;
  partnerNotes?: string;
  reportedIssue?: {
    alasan: string;
    catatan: string;
    dilaporkanPada: string;
  };

  timeline: BookingTimelineItem[];

  handoverId?: string;
  returnInspectionId?: string;
  reimbursementId?: string;

  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters {
  search?: string;
  status?: 'semua' | TransaksiStatus;
  readinessStatus?: 'semua' | PartnerReadinessStatus;
  vehicleType?: 'semua' | 'mobil' | 'motor';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  page?: number;
  limit?: number;
}
