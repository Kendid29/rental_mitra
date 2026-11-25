'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { AuthUser } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Plus, Trash2, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamPage() {
  const { partner, user } = useAuth();
  const { isOwner } = usePermission();

  const [members, setMembers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  // Permissions state
  const [pKendaraan, setPKendaraan] = useState(true);
  const [pKetersediaan, setPKetersediaan] = useState(true);
  const [pSerahTerima, setPSerahTerima] = useState(true);
  const [pPengembalian, setPPengembalian] = useState(true);
  const [pMaintenance, setPMaintenance] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMembers = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const res = await api.team.getTeamMembers(partner.id);
      if (res.success && res.data) {
        setMembers(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [partner]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    if (!name || !email) {
      toast.error('Nama dan email staf wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.team.createTeamMember(partner.id, {
        email,
        name,
        role: 'MITRA_STAFF',
        permissions: {
          kelolaKendaraan: pKendaraan,
          kelolaKetersediaan: pKetersediaan,
          lihatPesanan: true,
          prosesSerahTerima: pSerahTerima,
          prosesPengembalian: pPengembalian,
          kelolaMaintenance: pMaintenance,
        },
      });

      if (res.success) {
        toast.success(`Akun staf "${name}" berhasil dibuat`);
        setIsModalOpen(false);
        setName('');
        setEmail('');
        loadMembers();
      } else {
        toast.error(res.error?.message || 'Gagal menambahkan staf');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string, mName: string) => {
    if (!confirm(`Hapus akun staf "${mName}"? Staf tidak akan dapat mengakses portal mitra lagi.`))
      return;
    if (!partner) return;

    const res = await api.team.deleteTeamMember(partner.id, id);
    if (res.success) {
      toast.success('Akun staf berhasil dihapus');
      loadMembers();
    } else {
      toast.error(res.error?.message || 'Gagal menghapus');
    }
  };

  if (!isOwner) {
    return (
      <Card className="p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900 font-heading">Akses Dibatasi</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Hanya Pemilik Bisnis (MITRA_OWNER) yang memiliki izin untuk menambah akun dan mengatur hak akses staf operasional.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Tim & Staf Operasional"
        subtitle="Kelola akun karyawan rental dan atur izin akses modul operasional"
        breadcrumbs={[{ label: 'Pengelolaan' }, { label: 'Tim & Staff' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Tambah Staf
          </Button>
        }
      />

      {/* Member Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-2.5">
            <div className="h-20 bg-white rounded-xl animate-pulse border border-slate-200" />
            <div className="h-20 bg-white rounded-xl animate-pulse border border-slate-200" />
          </div>
        ) : (
          members.map((m) => (
            <Card key={m.id} className="p-3.5 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none ${
                      m.role === 'MITRA_OWNER'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#102447] text-sm font-heading">{m.name}</span>
                      <Badge variant={m.role === 'MITRA_OWNER' ? 'blue' : 'emerald'} size="sm">
                        {m.role === 'MITRA_OWNER' ? 'OWNER (FULL)' : 'STAFF OPERASIONAL'}
                      </Badge>
                      {m.id === user?.id && (
                        <span className="text-[10px] text-slate-400 font-semibold">(Anda)</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{m.email}</p>

                    {/* Permissions summary chips */}
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                      {m.role === 'MITRA_OWNER' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-medium">
                          <ShieldCheck className="w-3 h-3 text-[#0866F5]" /> Akses Penuh: Keuangan, Tim, Pengaturan, Operasional
                        </span>
                      ) : (
                        <>
                          {m.permissions?.kelolaKendaraan && (
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                              Kendaraan
                            </span>
                          )}
                          {m.permissions?.kelolaKetersediaan && (
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                              Kalender
                            </span>
                          )}
                          {m.permissions?.prosesSerahTerima && (
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                              Serah Terima
                            </span>
                          )}
                          {m.permissions?.prosesPengembalian && (
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                              Pengembalian
                            </span>
                          )}
                          {m.permissions?.kelolaMaintenance && (
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                              Maintenance
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
                  {m.role !== 'MITRA_OWNER' && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteMember(m.id, m.name)}
                      title="Hapus Staf"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal Add Member */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Akun Staf Baru"
        description="Buat akun operasional untuk karyawan yang bertugas memeriksa armada dan serah terima."
      >
        <form onSubmit={handleAddMember} className="space-y-3">
          <Input
            label="Nama Lengkap Staf"
            placeholder="Contoh: Dedi Kurniawan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Login"
            type="email"
            placeholder="staf@nusantararent.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Kata Sandi Awal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Kata sandi default: password123 (dapat diubah nanti oleh staf)"
            required
          />

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-heading mb-2">
              Hak Akses Modul Operasional:
            </p>
            <div className="space-y-2">
              <Switch
                label="Kelola Inventaris Kendaraan"
                description="Bisa menambah, mengedit foto dan spesifikasi unit armada"
                checked={pKendaraan}
                onChange={setPKendaraan}
              />
              <Switch
                label="Kelola Jadwal & Ketersediaan"
                description="Bisa mengatur blackout date manual di kalender"
                checked={pKetersediaan}
                onChange={setPKetersediaan}
              />
              <Switch
                label="Proses Serah Terima Kunci"
                description="Bisa mengisi checklist serah terima, foto fisik, dan verifikasi KTP"
                checked={pSerahTerima}
                onChange={setPSerahTerima}
              />
              <Switch
                label="Proses Pengembalian Kendaraan"
                description="Bisa melakukan inspeksi akhir dan menyelesaikan pesanan"
                checked={pPengembalian}
                onChange={setPPengembalian}
              />
              <Switch
                label="Kelola Servis Maintenance"
                description="Bisa menjadwalkan kendaraan masuk bengkel"
                checked={pMaintenance}
                onChange={setPMaintenance}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Simpan Akun Staf
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
