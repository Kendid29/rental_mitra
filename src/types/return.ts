import { ChecklistCondition, HandoverVehicleEquipment } from './handover';

export interface ReturnPhysicalCondition {
  kebersihanKabin?: boolean;
  kebersihanEksterior?: boolean;
  kerusakanBaru?: string[];
}

export interface ReturnInspection {
  id: string;
  bookingId: string;
  bookingNumber: string;
  partnerId: string;
  vehicleId: string;
  vehicleName?: string;
  platNomor?: string;
  customerName?: string;

  tanggalWaktuKembali?: string;
  odometerAkhirKm: number;
  levelBbmAkhirPersen: number; // 0 - 100

  kondisiEksterior?: ChecklistCondition;
  kondisiInterior?: ChecklistCondition;
  kondisiBan?: ChecklistCondition;
  kondisiLampu?: ChecklistCondition;
  kondisiFisik?: ReturnPhysicalCondition;

  kelengkapan?: HandoverVehicleEquipment;
  adaKerusakanBaru?: boolean;
  deskripsiKerusakanBaru?: string;
  fotoKondisiKembali?: string[];

  // Adjustments & Penalties
  keterlambatanJam: number;
  biayaKeterlambatan: number;
  biayaKekuranganBbm?: number;
  biayaSelisihBbm?: number;
  biayaKerusakan: number;
  totalBiayaPenyesuaian: number;
  alasanPenyesuaian?: string;

  petugasStaffId?: string;
  namaPetugas: string;
  namaPengembali?: string;
  catatanPetugas?: string;
  dikonfirmasiOlehPenyewa?: boolean;
  status?: 'selesai' | 'draft';

  createdAt: string;
}
