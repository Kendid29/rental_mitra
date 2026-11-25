export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface DashboardMetrics {
  armada: {
    totalUnit: number;
    tersedia: number;
    disewa: number;
    maintenance: number;
  };
  pesanan: {
    total: number;
    menungguKonfirmasi: number;
    menungguSerahTerima: number;
    menungguPengembalian: number;
    berjalan: number;
    selesai: number;
  };
  keuangan: {
    pendapatanBulanIni: number;
    pengeluaranBulanIni: number;
    saldoReimburseMenunggu: number;
    totalProfitBersih: number;
  };
}
