export type UserRole = 'MITRA_OWNER' | 'MITRA_STAFF';

export interface StaffPermissions {
  viewVehicles?: boolean;
  manageVehicles?: boolean;
  kelolaKendaraan?: boolean;
  viewAvailability?: boolean;
  manageAvailability?: boolean;
  kelolaKetersediaan?: boolean;
  viewBookings?: boolean;
  lihatPesanan?: boolean;
  processHandover?: boolean;
  prosesSerahTerima?: boolean;
  processReturn?: boolean;
  prosesPengembalian?: boolean;
  manageMaintenance?: boolean;
  kelolaMaintenance?: boolean;
  viewFinances?: boolean;
  manageExpenses?: boolean;
  manageBankAccounts?: boolean;
  manageTeam?: boolean;
}

export interface AuthUser {
  id: string;
  partnerId: string;
  name: string;
  email: string;
  phone?: string;
  telepon?: string;
  role: UserRole;
  position?: string;
  permissions?: StaffPermissions;
  avatar?: string;
  status?: 'aktif' | 'nonaktif';
  lastActive?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  partner: {
    id: string;
    name: string;
    company?: string;
    businessType?: string;
    city: string;
    logo?: string;
  };
}

export interface SessionData {
  user: AuthUser;
  token: string;
  partnerId: string;
}
