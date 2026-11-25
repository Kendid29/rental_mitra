import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { Reimbursement, PaginatedResponse, ApiResponse } from '@/types';
import { paginateList } from '@/mocks/query';

export const reimbursementsApi = {
  /**
   * Mengambil daftar pencairan dana / reimburse dari Admin platform
   * CATATAN: Mitra hanya membaca status dan melihat bukti transfer yang diunggah Admin.
   */
  async getReimbursements(
    partnerId: string,
    filters?: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<Reimbursement>>> {
    await simulateDelay();

    let items = mockStore.getReimbursements(partnerId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.bookingNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.vehicleName.toLowerCase().includes(q) ||
          (r.referensiTransfer && r.referensiTransfer.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== 'semua') {
      items = items.filter((r) => r.status === filters.status);
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
      message: 'Berhasil memuat daftar klaim reimburse dari Admin',
    };
  },

  /**
   * Mengambil detail klaim reimburse berdasarkan ID
   */
  async getReimbursementById(
    partnerId: string,
    id: string
  ): Promise<ApiResponse<Reimbursement>> {
    await simulateDelay();

    const record = mockStore.getReimbursementById(partnerId, id);
    if (!record) {
      return {
        success: false,
        error: {
          code: 'REIMBURSEMENT_NOT_FOUND',
          message: 'Data pencairan dana reimburse tidak ditemukan',
        },
      };
    }

    return {
      success: true,
      data: record,
      message: 'Berhasil memuat detail reimburse',
    };
  },
};
