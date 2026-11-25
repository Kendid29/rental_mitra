export type MaintenanceStatus = 'dijadwalkan' | 'sedang_dikerjakan' | 'selesai' | 'dibatalkan';

export interface MaintenanceRecord {
  id: string;
  partnerId: string;
  vehicleId: string;
  vehicleName: string;
  platNomor: string;

  jenisPerawatan: string;
  tanggalMulai: string; // YYYY-MM-DD
  estimasiSelesai: string; // YYYY-MM-DD
  tanggalSelesaiAktual?: string;

  odometerKm: number;
  namaBengkel: string;
  kontakBengkel?: string;
  alamatBengkel?: string;

  biaya: number;
  deskripsiPekerjaan?: string;
  deskripsi?: string;
  fotoNota?: string;
  status: MaintenanceStatus;

  catatanTeknisi?: string;
  linkedExpenseId?: string;
  createdAt: string;
  createdBy?: string;
}

export interface CreateMaintenanceInput {
  id?: string;
  partnerId?: string;
  vehicleId: string;
  vehicleName: string;
  platNomor: string;
  jenisPerawatan: string;
  tanggalMulai: string;
  estimasiSelesai: string;
  tanggalSelesaiAktual?: string;
  odometerKm: number;
  namaBengkel: string;
  kontakBengkel?: string;
  alamatBengkel?: string;
  biaya: number;
  deskripsiPekerjaan?: string;
  deskripsi?: string;
  fotoNota?: string;
  status?: MaintenanceStatus;
  catatanTeknisi?: string;
  linkedExpenseId?: string;
  createdBy?: string;
}
