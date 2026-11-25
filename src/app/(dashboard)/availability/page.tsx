'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { AvailabilityBlock, Vehicle } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatDateShort } from '@/lib/format';
import {
  Plus,
  Trash2,
  Car,
  Clock,
  Wrench,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AvailabilityPage() {
  const { partner } = useAuth();
  const { canManageAvailability } = usePermission();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('semua');
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for adding manual block
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVehicleId, setModalVehicleId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const [vehRes, schedRes] = await Promise.all([
        api.vehicles.getVehicles(partner.id, { limit: 100 }),
        api.availability.getSchedule(
          partner.id,
          selectedVehicleId === 'semua' ? undefined : selectedVehicleId
        ),
      ]);

      if (vehRes.success && vehRes.data) {
        setVehicles(vehRes.data.items);
        if (!modalVehicleId && vehRes.data.items.length > 0) {
          setModalVehicleId(vehRes.data.items[0].id);
        }
      }

      if (schedRes.success && schedRes.data) {
        setBlocks(schedRes.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [partner, selectedVehicleId]);

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner || !modalVehicleId || !startDate || !endDate) {
      toast.error('Mohon pilih unit dan rentang tanggal blokir');
      return;
    }

    if (startDate > endDate) {
      toast.error('Tanggal mulai tidak boleh melebihi tanggal selesai');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.availability.addManualBlock(partner.id, {
        vehicleId: modalVehicleId,
        startDate,
        endDate,
        notes,
      });

      if (res.success) {
        toast.success('Jadwal berhasil diblokir secara manual');
        setIsModalOpen(false);
        setNotes('');
        loadData();
      } else {
        toast.error(res.error?.message || 'Gagal memblokir jadwal (kemungkinan bentrok)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveBlock = async (blockId: string, type: string) => {
    if (type === 'booking') {
      toast.error('Jadwal penyewaan pelanggan tidak dapat dihapus manual.');
      return;
    }

    if (!confirm('Yakin ingin membuka kembali jadwal ini?')) return;
    if (!partner) return;

    const res = await api.availability.removeBlock(partner.id, blockId);
    if (res.success) {
      toast.success('Blokir jadwal berhasil dicabut');
      loadData();
    } else {
      toast.error(res.error?.message || 'Gagal menghapus blokir');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Jadwal & Ketersediaan Armada"
        subtitle="Pantau kalender booking, servis bengkel, dan blackout date manual"
        breadcrumbs={[{ label: 'Ketersediaan Armada' }]}
        actions={
          canManageAvailability && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Tambah Blokir Manual
            </Button>
          )
        }
      />

      {/* Filter by Vehicle Toolbar */}
      <Card>
        <CardContent className="p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0 font-heading">
            <div className="p-1 rounded-md bg-blue-50 text-[#0866F5] border border-blue-100">
              <Car className="w-3.5 h-3.5" />
            </div>
            <span>Pilih Unit Armada:</span>
          </div>
          <div className="w-full sm:w-72">
            <Select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              <option value="semua">Semua Unit Armada ({vehicles.length})</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nama} ({v.platNomor})
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Legend & Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866F5] flex items-center justify-center font-bold shrink-0 border border-blue-100">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 font-heading">Pesanan Aktif (Booking)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Otomatis saat transaksi lunas</p>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#FF4D4D] flex items-center justify-center font-bold shrink-0 border border-rose-100">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 font-heading">Perawatan (Maintenance)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Unit di bengkel/servis berkala</p>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#FFB800] flex items-center justify-center font-bold shrink-0 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 font-heading">Blokir Manual Mitra</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Dipakai pribadi / sewa offline</p>
          </div>
        </div>
      </div>

      {/* Schedule Blocks Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Daftar Blokir Tanggal & Kalender Aktif</CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Jadwal reservasi pelanggan dan blackout date operasional
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {blocks.length} Periode
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : blocks.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada jadwal terblokir pada unit ini. Armada siap disewakan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Tipe Blokir</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Keterangan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Armada Kendaraan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Periode Tanggal</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Catatan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {blocks.map((b) => {
                    const veh = vehicles.find((v) => v.id === b.vehicleId);
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                              b.type === 'booking'
                                ? 'bg-blue-50 text-[#0866F5] border-blue-200'
                                : b.type === 'maintenance'
                                ? 'bg-rose-50 text-[#FF4D4D] border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                b.type === 'booking'
                                  ? 'bg-[#0866F5]'
                                  : b.type === 'maintenance'
                                  ? 'bg-[#FF4D4D]'
                                  : 'bg-amber-500'
                              }`}
                            />
                            {b.type === 'booking'
                              ? 'Booking Sewa'
                              : b.type === 'maintenance'
                              ? 'Maintenance'
                              : 'Manual Mitra'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-slate-800 font-heading">
                          {b.title}
                        </td>
                        <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                          <p className="font-semibold text-slate-800 font-heading">{veh?.nama || b.vehicleId}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{veh?.platNomor}</p>
                        </td>
                        <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-medium text-slate-700">
                          {formatDateShort(b.startDate)} s/d {formatDateShort(b.endDate)}
                        </td>
                        <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-500 italic">
                          {b.notes || '-'}
                        </td>
                        <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                          {b.type === 'manual_block' && canManageAvailability && (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleRemoveBlock(b.id, b.type)}
                              title="Buka Blokir Tanggal"
                              aria-label="Buka Blokir Tanggal"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600" />
                            </Button>
                          )}
                          {b.type !== 'manual_block' && (
                            <span className="text-[10px] text-slate-400 font-medium">Terkunci</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Add Manual Block */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Blokir Tanggal Manual"
        description="Pilih kendaraan dan rentang blackout date agar armada tidak dapat dipesan di sistem."
      >
        <form onSubmit={handleAddBlock} className="space-y-3">
          <Select
            label="Pilih Unit Kendaraan"
            value={modalVehicleId}
            onChange={(e) => setModalVehicleId(e.target.value)}
            required
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nama} ({v.platNomor})
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Alasan / Catatan"
            placeholder="Contoh: Digunakan acara keluarga pemilik"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Simpan Blokir
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
