import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { AuthUser, ApiResponse } from '@/types';

export const teamApi = {
  /**
   * Mengambil daftar staf operasional mitra
   */
  async getTeamMembers(partnerId: string): Promise<ApiResponse<AuthUser[]>> {
    await simulateDelay();

    const users = mockStore.getTeamMembers(partnerId);
    return {
      success: true,
      data: users,
      message: 'Berhasil memuat daftar tim operasional',
    };
  },

  /**
   * Menambahkan staf operasional baru
   */
  async createTeamMember(
    partnerId: string,
    member: Omit<AuthUser, 'id' | 'partnerId' | 'lastActive'>
  ): Promise<ApiResponse<AuthUser>> {
    await simulateDelay(600);

    try {
      const created = mockStore.createTeamMember(partnerId, member);
      return {
        success: true,
        data: created,
        message: 'Akun staf baru berhasil dibuat',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'CREATE_MEMBER_FAILED',
          message: err.message || 'Gagal menambahkan anggota tim',
        },
      };
    }
  },

  /**
   * Memperbarui informasi atau izin staf
   */
  async updateTeamMember(
    partnerId: string,
    memberId: string,
    updates: Partial<AuthUser>
  ): Promise<ApiResponse<AuthUser>> {
    await simulateDelay(500);

    try {
      const updated = mockStore.updateTeamMember(partnerId, memberId, updates);
      return {
        success: true,
        data: updated,
        message: 'Data dan hak akses staf berhasil diperbarui',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'UPDATE_MEMBER_FAILED',
          message: err.message || 'Gagal memperbarui staf',
        },
      };
    }
  },

  /**
   * Menghapus staf
   */
  async deleteTeamMember(
    partnerId: string,
    memberId: string
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    await simulateDelay(500);

    try {
      mockStore.deleteTeamMember(partnerId, memberId);
      return {
        success: true,
        data: { deleted: true },
        message: 'Akun staf berhasil dihapus dari sistem mitra',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'DELETE_MEMBER_FAILED',
          message: err.message || 'Gagal menghapus staf',
        },
      };
    }
  },
};
