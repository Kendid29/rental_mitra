export interface BankAccount {
  id: string;
  partnerId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface OperatingHoursObject {
  open: string;
  close: string;
  days?: string;
}

export interface PartnerBusiness {
  id: string;
  name: string;
  company?: string;
  businessType?: string;
  ownerName?: string;
  picName?: string;
  picPhone?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  address: string;
  postalCode?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  commissionRate?: number;
  operatingHours?: any;
  cooperationStatus?: 'aktif' | 'review' | 'suspend';
  verificationStatus?: 'verified' | 'unverified' | 'pending' | 'terverifikasi';
  totalUnits?: number;
  rating?: number;
  totalReviews?: number;
  bankAccounts: BankAccount[];
  createdAt: string;
  updatedAt: string;
}
