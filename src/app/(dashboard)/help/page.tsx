'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  KeyRound,
  RotateCcw,
  ShieldCheck,
  FileCheck2,
  Phone,
} from 'lucide-react';

export default function HelpPage() {
  const sops = [
    {
      title: '1. SOP Penerimaan Pesanan & Verifikasi Kesiapan',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50',
      description:
        'Saat pesanan berstatus "Diteruskan Mitra", staf mitra wajib mengecek kondisi fisik armada (kebersihan luar dalam, tekanan ban, level BBM, dan masa berlaku STNK). Jika siap, klik tombol "Konfirmasi Unit Siap". Jika ada kendala, segera laporkan kendala agar Admin dapat menyiapkan solusi pengganti.',
    },
    {
      title: '2. SOP Serah Terima Kunci Kendaraan',
      icon: KeyRound,
      color: 'text-amber-600 bg-amber-50',
      description:
        'Wajib memeriksa kartu identitas fisik asli (KTP dan SIM) penyewa. Buka menu Serah Terima, masukkan KM odometer dan persentase BBM aktual. Dokumentasikan foto 4 sisi kendaraan bersama penyewa untuk bukti kondisi awal, lalu serahkan kunci dan STNK asli.',
    },
    {
      title: '3. SOP Pengembalian Unit & Perhitungan Penalti',
      icon: RotateCcw,
      color: 'text-emerald-600 bg-emerald-50',
      description:
        'Saat pelanggan mengembalikan kendaraan, lakukan inspeksi keliling bodi dan kabin. Masukkan KM akhir dan level BBM. Sistem akan menghitung denda keterlambatan (Rp 50.000/jam) atau selisih BBM secara otomatis jika di bawah level awal.',
    },
    {
      title: '4. SOP Pencairan Dana Hak Mitra (Reimburse)',
      icon: FileCheck2,
      color: 'text-purple-600 bg-purple-50',
      description:
        'Setelah pesanan selesai diinspeksi, sistem otomatis membukukan hak bersih mitra (tarif sewa kotor dikurangi komisi platform 10%). Tim Admin RentalinAja akan melakukan transfer pembayaran ke Rekening Utama Anda dan mengunggah bukti transfer resmi ke portal.',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Pusat Bantuan & Standar Operasional (SOP)"
        subtitle="Panduan operasional dan standar pelayanan prima bagi seluruh mitra resmi"
        breadcrumbs={[{ label: 'Bantuan' }]}
      />

      {/* Support Emergency Contact Card */}
      <div className="p-4 sm:p-5 bg-[#102447] text-white rounded-xl shadow-xs border border-[#1b3b72] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 font-heading">
            Bantuan Hotline Mitra 24/7
          </span>
          <h3 className="text-base font-bold font-heading mt-0.5">Butuh Bantuan Mendesak dari Admin?</h3>
          <p className="text-xs text-slate-300 mt-0.5 max-w-md">
            Hubungi tim Account Manager Mitra RentalinAja untuk kendala darurat seputar armada atau kendala sistem.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="success" size="sm" leftIcon={<Phone className="w-3.5 h-3.5" />}>
              WhatsApp Hotline
            </Button>
          </a>
        </div>
      </div>

      {/* SOP Cards */}
      <div className="space-y-3">
        {sops.map((sop, idx) => {
          const Icon = sop.icon;
          return (
            <Card key={idx} className="p-3.5 sm:p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${sop.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102447] font-heading">
                    {sop.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {sop.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* FAQ Accordion-like cards */}
      <Card>
        <CardHeader>
          <CardTitle>Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs divide-y divide-slate-100">
          <div className="pt-1">
            <p className="font-bold text-slate-900 text-xs">
              Kapan dana sewa dicairkan ke rekening mitra?
            </p>
            <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
              Pencairan dana dilakukan dalam waktu 1x24 jam hari kerja setelah proses Inspeksi Pengembalian kendaraan diselesaikan oleh mitra.
            </p>
          </div>

          <div className="pt-2.5">
            <p className="font-bold text-slate-900 text-xs">
              Bagaimana jika kendaraan mengalami kecelakaan atau kerusakan oleh penyewa?
            </p>
            <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
              Mitra wajib mencatat seluruh kerusakan pada formulir Inspeksi Pengembalian dan menyertakan foto. Tim investigasi platform akan membantu mediasi klaim asuransi atau pembebanan tanggung jawab perbaikan ke penyewa sesuai perjanjian sewa.
            </p>
          </div>

          <div className="pt-2.5">
            <p className="font-bold text-slate-900 text-xs">
              Apakah staf saya bisa melihat rincian keuangan atau rekening bank?
            </p>
            <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
              Tidak. Modul Keuangan (Pendapatan, Pengeluaran, Reimburse, dan Rekening Bank) serta Laporan Analitik dilindungi oleh sistem hak akses ketat dan hanya dapat dilihat oleh akun Pemilik Bisnis (MITRA_OWNER).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
