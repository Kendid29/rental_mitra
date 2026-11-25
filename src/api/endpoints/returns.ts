import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { ReturnInspection, ApiResponse } from '@/types';

export const returnsApi = {
  /**
   * Mengambil data checklist inspeksi pengembalian berdasarkan bookingId
   */
  async getByBookingId(
    partnerId: string,
    bookingId: string
  ): Promise<ApiResponse<ReturnInspection | null>> {
    await simulateDelay();

    const inspection = mockStore.getReturnByBookingId(partnerId, bookingId);
    return {
      success: true,
      data: inspection || null,
      message: inspection
        ? 'Data inspeksi pengembalian ditemukan'
        : 'Belum ada data inspeksi pengembalian untuk pesanan ini',
    };
  },

  /**
   * Menyimpan dan memproses pengembalian kendaraan serta kalkulasi penalti/biaya tambahan
   */
  async submitReturn(
    partnerId: string,
    input: Omit<ReturnInspection, 'id' | 'createdAt'>
  ): Promise<ApiResponse<ReturnInspection>> {
    await simulateDelay(800);

    try {
      const result = mockStore.completeReturn(partnerId, input);
      return {
        success: true,
        data: result,
        message: 'Pengembalian kendaraan berhasil diselesaikan dan dicatat ke buku kas!',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'RETURN_FAILED',
          message: err.message || 'Gagal memproses pengembalian kendaraan',
        },
      };
    }
  },
};
