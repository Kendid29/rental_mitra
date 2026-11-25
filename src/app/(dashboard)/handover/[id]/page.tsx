'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { Booking } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Check, Gauge, Fuel } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HandoverChecklistPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const router = useRouter();
  const { partner, user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [odometerAwalKm, setOdometerAwalKm] = useState<number>(0);
  const [levelBbmAwalPersen, setLevelBbmAwalPersen] = useState<number>(100);
  const [kebersihanKabin, setKebersihanKabin] = useState(true);
  const [kebersihanEksterior, setKebersihanEksterior] = useState(true);

  // Document & Equipment
  const [stnkAsli, setStnkAsli] = useState(true);
  const [kunciCadangan, setKunciCadangan] = useState(true);
  const [banSerep, setBanSerep] = useState(true);
  const [toolkitDongkrak, setToolkitDongkrak] = useState(true);
  const [kotakP3K, setKotakP3K] = useState(true);

  // Existing damages
  const [catatanKondisiFisik, setCatatanKondisiFisik] = useState('Tidak ada goresan baru, bodi mulus terawat');
  const [namaPetugas, setNamaPetugas] = useState('');
  const [namaPenerimaKunci, setNamaPenerimaKunci] = useState('');

  useEffect(() => {
    if (!partner || !bookingId) return;

    api.bookings.getBookingById(partner.id, bookingId).then((res) => {
      if (res.success && res.data) {
        setBooking(res.data);
        setOdometerAwalKm(res.data.vehicle.odometerKm || 15000);
        setNamaPenerimaKunci(res.data.customer.nama);
        setNamaPetugas(user?.name || 'Petugas Rental');
      } else {
        toast.error('Pesanan tidak ditemukan');
        router.push('/handover');
      }
      setIsLoading(false);
    });
  }, [partner, bookingId, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner || !booking) return;

    if (!stnkAsli) {
      toast.error('STNK asli wajib diserahkan bersama unit kendaraan!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.handover.submitHandover(partner.id, {
        partnerId: partner.id,
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        vehicleId: booking.vehicleId,
        customerName: booking.customer.nama,
        odometerAwalKm: Number(odometerAwalKm),
        levelBbmAwalPersen: Number(levelBbmAwalPersen),
        kondisiFisik: {
          kebersihanKabin,
          kebersihanEksterior,
          catatanKerusakanAwal: catatanKondisiFisik,
        },
        kelengkapan: {
          stnkAsli,
          kunciCadangan,
          banSerep,
          toolkit: toolkitDongkrak,
          toolkitDongkrak,
          kotakP3k: kotakP3K,
        },
        fotoDokumentasi: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        ],
        namaPetugas,
        namaPenerimaKunci,
        catatanPetugas: 'Serah terima dilakukan tepat waktu, dokumen diserahkan lengkap.',
      });

      if (res.success) {
        toast.success('Serah terima kunci berhasil diproses! Status pesanan kini BERJALAN.');
        router.push(`/bookings/${booking.id}`);
      } else {
        toast.error(res.error?.message || 'Gagal memproses serah terima');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !booking) {
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
        title={`Checklist Serah Terima #${booking.bookingNumber}`}
        subtitle={`Serah terima armada ${booking.vehicle.nama} (${booking.vehicle.platNomor}) kepada ${booking.customer.nama}`}
        breadcrumbs={[
          { label: 'Serah Terima', href: '/handover' },
          { label: `#${booking.bookingNumber}` },
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
        {/* Unit Info Summary */}
        <Card className="bg-slate-50 border-slate-200/80">
          <CardContent className="p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Unit Kendaraan:</span>
              <span className="font-semibold text-slate-800">{booking.vehicle.nama}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Plat Nomor:</span>
              <span className="font-semibold text-[#102447]">{booking.vehicle.platNomor}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Penyewa:</span>
              <span className="font-semibold text-slate-800">{booking.customer.nama}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Periode Sewa:</span>
              <span className="font-semibold text-blue-700">{booking.durasiHari} Hari</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Odometer & BBM */}
        <Card>
          <CardHeader>
            <CardTitle>1. Odometer & Level Bahan Bakar Awal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Odometer Saat Serah Terima (KM)"
                type="number"
                value={odometerAwalKm}
                onChange={(e) => setOdometerAwalKm(Number(e.target.value))}
                required
                leftIcon={<Gauge className="w-3.5 h-3.5" />}
                helperText="Wajib sesuai angka di speedometer fisik"
              />

              <Input
                label="Level Bahan Bakar (%)"
                type="number"
                min={10}
                max={100}
                value={levelBbmAwalPersen}
                onChange={(e) => setLevelBbmAwalPersen(Number(e.target.value))}
                required
                leftIcon={<Fuel className="w-3.5 h-3.5" />}
                helperText="Standar penyerahan: minimal 80-100% full tank"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Kebersihan & Fisik */}
        <Card>
          <CardHeader>
            <CardTitle>2. Kondisi Fisik & Kebersihan Kabin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Switch
                label="Kabin Bersih & Harum"
                description="Karpet divakum, bebas sampah & wangi"
                checked={kebersihanKabin}
                onChange={setKebersihanKabin}
              />
              <Switch
                label="Eksterior Bersih Dicuci"
                description="Bodi & kaca mengkilap siap pakai"
                checked={kebersihanEksterior}
                onChange={setKebersihanEksterior}
              />
            </div>

            <Textarea
              label="Catatan Kondisi Fisik Awal / Lecet Bodi"
              value={catatanKondisiFisik}
              onChange={(e) => setCatatanKondisiFisik(e.target.value)}
              rows={2}
              helperText="Catat goresan halus yang sudah ada sebelum penyerahan."
            />
          </CardContent>
        </Card>

        {/* Section 3: Dokumen & Toolkit */}
        <Card>
          <CardHeader>
            <CardTitle>3. Kelengkapan Dokumen & Peralatan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Switch
                label="STNK Asli Kendaraan"
                description="Wajib ada di laci mobil/gantungan kunci"
                checked={stnkAsli}
                onChange={setStnkAsli}
              />
              <Switch
                label="Kunci Cadangan / Remot"
                checked={kunciCadangan}
                onChange={setKunciCadangan}
              />
              <Switch
                label="Ban Serep Layak Pakai"
                checked={banSerep}
                onChange={setBanSerep}
              />
              <Switch
                label="Toolkit & Dongkrak Mobil"
                checked={toolkitDongkrak}
                onChange={setToolkitDongkrak}
              />
              <Switch
                label="Kotak P3K Medis"
                checked={kotakP3K}
                onChange={setKotakP3K}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Tanda Tangan & Konfirmasi */}
        <Card>
          <CardHeader>
            <CardTitle>4. Konfirmasi Serah Terima</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Petugas Mitra"
                value={namaPetugas}
                onChange={(e) => setNamaPetugas(e.target.value)}
                required
              />
              <Input
                label="Nama Penerima Kunci (Penyewa)"
                value={namaPenerimaKunci}
                onChange={(e) => setNamaPenerimaKunci(e.target.value)}
                required
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-lg text-xs text-blue-900 leading-relaxed">
              Dengan menekan tombol di bawah, Anda menyatakan bahwa armada telah diserahkan dalam kondisi baik dan status sewa resmi menjadi <strong>Aktif Berjalan</strong>.
            </div>

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
                Konfirmasi Penyerahan Kunci
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
