'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { Vehicle, AvailabilityBlock, Booking } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatRupiah } from '@/lib/format';
import {
  CalendarDays,
  Wrench,
  Edit,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.id as string;
  const router = useRouter();
  const { partner } = useAuth();
  const { canManageVehicles } = usePermission();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [scheduleBlocks, setScheduleBlocks] = useState<AvailabilityBlock[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partner || !vehicleId) return;

    setIsLoading(true);
    Promise.all([
      api.vehicles.getVehicleById(partner.id, vehicleId),
      api.availability.getSchedule(partner.id, vehicleId),
      api.bookings.getBookings(partner.id, { limit: 10 }),
    ])
      .then(([vehRes, schedRes, bookRes]) => {
        if (vehRes.success && vehRes.data) {
          setVehicle(vehRes.data);
        } else {
          toast.error('Kendaraan tidak ditemukan');
          router.push('/vehicles');
        }

        if (schedRes.success && schedRes.data) {
          setScheduleBlocks(schedRes.data);
        }

        if (bookRes.success && bookRes.data) {
          setVehicleBookings(bookRes.data.items.filter((b) => b.vehicleId === vehicleId));
        }
      })
      .finally(() => setIsLoading(false));
  }, [partner, vehicleId, router]);

  if (isLoading || !vehicle) {
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
        title={vehicle.nama}
        subtitle={`${vehicle.merek} ${vehicle.model} • Plat Nomor: ${vehicle.platNomor}`}
        breadcrumbs={[
          { label: 'Kendaraan', href: '/vehicles' },
          { label: vehicle.nama },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Kembali
            </Button>
            {canManageVehicles && (
              <Link href={`/vehicles/${vehicle.id}/edit`}>
                <Button variant="primary" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                  Edit Unit
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Photo Gallery Hero */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="relative h-60 sm:h-72 bg-slate-100">
            <img
              src={vehicle.fotoUtama}
              alt={vehicle.nama}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge
                variant={
                  vehicle.status === 'tersedia'
                    ? 'emerald'
                    : vehicle.status === 'disewa'
                    ? 'blue'
                    : vehicle.status === 'maintenance'
                    ? 'red'
                    : 'slate'
                }
                size="sm"
                dot
              >
                {vehicle.status.toUpperCase()}
              </Badge>
              <Badge variant="slate" size="sm">
                Publikasi: {vehicle.publikasiStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing & Quick Meta */}
        <div className="space-y-3">
          <Card className="p-4 sm:p-5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-heading">
              Tarif Sewa Harian
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0866F5] tabular-nums font-heading">
                {formatRupiah(vehicle.hargaPerHari)}
              </span>
              <span className="text-[11px] text-slate-400">/ 24 jam</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Deposit Jaminan:</span>
                <span className="font-semibold text-slate-800">
                  {vehicle.depositJaminan ? formatRupiah(vehicle.depositJaminan) : 'Tanpa Deposit'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Sopir (opsional):</span>
                <span className="font-semibold text-slate-800">
                  {vehicle.biayaSopirPerHari ? formatRupiah(vehicle.biayaSopirPerHari) + '/hari' : 'Tidak tersedia'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Disewa:</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {vehicle.totalPenyewaan}x transaksi
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rating Ulasan:</span>
                <span className="font-semibold text-amber-600 flex items-center gap-1">
                  ★ {vehicle.rating.toFixed(1)} ({vehicle.totalUlasan} ulasan)
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <Link href="/availability" className="flex-1">
                <Button variant="outline" size="xs" className="w-full" leftIcon={<CalendarDays className="w-3 h-3" />}>
                  Jadwal
                </Button>
              </Link>
              <Link href="/maintenance/new" className="flex-1">
                <Button variant="secondary" size="xs" className="w-full" leftIcon={<Wrench className="w-3 h-3" />}>
                  Servis
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Specifications & Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] mb-0.5">Tipe Kendaraan</span>
                <span className="font-semibold text-slate-800 capitalize">{vehicle.tipe} ({vehicle.kategori})</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] mb-0.5">Transmisi</span>
                <span className="font-semibold text-slate-800 capitalize">{vehicle.transmisi}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] mb-0.5">Kapasitas Penumpang</span>
                <span className="font-semibold text-slate-800">{vehicle.kapasitasPenumpang} Orang</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] mb-0.5">Bahan Bakar</span>
                <span className="font-semibold text-slate-800">{vehicle.bahanBakar}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] mb-0.5">Odometer Terkini</span>
                <span className="font-semibold text-slate-800 tabular-nums">{vehicle.odometerKm.toLocaleString()} KM</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] mb-0.5">Tahun & Warna</span>
                <span className="font-semibold text-slate-800">{vehicle.tahun} • {vehicle.warna}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <span className="text-slate-400 block text-[10px] mb-0.5">Deskripsi Unit</span>
              <p className="text-slate-700 leading-relaxed text-xs">{vehicle.deskripsi}</p>
            </div>
          </CardContent>
        </Card>

        {/* Services & Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Layanan & Fitur Armada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="font-semibold text-slate-700 mb-1.5 text-xs">Paket Layanan Tersedia:</p>
              <div className="flex flex-wrap gap-1.5">
                {vehicle.layanan?.lepasKunci && (
                  <Badge variant="blue" size="sm">
                    ✓ Lepas Kunci
                  </Badge>
                )}
                {vehicle.layanan?.denganSopir && (
                  <Badge variant="emerald" size="sm">
                    ✓ Dengan Sopir
                  </Badge>
                )}
                {vehicle.layanan?.termasukBbm && (
                  <Badge variant="amber" size="sm">
                    ✓ Termasuk BBM
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-700 mb-1.5 text-xs">Kelengkapan & Fitur:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {vehicle.fitur.map((fitur, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00C48C] shrink-0" />
                    <span>{fitur}</span>
                  </div>
                ))}
              </div>
            </div>

            {vehicle.kebijakanKhusus && (
              <div className="pt-2.5 border-t border-slate-100">
                <p className="font-semibold text-slate-700 mb-0.5 text-xs">Syarat & Kebijakan Khusus:</p>
                <p className="text-slate-600 leading-relaxed text-xs">{vehicle.kebijakanKhusus}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
