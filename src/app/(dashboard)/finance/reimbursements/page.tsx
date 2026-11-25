'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { api } from '@/api';
import { Reimbursement } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { formatRupiah, formatDateShort, formatDateTimeIndo } from '@/lib/format';
import { Eye, ShieldAlert, CheckCircle2, Clock, Info, ExternalLink } from 'lucide-react';

export default function ReimbursementsPage() {
  const { partner } = useAuth();
  const { isOwner } = usePermission();

  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Proof Preview
  const [selectedProof, setSelectedProof] = useState<Reimbursement | null>(null);

  useEffect(() => {
    if (!partner) return;
    setIsLoading(true);
    api.reimbursements
      .getReimbursements(partner.id, { limit: 50 })
      .then((res) => {
        if (res.success && res.data) {
          setReimbursements(res.data.items);
        }
      })
      .finally(() => setIsLoading(false));
  }, [partner]);

  if (!isOwner) {
    return (
      <Card className="p-8 text-center">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#FF4D4D] flex items-center justify-center mx-auto mb-2 shadow-xs">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-[#102447] font-heading">Akses Dibatasi</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Hanya Pemilik Bisnis (MITRA_OWNER) yang memiliki izin untuk memantau pencairan dana reimburse.
        </p>
      </Card>
    );
  }

  const totalMenunggu = reimbursements
    .filter((r) => r.status === 'belum_dibayar')
    .reduce((acc, cur) => acc + cur.nominalBersihMitra, 0);

  const totalDicairkan = reimbursements
    .filter((r) => r.status === 'dibayar' || (r.status as string) === 'sudah_dibayar')
    .reduce((acc, cur) => acc + cur.nominalBersihMitra, 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Klaim Pencairan Dana (Reimburse Admin)"
        subtitle="Pantau pencairan pendapatan sewa bersih yang ditransfer Admin RentalinAja"
        breadcrumbs={[{ label: 'Keuangan' }, { label: 'Reimburse' }]}
      />

      {/* Info Card explaining business rule */}
      <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-950 shadow-xs">
        <div className="p-1 rounded-md bg-blue-100 text-[#0866F5] shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="font-bold text-xs text-[#102447] font-heading">
            Ketentuan Pencairan Dana Platform (Reimburse):
          </p>
          <p className="text-slate-700 leading-relaxed text-[11px] mt-0.5">
            Setelah penyewa menyelesaikan pengembalian unit, sistem menerbitkan klaim reimburse. Admin RentalinAja mentransfer nominal bersih (setelah dipotong komisi {partner?.commissionRate || 10}%) ke rekening utama mitra Anda. Bukti transfer resmi diunggah langsung oleh Super Admin platform.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          title="Total Menunggu Pencairan"
          value={formatRupiah(totalMenunggu)}
          subtitle={`${reimbursements.filter((r) => r.status === 'belum_dibayar').length} transaksi dalam proses transfer admin`}
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          iconBg="bg-amber-50"
        />

        <StatCard
          title="Total Telah Dicairkan ke Rekening"
          value={formatRupiah(totalDicairkan)}
          subtitle={`${reimbursements.filter((r) => r.status === 'dibayar').length} transaksi berhasil dicairkan`}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Reimbursement Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Daftar Klaim Reimburse</CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Riwayat klaim pencairan pendapatan sewa mitra
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {reimbursements.length} Klaim
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : reimbursements.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada data reimburse yang diterbitkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">No. Booking</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Armada & Pelanggan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Rekening Penerima</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">Tarif Kotor</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">Hak Bersih</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-center">Status</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">Bukti Transfer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {reimbursements.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-[#102447] font-heading tabular-nums">
                        #{r.bookingNumber}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-semibold text-slate-800 font-heading">{r.vehicleName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{r.customerName}</p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-semibold text-slate-700">{r.bankTujuan?.bankName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                          {r.bankTujuan?.accountNumber} a/n {r.bankTujuan?.accountHolder}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right font-medium text-slate-700 tabular-nums">
                        {formatRupiah(r.totalTransaksiKotor)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right font-bold text-emerald-600 tabular-nums">
                        {formatRupiah(r.nominalBersihMitra)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-center">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                        {r.buktiTransferUrl ? (
                          <Button
                            variant="soft-blue"
                            size="xs"
                            onClick={() => setSelectedProof(r)}
                            leftIcon={<Eye className="w-3 h-3" />}
                          >
                            Lihat Bukti
                          </Button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Menunggu Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Preview Bukti Transfer */}
      {selectedProof && (
        <Modal
          isOpen={!!selectedProof}
          onClose={() => setSelectedProof(null)}
          title={`Bukti Transfer Reimburse #${selectedProof.bookingNumber}`}
          description={`Ditransfer ke ${selectedProof.bankTujuan?.bankName} - ${selectedProof.bankTujuan?.accountNumber} a/n ${selectedProof.bankTujuan?.accountHolder}`}
        >
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal Hak Bersih:</span>
                <span className="font-bold text-emerald-600 tabular-nums">
                  {formatRupiah(selectedProof.nominalBersihMitra)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Pencairan:</span>
                <span className="font-semibold text-slate-800">
                  {selectedProof.tanggalPembayaran
                    ? formatDateTimeIndo(selectedProof.tanggalPembayaran)
                    : formatDateShort(selectedProof.createdAt)}
                </span>
              </div>
            </div>

            {selectedProof.buktiTransferUrl && (
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center p-2">
                <img
                  src={selectedProof.buktiTransferUrl}
                  alt="Bukti Transfer Admin"
                  className="max-h-80 w-auto rounded object-contain shadow-xs"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedProof(null)}>
                Tutup
              </Button>
              {selectedProof.buktiTransferUrl && (
                <a
                  href={selectedProof.buktiTransferUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="primary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Buka Gambar Asli
                  </Button>
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
