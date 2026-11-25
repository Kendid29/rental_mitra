import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { HandoverChecklist, ApiResponse } from '@/types';

export const handoverApi = {
  /**
   * Mengambil data checklist serah terima berdasarkan bookingId
   */
  async getByBookingId(
    partnerId: string,
    bookingId: string
  ): Promise<ApiResponse<HandoverChecklist | null>> {
    await simulateDelay();

    const handover = mockStore.getHandoverByBookingId(partnerId, bookingId);
    return {
      success: true,
      data: handover || null,
      message: handover
        ? 'Data serah terima ditemukan'
        : 'Belum ada data serah terima untuk pesanan ini',
    };
  },

  /**
   * Menyimpan dan memproses serah terima kendaraan kepada pelanggan
   */
  async submitHandover(
    partnerId: string,
    input: Omit<HandoverChecklist, 'id' | 'createdAt'>
  ): Promise<ApiResponse<HandoverChecklist>> {
    await simulateDelay(700);

    try {
      const result = mockStore.completeHandover(partnerId, input);
      return {
        success: true,
        data: result,
        message: 'Serah terima kendaraan berhasil diproses. Status sewa kini AKTIF (Berjalan).',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'HANDOVER_FAILED',
          message: err.message || 'Gagal memproses serah terima',
        },
      };
    }
  },
};
