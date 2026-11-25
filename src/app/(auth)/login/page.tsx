'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DEMO_CREDENTIALS } from '@/lib/constants';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react';
import { PageTransition } from '@/components/motion/page-transition';
import { Reveal } from '@/components/motion/reveal';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('owner@nusantararent.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Email dan password wajib diisi');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setFormError('Email atau password tidak valid');
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    const success = await login(demoEmail, demoPass);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1d3a] flex flex-col items-center justify-center p-4 text-white selection:bg-[#0866F5] selection:text-white">
      <PageTransition className="w-full max-w-md flex flex-col items-center my-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#0866F5] flex items-center justify-center font-bold text-xl text-white mb-2.5 shadow-sm">
            R
          </div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h1 className="text-xl font-bold font-heading tracking-tight text-white">
              RentalinAja
            </h1>
            <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
              Mitra Portal
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Sistem Manajemen Operasional & Armada Mitra
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white text-[#102447] rounded-xl p-5 sm:p-6 shadow-md border border-slate-200">
          <div className="mb-4">
            <h2 className="text-base font-bold font-heading text-[#102447]">Masuk ke Portal Mitra</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Gunakan email bisnis atau pilih akun demo di bawah
            </p>
          </div>

          {formError && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[#FF4D4D] text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Email Bisnis / Akun Mitra"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@mitra.com"
              required
              leftIcon={<Mail className="w-3.5 h-3.5 text-slate-400" />}
            />

            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-3.5 h-3.5 text-slate-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-1"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Masuk ke Dashboard
            </Button>
          </form>

          {/* Demo Quick Logins (1-Click Switcher) */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0866F5]" />
                <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-heading">
                  1-Click Demo Akun
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Pilih Tenant
              </span>
            </div>

            <div className="space-y-2">
              {/* Nusantara Rent (Jogja) */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#102447] flex items-center gap-1.5 font-heading">
                    <Building2 className="w-3.5 h-3.5 text-[#0866F5]" />
                    Nusantara Rent (Yogyakarta)
                  </span>
                  <span className="text-[10px] text-slate-400">8 Armada</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin(DEMO_CREDENTIALS[0].email, DEMO_CREDENTIALS[0].password)
                    }
                    className="h-7 text-[11px] font-semibold rounded-md bg-blue-50 hover:bg-blue-100 text-[#0866F5] border border-blue-100 transition-colors cursor-pointer text-center"
                  >
                    Owner (Bambang)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin(DEMO_CREDENTIALS[1].email, DEMO_CREDENTIALS[1].password)
                    }
                    className="h-7 text-[11px] font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Staff (Dedi)
                  </button>
                </div>
              </div>

              {/* Maju Jaya Rent (Bandung) */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#102447] flex items-center gap-1.5 font-heading">
                    <Building2 className="w-3.5 h-3.5 text-[#0866F5]" />
                    Maju Jaya Rent (Bandung)
                  </span>
                  <span className="text-[10px] text-slate-400">6 Armada</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin(DEMO_CREDENTIALS[2].email, DEMO_CREDENTIALS[2].password)
                    }
                    className="h-7 text-[11px] font-semibold rounded-md bg-blue-50 hover:bg-blue-100 text-[#0866F5] border border-blue-100 transition-colors cursor-pointer text-center"
                  >
                    Owner (Hendra)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin(DEMO_CREDENTIALS[3].email, DEMO_CREDENTIALS[3].password)
                    }
                    className="h-7 text-[11px] font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Staff (Siti)
                  </button>
                </div>
              </div>

              {/* Sahabat Motor (Denpasar) */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#102447] flex items-center gap-1.5 font-heading">
                    <Building2 className="w-3.5 h-3.5 text-[#0866F5]" />
                    Sahabat Motor (Denpasar)
                  </span>
                  <span className="text-[10px] text-slate-400">8 Motor</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin(DEMO_CREDENTIALS[4].email, DEMO_CREDENTIALS[4].password)
                    }
                    className="h-7 text-[11px] font-semibold rounded-md bg-blue-50 hover:bg-blue-100 text-[#0866F5] border border-blue-100 transition-colors cursor-pointer text-center"
                  >
                    Owner (Wayan)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickLogin(DEMO_CREDENTIALS[5].email, DEMO_CREDENTIALS[5].password)
                    }
                    className="h-7 text-[11px] font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Staff (Ketut)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-slate-400 mt-5 text-center">
          &copy; 2026 RentalinAja Platform • Portal Mitra Kendaraan
        </p>
      </PageTransition>
    </div>
  );
}
