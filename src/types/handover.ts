export type ChecklistCondition = 'baik' | 'perlu_perhatian' | 'rusak';

export interface HandoverVehicleEquipment {
  stnkAsli: boolean;
  kunciCadangan: boolean;
  banSerep: boolean;
  toolkit?: boolean;
  toolkitDongkrak?: boolean;
  kotakP3k?: boolean;
  jumlahHelm?: number;
  jasHujan?: boolean;
}

export interface HandoverPhysicalCondition {
  kebersihanKabin?: boolean;
  kebersihanEksterior?: boolean;
  catatanKerusakanAwal?: string;
}

export interface HandoverChecklist {
  id: string;
  bookingId: string;
  bookingNumber: string;
  partnerId: string;
  vehicleId: string;
  vehicleName?: string;
  platNomor?: string;
  customerName?: string;

  tanggalWaktu?: string;
  odometerAwalKm: number;
  levelBbmAwalPersen: number; // 0 - 100

  kondisiEksterior?: ChecklistCondition;
  kondisiInterior?: ChecklistCondition;
  kondisiBan?: ChecklistCondition;
  kondisiLampu?: ChecklistCondition;
  kondisiFisik?: HandoverPhysicalCondition;

  kelengkapan: HandoverVehicleEquipment;
  catatanKerusakanAwal?: string;
  fotoKondisiAwal?: string[];
  fotoDokumentasi?: string[];

  petugasStaffId?: string;
  namaPetugas: string;
  namaPenerimaKunci?: string;
  catatanPetugas?: string;
  dikonfirmasiOlehPenyewa?: boolean;
  status?: 'selesai' | 'draft';

  createdAt: string;
}
