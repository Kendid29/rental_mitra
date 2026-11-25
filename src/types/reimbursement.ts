export type ReimbursementStatus = 'belum_dibayar' | 'sudah_dibayar' | 'dibayar';

export interface ReimbursementBankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface Reimbursement {
  id: string;
  bookingId: string;
  bookingNumber: string;
  partnerId: string;

  customerName: string;
  vehicleName: string;
  platNomor: string;
  periodeSewa: string;

  totalTransaksiKotor: number;
  komisiPlatform: number;
  penyesuaian: number;
  nominalBersihMitra: number;

  bankTujuan: ReimbursementBankInfo;
  status: ReimbursementStatus;

  tanggalPembayaran?: string | null;
  referensiTransfer?: string | null;
  buktiTransferUrl?: string | null;
  catatanAdmin?: string | null;

  createdAt: string;
}
