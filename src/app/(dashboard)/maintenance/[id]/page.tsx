'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { MaintenanceRecord } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatRupiah, formatDateIndo } from '@/lib/format';
import { ArrowLeft, CheckCircle2, Wrench, Building2, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MaintenanceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { partner } = useAuth();
  const { canManageMaintenance } = usePermission();

  const [record, setRecord] = useState<MaintenanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partner || !id) return;
    api.maintenance.getMaintenanceById(partner.id, id).then((res) => {
      if (res.success && res.data) {
        setRecord(res.data);
      } else {
        toast.error('Data perawatan tidak ditemukan');
        router.push('/maintenance');
      }
      setIsLoading(false);
    });
  }, [partner, id, router]);

  const handleMarkComplete = async () => {
    if (!partner || !record) return;
    const res = await api.maintenance.updateStatus(partner.id, record.id, 'selesai');
    if (res.success) {
      toast.success('Servis berhasil diselesaikan!');
      setRecord({ ...record, status: 'selesai' });
    } else {
      toast.error('Gagal memperbarui status');
    }
  };

  if (isLoading || !record) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 pb-12">
      <PageHeader
        title={`Servis: ${record.jenisPerawatan}`}
        subtitle={`Armada: ${record.vehicleName} (${record.platNomor})`}
        breadcrumbs={[
          { label: 'Maintenance', href: '/maintenance' },
          { label: record.jenisPerawatan },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Kembali
            </Button>
            {record.status !== 'selesai' && canManageMaintenance && (
              <Button
                variant="success"
                size="sm"
                onClick={handleMarkComplete}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Tandai Servis Selesai
              </Button>
            )}
          </div>
        }
      />

      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Rincian Servis & Pengerjaan</CardTitle>
              <Badge
                variant={
                  record.status === 'selesai'
                    ? 'emerald'
                    : record.status === 'sedang_dikerjakan'
                    ? 'red'
                    : 'amber'
                }
                size="md"
                dot
              >
                {record.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Nama Bengkel</span>
                <span className="font-bold text-slate-800 text-sm">{record.namaBengkel}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Odometer KM Servis</span>
                <span className="font-bold text-slate-800 text-sm">{record.odometerKm.toLocaleString()} KM</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Tanggal Masuk</span>
                <span className="font-semibold text-slate-800">{formatDateIndo(record.tanggalMulai)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Estimasi / Selesai</span>
                <span className="font-semibold text-slate-800">{formatDateIndo(record.estimasiSelesai)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Catatan Pengerjaan Bengkel:</span>
              <p className="text-slate-700 leading-relaxed">{record.deskripsiPekerjaan || record.deskripsi || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Cost & Receipt */}
        <div className="space-y-4">
          <Card className="p-6">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Total Biaya Perawatan
            </span>
            <p className="text-2xl font-extrabold text-[#102447] mt-1 tabular-nums font-heading">
              {formatRupiah(record.biaya)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              ✓ Telah dibukukan ke Buku Kas
            </p>

            {record.fotoNota && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-semibold block mb-2">
                  Foto Nota Bengkel:
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={record.fotoNota}
                    alt="Nota Servis"
                    className="w-full h-44 object-cover"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
