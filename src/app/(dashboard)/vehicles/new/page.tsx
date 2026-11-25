'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { CreateVehicleInput } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Car, Fuel, DollarSign, Sparkles, Image as ImageIcon, FileText, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewVehiclePage() {
  const router = useRouter();
  const { partner } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [nama, setNama] = useState('');
  const [merek, setMerek] = useState('Toyota');
  const [model, setModel] = useState('');
  const [tahun, setTahun] = useState<number>(2024);
  const [tipe, setTipe] = useState<'mobil' | 'motor'>('mobil');
  const [kategori, setKategori] = useState('MPV');
  const [platNomor, setPlatNomor] = useState('');
  const [warna, setWarna] = useState('Hitam Metalik');

  const [transmisi, setTransmisi] = useState<'manual' | 'otomatis'>('otomatis');
  const [kapasitasPenumpang, setKapasitasPenumpang] = useState<number>(7);
  const [bahanBakar, setBahanBakar] = useState('Bensin');
  const [kapasitasMesinCc, setKapasitasMesinCc] = useState<number>(1500);
  const [odometerKm, setOdometerKm] = useState<number>(12000);

  const [hargaPerHari, setHargaPerHari] = useState<number>(450000);
  const [depositJaminan, setDepositJaminan] = useState<number>(0);
  const [biayaSopirPerHari, setBiayaSopirPerHari] = useState<number>(150000);

  const [lepasKunci, setLepasKunci] = useState(true);
  const [denganSopir, setDenganSopir] = useState(true);
  const [termasukBbm, setTermasukBbm] = useState(false);
  const [acDingin, setAcDingin] = useState(true);
  const [audioBluetooth, setAudioBluetooth] = useState(true);
  const [dashcam, setDashcam] = useState(false);

  const [fotoUtama, setFotoUtama] = useState(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
  );
  const [deskripsi, setDeskripsi] = useState(
    'Armada terawat, servis berkala resmi, interior harum dan bersih, siap untuk perjalanan dinas atau liburan keluarga.'
  );
  const [kebijakanMitra, setKebijakanMitra] = useState(
    'Dilarang merokok di dalam kabin mobil. Bahan bakar dikembalikan sesuai level saat pengambilan.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    if (!nama || !platNomor || !hargaPerHari) {
      toast.error('Mohon lengkapi nama kendaraan, plat nomor, dan tarif sewa.');
      return;
    }

    setIsSubmitting(true);
    try {
      const input: CreateVehicleInput = {
        partnerId: partner.id,
        nama,
        merek,
        model,
        tahun: Number(tahun),
        tipe,
        kategori,
        platNomor: platNomor.toUpperCase(),
        warna,
        transmisi,
        kapasitasPenumpang: Number(kapasitasPenumpang),
        bahanBakar,
        kapasitasMesinCc: Number(kapasitasMesinCc),
        odometerKm: Number(odometerKm),
        hargaPerHari: Number(hargaPerHari),
        depositJaminan: Number(depositJaminan),
        biayaSopirPerHari: denganSopir ? Number(biayaSopirPerHari) : undefined,
        layanan: {
          lepasKunci,
          denganSopir,
          termasukBbm,
        },
        fitur: [
          acDingin ? 'AC Dingin Double Blower' : '',
          audioBluetooth ? 'Head Unit Bluetooth & USB' : '',
          dashcam ? 'Dashcam Depan' : '',
          'Kamera Mundur & Sensor Parkir',
          'Power Steering',
        ].filter(Boolean),
        fotoUtama,
        fotoGaleri: [fotoUtama],
        deskripsi,
        kebijakanKhusus: kebijakanMitra,
        status: 'tersedia',
        publikasiStatus: 'aktif',
      };

      const res = await api.vehicles.createVehicle(partner.id, input);
      if (res.success) {
        toast.success(`Unit ${nama} berhasil ditambahkan ke armada!`);
        router.push('/vehicles');
      } else {
        toast.error(res.error?.message || 'Gagal menyimpan kendaraan');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-12">
      <PageHeader
        title="Tambah Unit Kendaraan Baru"
        subtitle="Daftarkan armada mobil atau motor baru ke sistem manajemen sewa"
        breadcrumbs={[{ label: 'Kendaraan', href: '/vehicles' }, { label: 'Tambah Unit' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Info Umum */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#0866F5]">
                <Car className="w-4 h-4" />
              </div>
              <CardTitle>1. Informasi Umum Kendaraan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Unit (Tampilan Publik)"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Toyota Avanza 1.5 G TSS"
                required
              />
              <Input
                label="Plat Nomor Kendaraan"
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value)}
                placeholder="Contoh: AB 1234 CD"
                required
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Select
                label="Tipe Kendaraan"
                value={tipe}
                onChange={(e) => {
                  const t = e.target.value as any;
                  setTipe(t);
                  if (t === 'motor') {
                    setKategori('Matic');
                    setKapasitasPenumpang(2);
                  } else {
                    setKategori('MPV');
                    setKapasitasPenumpang(7);
                  }
                }}
                options={[
                  { value: 'mobil', label: 'Mobil' },
                  { value: 'motor', label: 'Motor' },
                ]}
              />

              <Input
                label="Merek"
                value={merek}
                onChange={(e) => setMerek(e.target.value)}
                placeholder="Toyota / Honda"
                required
              />

              <Input
                label="Model / Varian"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Avanza / Vario"
                required
              />

              <Input
                label="Tahun Produksi"
                type="number"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                min={2015}
                max={2026}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kategori / Segmen"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="MPV / SUV / Sedan / Matic"
                required
              />
              <Input
                label="Warna Kendaraan"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
                placeholder="Putih Mutiara / Hitam"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Spesifikasi Teknis */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-[#00C48C]">
                <Fuel className="w-4 h-4" />
              </div>
              <CardTitle>2. Spesifikasi Teknis & Odometer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Select
                label="Transmisi"
                value={transmisi}
                onChange={(e) => setTransmisi(e.target.value as any)}
                options={[
                  { value: 'otomatis', label: 'Otomatis (Matic)' },
                  { value: 'manual', label: 'Manual' },
                ]}
              />

              <Input
                label="Kapasitas Penumpang"
                type="number"
                value={kapasitasPenumpang}
                onChange={(e) => setKapasitasPenumpang(Number(e.target.value))}
                min={1}
                max={15}
                required
              />

              <Input
                label="Bahan Bakar"
                value={bahanBakar}
                onChange={(e) => setBahanBakar(e.target.value)}
                placeholder="Bensin / Diesel / Listrik"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kapasitas Mesin (CC)"
                type="number"
                value={kapasitasMesinCc}
                onChange={(e) => setKapasitasMesinCc(Number(e.target.value))}
                placeholder="1500"
              />
              <Input
                label="Odometer Saat Ini (KM)"
                type="number"
                value={odometerKm}
                onChange={(e) => setOdometerKm(Number(e.target.value))}
                placeholder="12000"
                helperText="Digunakan sebagai acuan serah terima awal"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Penetapan Harga & Deposit */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#0866F5]">
                <DollarSign className="w-4 h-4" />
              </div>
              <CardTitle>3. Tarif Sewa & Deposit</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Tarif Sewa Per Hari (Rp)"
                type="number"
                value={hargaPerHari}
                onChange={(e) => setHargaPerHari(Number(e.target.value))}
                placeholder="400000"
                required
                helperText="Komisi 10% platform dipotong dari tarif ini"
              />
              <Input
                label="Deposit Jaminan (Rp)"
                type="number"
                value={depositJaminan}
                onChange={(e) => setDepositJaminan(Number(e.target.value))}
                placeholder="0"
                helperText="Isi 0 jika tanpa deposit jaminan uang tunai"
              />
              <Input
                label="Biaya Driver / Hari (Jika ada)"
                type="number"
                value={biayaSopirPerHari}
                onChange={(e) => setBiayaSopirPerHari(Number(e.target.value))}
                placeholder="150000"
                disabled={!denganSopir}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Layanan & Fitur */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <CardTitle>4. Paket Layanan & Fasilitas Unit</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <Switch
                label="Lepas Kunci"
                description="Pelanggan mengemudi sendiri"
                checked={lepasKunci}
                onChange={setLepasKunci}
              />
              <Switch
                label="Dengan Sopir"
                description="Tersedia sopir dari mitra"
                checked={denganSopir}
                onChange={setDenganSopir}
              />
              <Switch
                label="Termasuk BBM"
                description="BBM sudah masuk paket"
                checked={termasukBbm}
                onChange={setTermasukBbm}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Switch
                label="AC Dingin & Bersih"
                checked={acDingin}
                onChange={setAcDingin}
              />
              <Switch
                label="Audio Bluetooth / USB"
                checked={audioBluetooth}
                onChange={setAudioBluetooth}
              />
              <Switch
                label="Dashcam Pengaman"
                checked={dashcam}
                onChange={setDashcam}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Foto & Deskripsi */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <ImageIcon className="w-4 h-4" />
              </div>
              <CardTitle>5. Foto Unit & Deskripsi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="URL Foto Utama"
              value={fotoUtama}
              onChange={(e) => setFotoUtama(e.target.value)}
              placeholder="https://..."
              required
            />
            {fotoUtama && (
              <div className="w-48 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={fotoUtama} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <Textarea
              label="Deskripsi Kendaraan"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
            />

            <Textarea
              label="Syarat & Kebijakan Khusus Mitra"
              value={kebijakanMitra}
              onChange={(e) => setKebijakanMitra(e.target.value)}
              rows={2}
              helperText="Misal: Dilarang merokok di kabin, dilarang membawa durian/hewan peliharaan."
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Simpan Kendaraan Baru
          </Button>
        </div>
      </form>
    </div>
  );
}
