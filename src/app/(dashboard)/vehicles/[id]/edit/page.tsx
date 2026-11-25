'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { Vehicle } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditVehiclePage() {
  const params = useParams();
  const vehicleId = params.id as string;
  const router = useRouter();
  const { partner } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [nama, setNama] = useState('');
  const [platNomor, setPlatNomor] = useState('');
  const [hargaPerHari, setHargaPerHari] = useState<number>(0);
  const [depositJaminan, setDepositJaminan] = useState<number>(0);
  const [status, setStatus] = useState<Vehicle['status']>('tersedia');
  const [publikasiStatus, setPublikasiStatus] = useState<Vehicle['publikasiStatus']>('aktif');
  const [odometerKm, setOdometerKm] = useState<number>(0);
  const [lepasKunci, setLepasKunci] = useState(true);
  const [denganSopir, setDenganSopir] = useState(true);
  const [termasukBbm, setTermasukBbm] = useState(false);
  const [deskripsi, setDeskripsi] = useState('');
  const [kebijakanKhusus, setKebijakanKhusus] = useState('');

  useEffect(() => {
    if (!partner || !vehicleId) return;

    api.vehicles.getVehicleById(partner.id, vehicleId).then((res) => {
      if (res.success && res.data) {
        const v = res.data;
        setNama(v.nama);
        setPlatNomor(v.platNomor);
        setHargaPerHari(v.hargaPerHari);
        setDepositJaminan(v.depositJaminan || 0);
        setStatus(v.status);
        setPublikasiStatus(v.publikasiStatus);
        setOdometerKm(v.odometerKm);
        setLepasKunci(v.layanan?.lepasKunci ?? true);
        setDenganSopir(v.layanan?.denganSopir ?? true);
        setTermasukBbm(v.layanan?.termasukBbm ?? false);
        setDeskripsi(v.deskripsi);
        setKebijakanKhusus(v.kebijakanKhusus || '');
      } else {
        toast.error('Kendaraan tidak ditemukan');
        router.push('/vehicles');
      }
      setIsLoading(false);
    });
  }, [partner, vehicleId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    setIsSaving(true);
    try {
      const res = await api.vehicles.updateVehicle(partner.id, vehicleId, {
        nama,
        platNomor,
        hargaPerHari: Number(hargaPerHari),
        depositJaminan: Number(depositJaminan),
        status,
        publikasiStatus,
        odometerKm: Number(odometerKm),
        layanan: {
          lepasKunci,
          denganSopir,
          termasukBbm,
        },
        deskripsi,
        kebijakanKhusus,
      });

      if (res.success) {
        toast.success('Data kendaraan berhasil diperbarui!');
        router.push(`/vehicles/${vehicleId}`);
      } else {
        toast.error(res.error?.message || 'Gagal menyimpan perubahan');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title={`Edit Unit: ${nama}`}
        subtitle="Perbarui tarif sewa, status ketersediaan, atau spesifikasi unit"
        breadcrumbs={[
          { label: 'Kendaraan', href: '/vehicles' },
          { label: nama, href: `/vehicles/${vehicleId}` },
          { label: 'Edit' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Batal
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Status & Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Kendaraan"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
              <Input
                label="Plat Nomor"
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Status Operasional Unit"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: 'tersedia', label: 'Tersedia (Ready)' },
                  { value: 'disewa', label: 'Sedang Disewa' },
                  { value: 'maintenance', label: 'Perawatan Bengkel' },
                  { value: 'nonaktif', label: 'Nonaktif' },
                ]}
              />

              <Select
                label="Status Publikasi Customer"
                value={publikasiStatus}
                onChange={(e) => setPublikasiStatus(e.target.value as any)}
                options={[
                  { value: 'aktif', label: 'Aktif (Tampil di Katalog)' },
                  { value: 'draft', label: 'Draft (Disembunyikan)' },
                  { value: 'diarsipkan', label: 'Diarsipkan' },
                ]}
              />

              <Input
                label="Odometer (KM)"
                type="number"
                value={odometerKm}
                onChange={(e) => setOdometerKm(Number(e.target.value))}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarif Sewa & Kebijakan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Tarif Sewa Harian (Rp)"
                type="number"
                min={50000}
                step={25000}
                value={hargaPerHari}
                onChange={(e) => setHargaPerHari(Number(e.target.value))}
                required
              />
              <Input
                label="Deposit Jaminan (Rp)"
                type="number"
                min={0}
                step={50000}
                value={depositJaminan}
                onChange={(e) => setDepositJaminan(Number(e.target.value))}
                helperText="0 = Tanpa deposit uang tunai"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Switch label="Lepas Kunci" checked={lepasKunci} onChange={setLepasKunci} />
              <Switch label="Dengan Sopir" checked={denganSopir} onChange={setDenganSopir} />
              <Switch label="Termasuk BBM" checked={termasukBbm} onChange={setTermasukBbm} />
            </div>

            <Textarea
              label="Deskripsi Kendaraan"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={2}
            />

            <Textarea
              label="Syarat & Kebijakan Khusus"
              value={kebijakanKhusus}
              onChange={(e) => setKebijakanKhusus(e.target.value)}
              rows={2}
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                Batal
              </Button>
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
