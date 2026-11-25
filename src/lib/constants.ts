export const TRANSACTION_STATUS_META = {
  menunggu_konfirmasi: {
    label: 'Menunggu Konfirmasi',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    description: 'Menunggu verifikasi pembayaran oleh Admin platform',
  },
  terkonfirmasi: {
    label: 'Terkonfirmasi',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    description: 'Pembayaran telah divalidasi admin',
  },
  diteruskan_mitra: {
    label: 'Pesanan Diteruskan',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    description: 'Diteruskan ke Mitra untuk konfirmasi kesiapan unit',
  },
  berjalan: {
    label: 'Sedang Berjalan',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    description: 'Unit telah diserahterimakan dan masa sewa aktif',
  },
  selesai: {
    label: 'Selesai',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/80',
    description: 'Unit telah dikembalikan dan transaksi tuntas',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    description: 'Pesanan telah dibatalkan resmi',
  },
} as const;

export const PARTNER_READINESS_STATUS_META = {
  pending: {
    label: 'Menunggu Pengecekan',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  ready: {
    label: 'Unit Siap',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  issue_reported: {
    label: 'Kendala Dilaporkan',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
} as const;

export const VEHICLE_STATUS_META = {
  tersedia: {
    label: 'Tersedia',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  disewa: {
    label: 'Disewa',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  maintenance: {
    label: 'Maintenance',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  nonaktif: {
    label: 'Nonaktif',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
} as const;

export const EXPENSE_CATEGORIES = [
  'Maintenance & Servis',
  'Bahan Bakar (BBM)',
  'Cuci & Salon Mobil',
  'Gaji & Uang Makan Driver',
  'Pajak & STNK',
  'Lain-lain',
] as const;

export const MAINTENANCE_TYPES = [
  'Ganti Oli & Filter Mesin Rutin',
  'Servis Rem & Kaki-kaki',
  'Tune Up Mesin & Busi',
  'Penggantian Ban Baru',
  'Perawatan AC & Kuras Freon',
  'Pengecatan & Perbaikan Bodi',
  'Ganti Aki / Kelistrikan',
  'Lainnya',
] as const;

export const BANK_OPTIONS = [
  'BCA (Bank Central Asia)',
  'Bank Mandiri',
  'BRI (Bank Rakyat Indonesia)',
  'BNI (Bank Negara Indonesia)',
  'Bank Syariah Indonesia (BSI)',
  'CIMB Niaga',
  'Bank Permata',
  'Bank Danamon',
  'BCA Syariah',
] as const;

export const DEMO_CREDENTIALS = [
  {
    role: 'MITRA_OWNER',
    partnerName: 'Nusantara Rent (Yogyakarta)',
    partnerId: 'mitra-01',
    email: 'owner@nusantararent.demo',
    password: 'Password123!',
    name: 'Budi Santoso',
  },
  {
    role: 'MITRA_STAFF',
    partnerName: 'Nusantara Rent (Yogyakarta)',
    partnerId: 'mitra-01',
    email: 'staff@nusantararent.demo',
    password: 'Password123!',
    name: 'Doni Pratama',
  },
  {
    role: 'MITRA_OWNER',
    partnerName: 'Maju Jaya Rent (Bandung)',
    partnerId: 'mitra-02',
    email: 'owner@majujaya.demo',
    password: 'Password123!',
    name: 'Asep Suhendar',
  },
  {
    role: 'MITRA_STAFF',
    partnerName: 'Maju Jaya Rent (Bandung)',
    partnerId: 'mitra-02',
    email: 'staff@majujaya.demo',
    password: 'Password123!',
    name: 'Cecep Kurniawan',
  },
  {
    role: 'MITRA_OWNER',
    partnerName: 'Sahabat Motor (Denpasar)',
    partnerId: 'mitra-03',
    email: 'owner@sahabatmotor.demo',
    password: 'Password123!',
    name: 'Wayan Sudarma',
  },
  {
    role: 'MITRA_STAFF',
    partnerName: 'Sahabat Motor (Denpasar)',
    partnerId: 'mitra-03',
    email: 'staff@sahabatmotor.demo',
    password: 'Password123!',
    name: 'Made Artha',
  },
] as const;
