'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { Vehicle } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Wrench, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewMaintenancePage() {
  const router = useRouter();
  const { partner } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [jenisPerawatan, setJenisPerawatan] = useState('Ganti Oli & Filter Mesin Rutin');
  const [namaBengkel, setNamaBengkel] = useState('Bengkel Resmi Auto2000');
  const [odometerKm, setOdometerKm] = useState<number>(20000);
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().split('T')[0]);
  const [estimasiSelesai, setEstimasiSelesai] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [biaya, setBiaya] = useState<number>(650000);
  const [catatan, setCatatan] = useState('Servis berkala kelipatan 10.000 KM');
  const [fotoNota, setFotoNota] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!partner) return;
    api.vehicles.getVehicles(partner.id, { limit: 100 }).then((res) => {
      if (res.success && res.data) {
        setVehicles(res.data.items);
        if (res.data.items.length > 0) {
          setSelectedVehicleId(res.data.items[0].id);
          setOdometerKm(res.data.items[0].odometerKm || 20000);
        }
      }
    });
  }, [partner]);

  const handleVehicleChange = (vId: string) => {
    setSelectedVehicleId(vId);
    const target = vehicles.find((v) => v.id === vId);
    if (target) {
      setOdometerKm(target.odometerKm || 20000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner || !selectedVehicleId) {
      toast.error('Pilih unit kendaraan yang akan dirawat');
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
    if (!selectedVehicle) return;

    setIsSubmitting(true);
    try {
      const res = await api.maintenance.createMaintenance(partner.id, {
        partnerId: partner.id,
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.nama,
        platNomor: selectedVehicle.platNomor,
        jenisPerawatan,
        deskripsi: catatan,
        namaBengkel,
        tanggalMulai,
        estimasiSelesai,
        biaya: Number(biaya),
        odometerKm: Number(odometerKm),
        fotoNota,
        status: 'sedang_dikerjakan',
      });

      if (res.success) {
        toast.success(
          'Servis berhasil dicatat! Jadwal unit otomatis diblokir dan biaya telah dibukukan ke Pengeluaran.'
        );
        router.push('/maintenance');
      } else {
        toast.error(res.error?.message || 'Gagal mencatat servis');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Jadwalkan Servis & Perawatan Bengkel"
        subtitle="Mencatat perbaikan, servis rutin, memblokir kalender unit, dan membukukan pengeluaran"
        breadcrumbs={[
          { label: 'Maintenance', href: '/maintenance' },
          { label: 'Jadwalkan Servis' },
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
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-rose-600" />
              <CardTitle>Data Unit & Bengkel</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              label="Pilih Unit Armada"
              value={selectedVehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              required
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nama} ({v.platNomor}) — {v.status.toUpperCase()}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Jenis Perawatan / Servis"
                value={jenisPerawatan}
                onChange={(e) => setJenisPerawatan(e.target.value)}
                options={[
                  { value: 'Ganti Oli & Filter Mesin Rutin', label: 'Ganti Oli & Filter Rutin' },
                  { value: 'Servis Rem & Kaki-kaki', label: 'Servis Rem & Kaki-kaki' },
                  { value: 'Tune-up & Busi Mesin', label: 'Tune-up & Busi' },
                  { value: 'Perbaikan Body & Cat (Insiden)', label: 'Perbaikan Body & Cat' },
                  { value: 'Ganti Ban Baru (Satu Set)', label: 'Ganti Ban Baru' },
                  { value: 'Servis AC & Kelistrikan', label: 'Servis AC & Kelistrikan' },
                ]}
                required
              />

              <Input
                label="Nama Bengkel / Vendor"
                value={namaBengkel}
                onChange={(e) => setNamaBengkel(e.target.value)}
                required
              />
            </div>

            <Input
              label="Odometer Saat Masuk Bengkel (KM)"
              type="number"
              value={odometerKm}
              onChange={(e) => setOdometerKm(Number(e.target.value))}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Pengerjaan & Biaya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Tanggal Masuk Bengkel"
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                required
              />

              <Input
                label="Estimasi Unit Selesai"
                type="date"
                value={estimasiSelesai}
                onChange={(e) => setEstimasiSelesai(e.target.value)}
                required
                helperText="Tanggal ketersediaan unit di kalender akan diblokir"
              />
            </div>

            <Input
              label="Estimasi / Realisasi Biaya (Rp)"
              type="number"
              min={0}
              step={10000}
              value={biaya}
              onChange={(e) => setBiaya(Number(e.target.value))}
              required
              helperText="Otomatis dibukukan ke modul Pengeluaran Operasional"
            />

            <Textarea
              label="Rincian Pengerjaan / Keluhan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
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
                isLoading={isSubmitting}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Jadwalkan Servis Bengkel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
