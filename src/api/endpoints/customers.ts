import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { Customer, PaginatedResponse, ApiResponse } from '@/types';
import { paginateList } from '@/mocks/query';

export const customersApi = {
  /**
   * Mengambil daftar pelanggan mitra
   */
  async getCustomers(
    partnerId: string,
    filters?: { search?: string; statusVerifikasi?: string; page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    await simulateDelay();

    let items = mockStore.getCustomers(partnerId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.nama.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.telepon && c.telepon.includes(q)) ||
          (c.phone && c.phone.includes(q)) ||
          (c.kotaAsal && c.kotaAsal.toLowerCase().includes(q))
      );
    }

    if (filters?.statusVerifikasi && filters.statusVerifikasi !== 'semua') {
      items = items.filter((c) => c.statusVerifikasi === filters.statusVerifikasi);
    }

    items.sort(
      (a, b) =>
        new Date(b.terakhirMenyewa || b.transaksiTerakhir || 0).getTime() -
        new Date(a.terakhirMenyewa || a.transaksiTerakhir || 0).getTime()
    );

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const paginated = paginateList(items, page, limit);

    return {
      success: true,
      data: paginated,
      message: 'Berhasil memuat daftar pelanggan',
    };
  },

  /**
   * Mengambil detail pelanggan berdasarkan ID
   */
  async getCustomerById(
    partnerId: string,
    customerId: string
  ): Promise<ApiResponse<Customer>> {
    await simulateDelay();

    const customer = mockStore.getCustomerById(partnerId, customerId);
    if (!customer) {
      return {
        success: false,
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: 'Pelanggan tidak ditemukan dalam database mitra Anda',
        },
      };
    }

    return {
      success: true,
      data: customer,
      message: 'Berhasil memuat detail pelanggan',
    };
  },

  /**
   * Memperbarui catatan internal operasional pelanggan oleh mitra
   */
  async updateCustomerNotes(
    partnerId: string,
    customerId: string,
    notes: string
  ): Promise<ApiResponse<Customer>> {
    await simulateDelay(400);

    try {
      const updated = mockStore.updateCustomerNotes(partnerId, customerId, notes);
      return {
        success: true,
        data: updated,
        message: 'Catatan operasional pelanggan berhasil diperbarui',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: err.message || 'Gagal memperbarui catatan pelanggan',
        },
      };
    }
  },
};
