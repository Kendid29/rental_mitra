'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { Booking, HandoverChecklist } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatRupiah } from '@/lib/format';
import {
  ArrowLeft,
  Check,
  Gauge,
  Fuel,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReturnInspectionPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const router = useRouter();
  const { partner, user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [handoverData, setHandoverData] = useState<HandoverChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [odometerAkhirKm, setOdometerAkhirKm] = useState<number>(0);
  const [levelBbmAkhirPersen, setLevelBbmAkhirPersen] = useState<number>(100);
  const [kebersihanKabin, setKebersihanKabin] = useState(true);
  const [kebersihanEksterior, setKebersihanEksterior] = useState(true);

  // Penalties & Adjustments
  const [keterlambatanJam, setKeterlambatanJam] = useState<number>(0);
  const [biayaKeterlambatan, setBiayaKeterlambatan] = useState<number>(0);
  const [biayaSelisihBbm, setBiayaSelisihBbm] = useState<number>(0);
  const [biayaKerusakan, setBiayaKerusakan] = useState<number>(0);
  const [catatanKerusakan, setCatatanKerusakan] = useState('');
  const [catatanPetugas, setCatatanPetugas] = useState('');
  const [namaPetugas, setNamaPetugas] = useState('');

  useEffect(() => {
    if (!partner || !bookingId) return;

    Promise.all([
      api.bookings.getBookingById(partner.id, bookingId),
      api.handover.getByBookingId(partner.id, bookingId),
    ]).then(([bookRes, hoRes]) => {
      if (bookRes.success && bookRes.data) {
        setBooking(bookRes.data);
        const hoKm = hoRes.data?.odometerAwalKm || bookRes.data.vehicle.odometerKm || 15000;
        setOdometerAkhirKm(hoKm + 180);
        setNamaPetugas(user?.name || 'Petugas Rental');
      } else {
        toast.error('Pesanan tidak ditemukan');
        router.push('/returns');
      }
      if (hoRes.success && hoRes.data) {
        setHandoverData(hoRes.data);
      }
      setIsLoading(false);
    });
  }, [partner, bookingId, user, router]);

  // Auto calculate late fee
  const handleLateHoursChange = (hours: number) => {
    setKeterlambatanJam(hours);
    const hourlyRate = 50000;
    setBiayaKeterlambatan(hours * hourlyRate);
  };

  // Auto calculate fuel gap
  const handleFuelChange = (currentPct: number) => {
    setLevelBbmAkhirPersen(currentPct);
    const initialBbm = handoverData?.levelBbmAwalPersen || 100;
    if (currentPct < initialBbm) {
      const gap = initialBbm - currentPct;
      setBiayaSelisihBbm(Math.round((gap / 10) * 15000));
    } else {
      setBiayaSelisihBbm(0);
    }
  };

  const totalPenyesuaian =
    Number(biayaKeterlambatan) + Number(biayaSelisihBbm) + Number(biayaKerusakan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner || !booking) return;

    setIsSubmitting(true);
    try {
      const res = await api.returns.submitReturn(partner.id, {
        partnerId: partner.id,
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        vehicleId: booking.vehicleId,
        customerName: booking.customer.nama,
        odometerAkhirKm: Number(odometerAkhirKm),
        levelBbmAkhirPersen: Number(levelBbmAkhirPersen),
        kondisiFisik: {
          kebersihanKabin,
          kebersihanEksterior,
          kerusakanBaru: catatanKerusakan ? [catatanKerusakan] : [],
        },
        keterlambatanJam: Number(keterlambatanJam),
        biayaKeterlambatan: Number(biayaKeterlambatan),
        biayaSelisihBbm: Number(biayaSelisihBbm),
        biayaKerusakan: Number(biayaKerusakan),
        totalBiayaPenyesuaian: totalPenyesuaian,
        namaPetugas,
        namaPengembali: booking.customer.nama,
        catatanPetugas: catatanPetugas || 'Penyewaan selesai dan unit telah kembali ke pool.',
      });

      if (res.success) {
        toast.success('Inspeksi pengembalian selesai! Transaksi ditutup dan dibukukan ke pendapatan.');
        router.push(`/bookings/${booking.id}`);
      } else {
        toast.error(res.error?.message || 'Gagal memproses pengembalian');
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
        title={`Inspeksi Pengembalian #${booking.bookingNumber}`}
        subtitle={`Pengembalian unit ${booking.vehicle.nama} (${booking.vehicle.platNomor}) oleh ${booking.customer.nama}`}
        breadcrumbs={[
          { label: 'Pengembalian', href: '/returns' },
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
        {/* Baseline Handover Comparison Card */}
        <Card className="bg-slate-50 border-slate-200/80">
          <CardHeader>
            <CardTitle>Perbandingan Data Serah Terima Awal</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">KM Odometer Awal:</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {(handoverData?.odometerAwalKm || 15000).toLocaleString()} KM
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Level BBM Awal:</span>
              <span className="font-semibold text-slate-800">
                {handoverData?.levelBbmAwalPersen || 100}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Penyewa:</span>
              <span className="font-semibold text-slate-800">{booking.customer.nama}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Durasi Kontrak:</span>
              <span className="font-semibold text-blue-700">{booking.durasiHari} Hari</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Odometer & BBM */}
        <Card>
          <CardHeader>
            <CardTitle>1. Odometer & Level Bahan Bakar Akhir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Odometer Saat Kembali (KM)"
                type="number"
                value={odometerAkhirKm}
                onChange={(e) => setOdometerAkhirKm(Number(e.target.value))}
                required
                leftIcon={<Gauge className="w-3.5 h-3.5" />}
              />

              <Input
                label="Level Bahan Bakar (%)"
                type="number"
                min={0}
                max={100}
                value={levelBbmAkhirPersen}
                onChange={(e) => handleFuelChange(Number(e.target.value))}
                required
                leftIcon={<Fuel className="w-3.5 h-3.5" />}
                helperText={
                  levelBbmAkhirPersen < (handoverData?.levelBbmAwalPersen || 100)
                    ? `Kurang ${ (handoverData?.levelBbmAwalPersen || 100) - levelBbmAkhirPersen }% dari serah terima awal`
                    : 'BBM sesuai standar serah terima awal'
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Kebersihan & Kerusakan Baru */}
        <Card>
          <CardHeader>
            <CardTitle>2. Pemeriksaan Kondisi Fisik & Kebersihan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Switch
                label="Kabin Bersih & Rapi"
                description="Bebas bau menyengat & tidak kotor ekstrem"
                checked={kebersihanKabin}
                onChange={setKebersihanKabin}
              />
              <Switch
                label="Eksterior Utuh Normal"
                description="Tidak ada benturan keras baru"
                checked={kebersihanEksterior}
                onChange={setKebersihanEksterior}
              />
            </div>

            <Textarea
              label="Catatan Kerusakan Baru (Bila Ada)"
              placeholder="Contoh: Baret halus bumper belakang kiri saat parkir"
              value={catatanKerusakan}
              onChange={(e) => setCatatanKerusakan(e.target.value)}
              rows={2}
            />
          </CardContent>
        </Card>

        {/* Section 3: Penalti & Biaya Tambahan */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#0866F5]" />
              <CardTitle>3. Perhitungan Denda & Penyesuaian Biaya</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Keterlambatan (Jam)"
                type="number"
                min={0}
                value={keterlambatanJam}
                onChange={(e) => handleLateHoursChange(Number(e.target.value))}
                helperText="Rp 50.000 / jam"
              />

              <Input
                label="Denda Terlambat (Rp)"
                type="number"
                min={0}
                value={biayaKeterlambatan}
                onChange={(e) => setBiayaKeterlambatan(Number(e.target.value))}
              />

              <Input
                label="Kompensasi BBM (Rp)"
                type="number"
                min={0}
                value={biayaSelisihBbm}
                onChange={(e) => setBiayaSelisihBbm(Number(e.target.value))}
              />
            </div>

            <Input
              label="Biaya Ganti Rugi Kerusakan Fisik (Rp)"
              type="number"
              min={0}
              value={biayaKerusakan}
              onChange={(e) => setBiayaKerusakan(Number(e.target.value))}
              helperText="Klaim perbaikan bodi atau pembersihan kabin berlebih"
            />

            {/* Total Adjustment Callout */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900">Total Denda / Penyesuaian Tambahan:</span>
              <span className="text-base font-bold text-amber-950 font-heading tabular-nums">
                {formatRupiah(totalPenyesuaian)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Penutupan Sewa */}
        <Card>
          <CardHeader>
            <CardTitle>4. Konfirmasi Penyelesaian Sewa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Petugas Pemeriksa"
                value={namaPetugas}
                onChange={(e) => setNamaPetugas(e.target.value)}
                required
              />
              <Input
                label="Nama Pengembali (Penyewa)"
                value={booking.customer.nama}
                disabled
              />
            </div>

            <Textarea
              label="Catatan Akhir Operasional"
              value={catatanPetugas}
              onChange={(e) => setCatatanPetugas(e.target.value)}
              rows={2}
              placeholder="Unit siap masuk pool atau dijadwalkan cuci mobil..."
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                Batal
              </Button>
              <Button
                type="submit"
                variant="success"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Selesaikan Sewa & Pembukuan
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
