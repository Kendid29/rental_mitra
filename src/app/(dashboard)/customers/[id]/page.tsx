"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api";
import { Customer, Booking } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { formatRupiah, formatDateShort, formatPhone } from "@/lib/format";
import { ArrowLeft, Phone, Mail, MapPin, Save, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const router = useRouter();
  const { partner } = useAuth();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [operationalNotes, setOperationalNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    if (!partner || !customerId) return;

    setIsLoading(true);
    Promise.all([
      api.customers.getCustomerById(partner.id, customerId),
      api.bookings.getBookings(partner.id, { limit: 50 }),
    ]).then(([custRes, bookRes]) => {
      if (custRes.success && custRes.data) {
        setCustomer(custRes.data);
        setOperationalNotes(custRes.data.catatanOperasional || "");
      } else {
        toast.error("Pelanggan tidak ditemukan");
        router.push("/customers");
      }

      if (bookRes.success && bookRes.data) {
        setCustomerBookings(
          bookRes.data.items.filter((b) => b.customerId === customerId),
        );
      }
      setIsLoading(false);
    });
  }, [partner, customerId, router]);

  const handleSaveNotes = async () => {
    if (!partner || !customer) return;
    setIsSavingNotes(true);
    try {
      const res = await api.customers.updateCustomerNotes(
        partner.id,
        customer.id,
        operationalNotes,
      );
      if (res.success) {
        toast.success("Catatan operasional pelanggan berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan catatan");
      }
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (isLoading || !customer) {
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
        title={customer.nama}
        subtitle={`Pelanggan Terdaftar • Kota Asal: ${customer.kotaAsal}`}
        breadcrumbs={[
          { label: "Pelanggan", href: "/customers" },
          { label: customer.nama },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Kembali
          </Button>
        }
      />

      {/* Profile & Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0866F5] font-bold text-xl flex items-center justify-center mb-2.5 border border-blue-100 select-none">
              {customer.nama.charAt(0)}
            </div>
            <h3 className="text-base font-bold text-[#102447] font-heading">
              {customer.nama}
            </h3>
            <Badge
              variant={
                (customer.statusVerifikasi || "terverifikasi") ===
                "terverifikasi"
                  ? "emerald"
                  : "amber"
              }
              size="sm"
              className="mt-1"
            >
              {(customer.statusVerifikasi || "terverifikasi").toUpperCase()}
            </Badge>

            <div className="w-full mt-4 pt-3 border-t border-slate-100 space-y-2 text-left text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <a
                  href={`https://wa.me/${(customer.telepon || customer.phone || "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-semibold"
                >
                  {formatPhone(customer.telepon || customer.phone || "")}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{customer.kotaAsal}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Metrics & Operational Notes */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                Total Penyewaan
              </span>
              <span className="text-xl font-bold text-[#0866F5] tabular-nums font-heading mt-0.5 block">
                {customer.totalPenyewaan || customer.totalTransaksi || 0}x
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                Total Belanja
              </span>
              <span className="text-xl font-bold text-emerald-600 tabular-nums font-heading mt-0.5 block">
                {formatRupiah(customer.totalPengeluaran)}
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Catatan Khusus Mitra (Internal)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Catatan mengenai riwayat mengemudi, ketepatan waktu pengembalian, atau preferensi pelanggan..."
                value={operationalNotes}
                onChange={(e) => setOperationalNotes(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={handleSaveNotes}
                  isLoading={isSavingNotes}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Simpan Catatan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi Pelanggan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto" data-lenis-prevent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-heading">
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">No. Booking</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Kendaraan</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Jadwal Sewa</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Total Biaya</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3">Status</th>
                  <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {customerBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-[#102447] tabular-nums font-heading">
                      #{b.bookingNumber}
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                      <p className="font-semibold text-slate-800 text-xs font-heading">
                        {b.vehicle.nama}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {b.vehicle.platNomor}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-600">
                      {formatDateShort(b.tanggalMulai)} -{" "}
                      {formatDateShort(b.tanggalSelesai)} ({b.durasiHari} Hari)
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-slate-800 tabular-nums">
                      {formatRupiah(b.rincianBiaya.subtotalSewa)}
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                      <Badge variant="blue" size="sm">
                        {b.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                      <Link
                        href={`/bookings/${b.id}`}
                        title="Lihat Detail Pesanan"
                      >
                        <Button
                          variant="outline"
                          size="icon-sm"
                          title="Lihat Detail"
                          aria-label="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
