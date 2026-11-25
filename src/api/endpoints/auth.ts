import { USE_MOCK, request } from '../client';
import { mockStore } from '@/mocks/store';
import { simulatedDelay } from '@/mocks/delay';
import { AuthUser, PartnerBusiness, ApiResponse } from '@/types';

export interface LoginParams {
  email: string;
  password?: string;
  kataSandi?: string;
}

export const authApi = {
  async login(
    emailOrObj: string | LoginParams,
    passwordOrNothing?: string
  ): Promise<ApiResponse<{ user: AuthUser; partner: PartnerBusiness; token: string }>> {
    const email = typeof emailOrObj === 'string' ? emailOrObj : emailOrObj.email;
    const pass =
      typeof emailOrObj === 'string'
        ? passwordOrNothing || ''
        : emailOrObj.password || emailOrObj.kataSandi || '';

    if (USE_MOCK) {
      await simulatedDelay(250, 400);
      const user = mockStore.getUserByEmail(email);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'AUTH_FAILED',
            message: 'Email atau kata sandi tidak cocok. Gunakan akun demo yang tersedia.',
          },
        };
      }

      const partner = mockStore.getPartnerById(user.partnerId);
      if (!partner) {
        return {
          success: false,
          error: {
            code: 'PARTNER_NOT_FOUND',
            message: 'Profil mitra tidak ditemukan.',
          },
        };
      }

      const token = `mock-token-${user.id}-${Date.now()}`;
      mockStore.setSession(user.id, user.partnerId, token);

      if (typeof window !== 'undefined') {
        localStorage.setItem('rental_mitra_token', token);
        localStorage.setItem('rental_mitra_partner_id', user.partnerId);
      }

      return {
        success: true,
        data: {
          user,
          partner,
          token,
        },
        message: 'Login berhasil',
      };
    }

    return request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
  },

  async logout(): Promise<ApiResponse<{ loggedOut: boolean }>> {
    if (USE_MOCK) {
      await simulatedDelay(100, 200);
      mockStore.clearSession();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rental_mitra_token');
        localStorage.removeItem('rental_mitra_partner_id');
      }
      return { success: true, data: { loggedOut: true }, message: 'Logout berhasil' };
    }
    return request<any>('/auth/logout', { method: 'POST' });
  },

  async getCurrentSession(): Promise<ApiResponse<{ user: AuthUser; partner: PartnerBusiness }>> {
    if (USE_MOCK) {
      await simulatedDelay(100, 200);
      const user = mockStore.getCurrentUser();
      const partner = mockStore.getCurrentPartner();
      if (!user || !partner) {
        return {
          success: false,
          error: { code: 'NO_SESSION', message: 'Sesi belum ada' },
        };
      }
      return {
        success: true,
        data: { user, partner },
        message: 'Sesi aktif ditemukan',
      };
    }
    return request<any>('/auth/session');
  },

  async getSession(): Promise<{ user: AuthUser; partnerId: string } | null> {
    const res = await this.getCurrentSession();
    if (res.success && res.data) {
      return { user: res.data.user, partnerId: res.data.partner.id };
    }
    return null;
  },

  async switchPartner(
    partnerId: string
  ): Promise<ApiResponse<{ user: AuthUser; partner: PartnerBusiness }>> {
    if (USE_MOCK) {
      await simulatedDelay(150, 300);
      mockStore.switchActivePartner(partnerId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rental_mitra_partner_id', partnerId);
      }
      const user = mockStore.getCurrentUser();
      const partner = mockStore.getCurrentPartner();
      return {
        success: true,
        data: { user: user!, partner: partner! },
        message: 'Berhasil beralih mitra',
      };
    }
    return request<any>(`/auth/switch-partner/${partnerId}`, { method: 'POST' });
  },

  async getPartnersList(): Promise<ApiResponse<PartnerBusiness[]>> {
    await simulatedDelay(100, 200);
    const p1 = mockStore.getPartnerById('mitra-01');
    const p2 = mockStore.getPartnerById('mitra-02');
    const p3 = mockStore.getPartnerById('mitra-03');
    const partners = [p1, p2, p3].filter(Boolean) as PartnerBusiness[];
    return {
      success: true,
      data: partners,
      message: 'Berhasil memuat daftar mitra',
    };
  },
};
