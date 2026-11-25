'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, PartnerBusiness, UserRole } from '@/types';
import { api } from '@/api';
import { mockStore } from '@/mocks/store';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  partner: PartnerBusiness | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchPartner: (partnerId: string) => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [partner, setPartner] = useState<PartnerBusiness | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    try {
      const res = await api.auth.getCurrentSession();
      if (res.success && res.data) {
        setUser(res.data.user);
        setPartner(res.data.partner);
      } else {
        // Fallback default
        const fallbackPartner = mockStore.getCurrentPartner();
        const fallbackUser = mockStore.getCurrentUser();
        setUser(fallbackUser);
        setPartner(fallbackPartner);
      }
    } catch (err) {
      console.error('Failed to init auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, pass);
      if (res.success && res.data) {
        setUser(res.data.user);
        setPartner(res.data.partner);
        toast.success(`Selamat datang kembali, ${res.data.user.name}!`);
        return true;
      } else {
        toast.error(res.error?.message || 'Login gagal, periksa email & password');
        return false;
      }
    } catch {
      toast.error('Terjadi kesalahan pada sistem saat login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
      setUser(null);
      setPartner(null);
      toast.success('Anda telah keluar dari Portal Mitra');
    } finally {
      setIsLoading(false);
    }
  };

  const switchPartner = async (partnerId: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.switchPartner(partnerId);
      if (res.success && res.data) {
        setUser(res.data.user);
        setPartner(res.data.partner);
        toast.success(`Beralih ke mitra: ${res.data.partner.name}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal beralih mitra');
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserRole = async (newRole: UserRole) => {
    if (!user || !partner) return;
    setIsLoading(true);
    try {
      const members = mockStore.getTeamMembers(partner.id);
      const targetUser = members.find((u) => u.role === newRole);
      if (targetUser) {
        mockStore.setSession(targetUser.id, partner.id, `mock-jwt-${targetUser.id}`);
        setUser(targetUser);
        toast.success(`Beralih peran ke: ${newRole === 'MITRA_OWNER' ? 'Owner / Pemilik' : 'Staff Operasional'}`);
      } else {
        toast.error('Akun untuk peran ini belum tersedia pada mitra aktif');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!partner) return;
    const res = await api.settings.getBusinessProfile(partner.id);
    if (res.success && res.data) {
      setPartner(res.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchPartner,
        switchUserRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
