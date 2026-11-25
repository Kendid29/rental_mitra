import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import {
  IncomeLedgerEntry,
  ExpenseEntry,
  PaginatedResponse,
  ApiResponse,
} from '@/types';
import { paginateList } from '@/mocks/query';

export const financeApi = {
  /**
   * Mengambil buku kas pendapatan (dari transaksi sewa yang selesai)
   */
  async getIncomeLedger(
    partnerId: string,
    filters?: {
      search?: string;
      statusReimburse?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<IncomeLedgerEntry>>> {
    await simulateDelay();

    let items = mockStore.getIncomeLedger(partnerId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.bookingNumber.toLowerCase().includes(q) ||
          i.vehicleName.toLowerCase().includes(q) ||
          i.platNomor.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q)
      );
    }

    if (filters?.statusReimburse && filters.statusReimburse !== 'semua') {
      items = items.filter((i) => i.statusReimburse === filters.statusReimburse);
    }

    if (filters?.startDate && filters?.endDate) {
      items = items.filter(
        (i) =>
          i.tanggalSelesai >= filters.startDate! &&
          i.tanggalSelesai <= filters.endDate!
      );
    }

    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const paginated = paginateList(items, page, limit);

    return {
      success: true,
      data: paginated,
      message: 'Berhasil memuat buku kas pendapatan',
    };
  },

  /**
   * Mengambil daftar pengeluaran operasional mitra
   */
  async getExpenses(
    partnerId: string,
    filters?: {
      search?: string;
      kategori?: string;
      vehicleId?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<ExpenseEntry>>> {
    await simulateDelay();

    let items = mockStore.getExpenses(partnerId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (e) =>
          e.nomorPengeluaran.toLowerCase().includes(q) ||
          e.deskripsi.toLowerCase().includes(q) ||
          (e.vehicleName && e.vehicleName.toLowerCase().includes(q)) ||
          (e.platNomor && e.platNomor.toLowerCase().includes(q))
      );
    }

    if (filters?.kategori && filters.kategori !== 'semua') {
      items = items.filter((e) => e.kategori === filters.kategori);
    }

    if (filters?.vehicleId && filters.vehicleId !== 'semua') {
      items = items.filter((e) => e.vehicleId === filters.vehicleId);
    }

    items.sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const paginated = paginateList(items, page, limit);

    return {
      success: true,
      data: paginated,
      message: 'Berhasil memuat daftar pengeluaran',
    };
  },

  /**
   * Mencatat pengeluaran operasional baru
   */
  async createExpense(
    partnerId: string,
    input: Omit<ExpenseEntry, 'id' | 'nomorPengeluaran' | 'partnerId' | 'createdAt'>
  ): Promise<ApiResponse<ExpenseEntry>> {
    await simulateDelay(600);

    try {
      const created = mockStore.createExpense(partnerId, input);
      return {
        success: true,
        data: created,
        message: 'Pengeluaran berhasil dicatat ke buku kas operasional',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'CREATE_EXPENSE_FAILED',
          message: err.message || 'Gagal mencatat pengeluaran',
        },
      };
    }
  },

  /**
   * Menghapus catatan pengeluaran
   */
  async deleteExpense(
    partnerId: string,
    expenseId: string
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    await simulateDelay(400);

    try {
      mockStore.deleteExpense(partnerId, expenseId);
      return {
        success: true,
        data: { deleted: true },
        message: 'Catatan pengeluaran berhasil dihapus',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'DELETE_EXPENSE_FAILED',
          message: err.message || 'Gagal menghapus pengeluaran',
        },
      };
    }
  },
};
