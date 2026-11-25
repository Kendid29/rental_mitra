'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Store, Save, ShieldCheck, Clock, MapPin, Building2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BusinessSettingsPage() {
  const { partner, refreshProfile } = useAuth();
  const { isOwner } = usePermission();

  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [jamBuka, setJamBuka] = useState('07:00');
  const [jamTutup, setJamTutup] = useState('22:00');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (partner) {
      setName(partner.name || '');
      setBusinessType(partner.businessType || partner.company || 'PT / CV');
      setCity(partner.city || '');
      setAddress(partner.address || '');
      setPhone(partner.phone || '');
      setEmail(partner.email || '');
      setPicName(partner.picName || partner.ownerName || 'PIC Mitra');
      setPicPhone(partner.picPhone || partner.whatsapp || partner.phone || '');
      setJamBuka(partner.operatingHours?.open || '07:00');
      setJamTutup(partner.operatingHours?.close || '22:00');
      setDescription(partner.description || '');
    }
  }, [partner]);

  if (!isOwner) {
    return (
      <Card className="p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900 font-heading">Akses Dibatasi</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Hanya Pemilik Bisnis (MITRA_OWNER) yang berhak mengubah informasi profil bisnis rental.
        </p>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    setIsSaving(true);
    try {
      const res = await api.settings.updateBusinessProfile(partner.id, {
        name,
        address,
        phone,
        email,
        picName,
        picPhone,
        description,
        operatingHours: {
          open: jamBuka,
          close: jamTutup,
          days: 'Senin - Minggu',
        },
      });

      if (res.success) {
        toast.success('Profil bisnis berhasil diperbarui!');
        refreshProfile();
      } else {
        toast.error('Gagal memperbarui profil bisnis');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Profil Bisnis Rental"
        subtitle="Kelola identitas usaha, jam operasional, dan kontak penanggung jawab"
        breadcrumbs={[{ label: 'Pengelolaan' }, { label: 'Profil Bisnis' }]}
      />

      {/* Official Status Banner (Read-only) */}
      <div className="p-3.5 sm:p-4 bg-[#102447] text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#1b3b72] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0866F5] text-white flex items-center justify-center font-bold text-base shrink-0">
            {partner?.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm font-heading">{partner?.name}</span>
              <Badge variant="emerald" size="sm">
                TERVERIFIKASI
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              ID Mitra: <span className="font-mono text-slate-300">{partner?.id}</span> • Komisi Platform: {partner?.commissionRate}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kerjasama Aktif</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#0866F5]" />
              <CardTitle>Identitas Usaha Rental</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Bisnis / Brand Rental"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Bentuk Badan Usaha"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                disabled
                helperText="Perubahan diajukan ke admin platform"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Kota Domisili Layanan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled
                helperText="Kota resmi operasional"
              />
              <Input
                label="Email Resmi Rental"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Nomor Telepon Kantor / Hotline"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Textarea
              label="Alamat Lengkap Garasi / Pool Armada"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              required
            />

            <Textarea
              label="Deskripsi Profil Bisnis"
              placeholder="Jelaskan keunggulan rental Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0866F5]" />
              <CardTitle>Jam Operasional & Kontak PIC</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Jam Buka Pool"
                type="time"
                value={jamBuka}
                onChange={(e) => setJamBuka(e.target.value)}
                required
              />
              <Input
                label="Jam Tutup Pool"
                type="time"
                value={jamTutup}
                onChange={(e) => setJamTutup(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama PIC / Penanggung Jawab"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                required
              />
              <Input
                label="No. WhatsApp PIC"
                value={picPhone}
                onChange={(e) => setPicPhone(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
