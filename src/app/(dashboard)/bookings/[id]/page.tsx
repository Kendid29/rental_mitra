'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { Booking } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import {
  formatRupiah,
  formatDateIndo,
  formatDateTimeIndo,
  formatPhone,
} from '@/lib/format';
import {
  ArrowLeft,
  AlertTriangle,
  KeyRound,
  RotateCcw,
  Car,
  User,
  Calendar,
  Phone,
  MapPin,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const router = useRouter();
  const { partner } = useAuth();
  const { canProcessOrders } = usePermission();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Issue reporting modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueReason, setIssueReason] = useState('Unit Mengalami Kendala Mesin');
  const [issueNotes, setIssueNotes] = useState('');
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);

  const loadBooking = async () => {
    if (!partner || !bookingId) return;
    setIsLoading(true);
    try {
      const res = await api.bookings.getBookingById(partner.id, bookingId);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        toast.error('Pesanan tidak ditemukan');
        router.push('/bookings');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [partner, bookingId]);

  const handleConfirmReady = async () => {
    if (!partner || !booking) return;
    const res = await api.bookings.updateReadiness(partner.id, booking.id, 'ready');
    if (res.success) {
      toast.success('Armada berhasil dikonfirmasi SIAP untuk serah terima!');
      loadBooking();
    } else {
      toast.error(res.error?.message || 'Gagal mengonfirmasi kesiapan');
    }
  };

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner || !booking) return;

    setIsSubmittingIssue(true);
    try {
      const res = await api.bookings.updateReadiness(
        partner.id,
        booking.id,
        'issue_reported',
        undefined,
        {
          alasan: issueReason,
          catatan: issueNotes || 'Dilaporkan oleh mitra melalui portal',
        }
      );
      if (res.success) {
        toast.success('Kendala berhasil dilaporkan ke Admin platform');
        setIsIssueModalOpen(false);
        loadBooking();
      } else {
        toast.error(res.error?.message || 'Gagal melaporkan kendala');
      }
    } finally {
      setIsSubmittingIssue(false);
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
        title={`Pesanan #${booking.bookingNumber}`}
        subtitle={`Dibuat pada ${formatDateTimeIndo(booking.createdAt)}`}
        breadcrumbs={[
          { label: 'Penyewaan', href: '/bookings' },
          { label: `#${booking.bookingNumber}` },
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
            {booking.status === 'diteruskan_mitra' && (
              <Link href={`/handover/${booking.id}`}>
                <Button variant="primary" size="sm" leftIcon={<KeyRound className="w-3.5 h-3.5" />}>
                  Proses Serah Terima
                </Button>
              </Link>
            )}
            {booking.status === 'berjalan' && (
              <Link href={`/returns/${booking.id}`}>
                <Button variant="success" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                  Inspeksi Pengembalian
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Readiness & Operational Status Action Bar */}
      <Card className="bg-[#102447] text-white border border-[#1b3b72]/80">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase font-semibold text-slate-300">Status Transaksi:</span>
              <Badge
                variant={
                  booking.status === 'selesai'
                    ? 'emerald'
                    : booking.status === 'berjalan'
                    ? 'blue'
                    : 'amber'
                }
                size="sm"
                dot
              >
                {booking.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge
                variant={
                  booking.readinessStatus === 'ready'
                    ? 'emerald'
                    : booking.readinessStatus === 'issue_reported'
                    ? 'red'
                    : 'amber'
                }
                size="sm"
              >
                Kesiapan: {booking.readinessStatus.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              {booking.readinessStatus === 'ready'
                ? '✓ Armada telah dicek dan dikonfirmasi siap diserahkan kepada penyewa.'
                : booking.readinessStatus === 'issue_reported'
                ? `⚠ Terdapat kendala: ${booking.reportedIssue?.alasan}. Admin sedang meninjau unit pengganti.`
                : 'Mohon periksa fisik kendaraan, kebersihan & surat jalan sebelum mengonfirmasi.'}
            </p>
          </div>

          {canProcessOrders && booking.status === 'diteruskan_mitra' && (
            <div className="flex items-center gap-2 shrink-0">
              {booking.readinessStatus !== 'ready' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleConfirmReady}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Konfirmasi Siap
                </Button>
              )}
              {booking.readinessStatus !== 'issue_reported' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsIssueModalOpen(true)}
                  leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
                >
                  Laporkan Kendala
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer & Vehicle Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#0866F5]" />
              <CardTitle>Data Pelanggan (Penyewa)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Nama Lengkap</span>
              <span className="font-semibold text-slate-900">{booking.customer.nama}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Nomor WhatsApp</span>
              <a
                href={`https://wa.me/${(booking.customer.telepon || booking.customer.phone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                {formatPhone(booking.customer.telepon || booking.customer.phone || '')}
              </a>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-800">{booking.customer.email}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">No. Identitas</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {booking.customer.nomorKtp || 'Terverifikasi Admin'}
              </span>
            </div>
            {booking.catatanPelanggan && (
              <div className="pt-1.5">
                <span className="text-slate-500 block text-[10px] mb-0.5">Catatan Tambahan Penyewa:</span>
                <p className="p-2 bg-slate-50 rounded-lg text-slate-700 italic text-[11px]">
                  "{booking.catatanPelanggan}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#0866F5]" />
              <CardTitle>Armada yang Disewa</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Nama Kendaraan</span>
              <span className="font-semibold text-slate-900">{booking.vehicle.nama}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Plat Nomor</span>
              <span className="font-bold text-[#102447] bg-slate-100 px-1.5 py-0.2 rounded text-[11px] tabular-nums">
                {booking.vehicle.platNomor}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Tipe & Transmisi</span>
              <span className="font-medium text-slate-800 capitalize">
                {booking.vehicle.tipe} • {booking.vehicle.transmisi}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Paket Layanan</span>
              <Badge variant="blue" size="sm">
                {booking.layanan?.lepasKunci ? 'Lepas Kunci' : 'Dengan Sopir'}
              </Badge>
            </div>
            <div className="pt-1 flex justify-end">
              <Link href={`/vehicles/${booking.vehicleId}`}>
                <Button variant="outline" size="xs">
                  Buka Profil Armada
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule & Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0866F5]" />
              <CardTitle>Jadwal & Lokasi Rental</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg space-y-1.5">
              <div>
                <span className="text-slate-500 block text-[10px]">Tanggal Mulai Sewa:</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {formatDateIndo(booking.tanggalMulai)}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-200/60">
                <span className="text-slate-500 block text-[10px]">Tanggal Selesai Sewa:</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {formatDateIndo(booking.tanggalSelesai)}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-200/60 flex justify-between items-center">
                <span className="text-slate-500 text-[10px]">Durasi Penyewaan:</span>
                <span className="font-bold text-[#0866F5]">{booking.durasiHari} Hari</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 text-[11px]">Titik Serah Terima:</p>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  {booking.lokasiPengambilan || `${partner?.name}, ${partner?.address}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Rincian Biaya & Hak Bersih Mitra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Subtotal Sewa ({booking.durasiHari} hari):</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {formatRupiah(booking.rincianBiaya.subtotalSewa)}
              </span>
            </div>
            {(booking.rincianBiaya.biayaSopir || 0) > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Layanan Sopir:</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {formatRupiah(booking.rincianBiaya.biayaSopir || 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-500">
              <span>Potongan Komisi ({partner?.commissionRate || 10}%):</span>
              <span className="font-semibold text-rose-500 tabular-nums">
                - {formatRupiah((booking.rincianBiaya.subtotalSewa * (partner?.commissionRate || 10)) / 100)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-t border-slate-200 text-xs">
              <span className="font-bold text-[#102447]">Hak Bersih Mitra:</span>
              <span className="font-bold text-[#0866F5] tabular-nums font-heading">
                {formatRupiah(
                  booking.rincianBiaya.subtotalSewa -
                    (booking.rincianBiaya.subtotalSewa * (partner?.commissionRate || 10)) / 100
                )}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              * Dicairkan oleh Admin platform melalui sistem Reimburse setelah pengembalian unit selesai.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Aktivitas & Timeline Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
            {booking.timeline.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-[#0866F5] border-2 border-white shadow-xs" />
                <div className="text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-xs">{step.label}</p>
                    <span className="text-[10px] text-slate-400">
                      {formatDateTimeIndo(step.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] mt-0.5">Oleh: {step.actor}</p>
                  {step.notes && (
                    <p className="mt-1 p-2 bg-slate-50 rounded-md text-slate-600 text-[11px]">
                      {step.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Report Issue */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Laporkan Kendala Kesiapan Unit"
        description="Pemberitahuan diteruskan ke Admin platform untuk tindak lanjut solusi pengganti."
      >
        <form onSubmit={handleSubmitIssue} className="space-y-3">
          <Select
            label="Kategori Kendala"
            value={issueReason}
            onChange={(e) => setIssueReason(e.target.value)}
            required
            options={[
              { value: 'Unit Mengalami Kendala Mesin', label: 'Kendala Mesin / Mogok' },
              { value: 'Kerusakan Fisik / Lecet Perlu Diperbaiki', label: 'Kerusakan Fisik / Lecet' },
              { value: 'Keterlambatan Pengembalian Penyewa Sebelumnya', label: 'Penyewa Sebelumnya Terlambat' },
              { value: 'STNK / Dokumen Sedang Diurus', label: 'Masalah Dokumen / STNK' },
              { value: 'Lainnya', label: 'Lainnya' },
            ]}
          />

          <Textarea
            label="Catatan Rinci Kendala"
            placeholder="Jelaskan kondisi unit dan perkiraan waktu perbaikan..."
            value={issueNotes}
            onChange={(e) => setIssueNotes(e.target.value)}
            required
            rows={3}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsIssueModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="danger" size="sm" isLoading={isSubmittingIssue}>
              Kirim Laporan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
