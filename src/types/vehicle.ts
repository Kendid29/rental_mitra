export type JenisKendaraan = 'mobil' | 'motor';
export type VehicleStatus = 'tersedia' | 'disewa' | 'maintenance' | 'nonaktif';
export type Transmisi = 'Manual' | 'Matic' | 'manual' | 'otomatis';
export type VehiclePublicationStatus = 'draft' | 'menunggu_persetujuan' | 'aktif' | 'ditolak' | 'nonaktif';

export interface VehiclePolicy {
  areaPenggunaan?: string;
  aturanBahanBakar?: string;
  batasKeterlambatan?: string;
  aturanPembatalan?: string;
  syaratPenyewa?: string[];
}

export interface VehicleServiceOptions {
  lepasKunci: boolean;
  denganSopir: boolean;
  termasukBbm?: boolean;
}

export interface Vehicle {
  id: string;
  partnerId: string;
  nama: string;
  brand?: string;
  merek?: string;
  model: string;
  jenis?: JenisKendaraan;
  tipe?: JenisKendaraan;
  kategori: string;
  tahun: number;
  warna: string;
  platNomor: string;
  deskripsi: string;

  // Specifications
  transmisi: Transmisi;
  kapasitas?: number;
  kapasitasPenumpang?: number;
  bahanBakar: string;
  kapasitasMesin?: string; // e.g. "1500cc", "160cc"
  kapasitasMesinCc?: number;
  odometerKm: number;
  fitur: string[];

  // Pricing
  hargaPerHari: number;
  hargaAkhirPekan?: number;
  hargaMingguan?: number;
  hargaBulanan?: number;
  deposit?: number;
  depositJaminan?: number;
  biayaSopirPerHari?: number;
  biayaOvertimePerJam?: number;
  minimumSewaHari?: number;

  // Services
  lepasKunci?: boolean;
  denganSopir?: boolean;
  layanan?: VehicleServiceOptions;

  // Photos & Documents
  gambarUtama?: string;
  fotoUtama?: string;
  galeri?: string[];
  fotoGaleri?: string[];
  stnkFoto?: string;
  dokumenPendukung?: string[];

  // Policies & Publication
  kebijakan?: VehiclePolicy;
  kebijakanKhusus?: string;
  status: VehicleStatus;
  publikasiStatus: VehiclePublicationStatus;

  // Stats
  rating: number;
  totalUlasan: number;
  totalPenyewaan: number;

  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleInput {
  id?: string;
  partnerId?: string;
  nama: string;
  brand?: string;
  merek?: string;
  model: string;
  jenis?: JenisKendaraan;
  tipe?: JenisKendaraan;
  kategori: string;
  tahun: number;
  warna: string;
  platNomor: string;
  deskripsi: string;
  transmisi: Transmisi;
  kapasitas?: number;
  kapasitasPenumpang?: number;
  bahanBakar: string;
  kapasitasMesin?: string;
  kapasitasMesinCc?: number;
  odometerKm: number;
  fitur: string[];
  hargaPerHari: number;
  deposit?: number;
  depositJaminan?: number;
  biayaSopirPerHari?: number;
  lepasKunci?: boolean;
  denganSopir?: boolean;
  layanan?: VehicleServiceOptions;
  gambarUtama?: string;
  fotoUtama?: string;
  galeri?: string[];
  fotoGaleri?: string[];
  kebijakan?: VehiclePolicy;
  kebijakanKhusus?: string;
  status?: VehicleStatus;
  publikasiStatus?: VehiclePublicationStatus;
}

export interface VehicleFilters {
  search?: string;
  tipe?: 'semua' | 'mobil' | 'motor';
  status?: 'semua' | VehicleStatus;
  page?: number;
  limit?: number;
}
