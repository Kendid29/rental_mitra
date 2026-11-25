'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, Lock, Save, RefreshCcw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountSettingsPage() {
  const { user, partner } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profil akun berhasil diperbarui!');
    }, 500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Mohon isi kata sandi lama dan baru');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Kata sandi berhasil diubah!');
    }, 600);
  };

  const handleResetMockStore = () => {
    if (
      !confirm(
        'PERINGATAN: Apakah Anda yakin ingin mereset seluruh database mock browser ke kondisi awal? Semua transaksi sewa, jadwal, dan pengeluaran buatan akan dikembalikan ke data default.'
      )
    ) {
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('rentalinaja_mitra_mock_store_v1');
      toast.success('Database mock berhasil direset! Memuat ulang sistem...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Pengaturan Akun Pribadi"
        subtitle="Kelola informasi identitas akun login dan pembaruan kata sandi"
        breadcrumbs={[{ label: 'Pengelolaan' }, { label: 'Pengaturan Akun' }]}
      />

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0866F5]" />
            <CardTitle>Informasi Pengguna</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#102447] text-white flex items-center justify-center font-bold text-base shadow-xs select-none">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm font-heading">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-[#0866F5] border border-blue-100">
                    {user?.role === 'MITRA_OWNER' ? 'PEMILIK BISNIS' : 'STAF OPERASIONAL'}
                  </span>
                  <span className="text-[11px] text-slate-400">• {partner?.name}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Alamat Email Login"
                value={email}
                disabled
                helperText="Email terikat identitas resmi mitra"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Simpan Profil
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0866F5]" />
            <CardTitle>Ubah Kata Sandi</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <Input
              label="Kata Sandi Saat Ini"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Kata Sandi Baru"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Konfirmasi Kata Sandi Baru"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Lock className="w-3.5 h-3.5" />}>
                Perbarui Kata Sandi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone: Reset Mock Data */}
      <Card className="border-rose-200">
        <CardHeader className="bg-rose-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <CardTitle className="text-rose-900">Area Reset Data Demo (Mock DB)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-800">
              Reset Seluruh Database Simulasi Browser
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Menghapus semua perubahan data lokal dan mengembalikan armada, booking, dan transaksi ke kondisi default.
            </p>
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleResetMockStore}
            leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}
          >
            Reset Database Mock
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
