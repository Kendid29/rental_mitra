'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0866F5] animate-pulse flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            R
          </div>
          <p className="text-xs font-semibold text-slate-500">Memuat Sesi Mitra...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <DashboardShell>{children}</DashboardShell>;
}
