import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { BankAccount, ApiResponse } from '@/types';

export const bankAccountsApi = {
  /**
   * Mengambil daftar rekening bank mitra untuk pencairan reimburse
   */
  async getBankAccounts(partnerId: string): Promise<ApiResponse<BankAccount[]>> {
    await simulateDelay();

    const accounts = mockStore.getBankAccounts(partnerId);
    return {
      success: true,
      data: accounts,
      message: 'Berhasil memuat daftar rekening bank',
    };
  },

  /**
   * Menambahkan rekening bank baru
   */
  async addBankAccount(
    partnerId: string,
    account: Omit<BankAccount, 'id' | 'partnerId' | 'createdAt'>
  ): Promise<ApiResponse<BankAccount>> {
    await simulateDelay(600);

    try {
      const created = mockStore.addBankAccount(partnerId, account);
      return {
        success: true,
        data: created,
        message: 'Rekening bank baru berhasil ditambahkan',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'ADD_BANK_ACCOUNT_FAILED',
          message: err.message || 'Gagal menambahkan rekening bank',
        },
      };
    }
  },

  /**
   * Mengatur rekening menjadi rekening utama penerima dana
   */
  async setPrimary(
    partnerId: string,
    accountId: string
  ): Promise<ApiResponse<BankAccount>> {
    await simulateDelay(400);

    try {
      const updated = mockStore.updateBankAccount(partnerId, accountId, {
        isPrimary: true,
      });
      return {
        success: true,
        data: updated,
        message: 'Rekening berhasil diatur sebagai rekening utama pencairan',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'SET_PRIMARY_FAILED',
          message: err.message || 'Gagal mengubah rekening utama',
        },
      };
    }
  },

  /**
   * Menghapus rekening bank
   */
  async deleteBankAccount(
    partnerId: string,
    accountId: string
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    await simulateDelay(500);

    try {
      mockStore.deleteBankAccount(partnerId, accountId);
      return {
        success: true,
        data: { deleted: true },
        message: 'Rekening bank berhasil dihapus',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'DELETE_BANK_ACCOUNT_FAILED',
          message: err.message || 'Gagal menghapus rekening bank',
        },
      };
    }
  },
};
