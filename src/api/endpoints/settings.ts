import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { PartnerBusiness, ApiResponse } from '@/types';

export const settingsApi = {
  /**
   * Mengambil profil bisnis mitra aktif
   */
  async getBusinessProfile(partnerId: string): Promise<ApiResponse<PartnerBusiness>> {
    await simulateDelay();

    const partner = mockStore.getPartnerById(partnerId);
    if (!partner) {
      return {
        success: false,
        error: {
          code: 'PARTNER_NOT_FOUND',
          message: 'Data profil mitra tidak ditemukan',
        },
      };
    }

    return {
      success: true,
      data: partner,
      message: 'Berhasil memuat profil bisnis',
    };
  },

  /**
   * Memperbarui profil bisnis mitra (alamat, jam operasional, PIC, deskripsi)
   * Status kerjasama & status verifikasi tidak dapat diedit mitra (harus oleh Admin).
   */
  async updateBusinessProfile(
    partnerId: string,
    updates: Partial<PartnerBusiness>
  ): Promise<ApiResponse<PartnerBusiness>> {
    await simulateDelay(600);

    try {
      const updated = mockStore.updatePartnerProfile(partnerId, updates);
      return {
        success: true,
        data: updated,
        message: 'Profil bisnis mitra berhasil diperbarui',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'UPDATE_PROFILE_FAILED',
          message: err.message || 'Gagal memperbarui profil bisnis',
        },
      };
    }
  },
};
