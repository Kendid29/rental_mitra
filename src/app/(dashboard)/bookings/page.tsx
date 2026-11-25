"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api";
import { Booking, BookingStatus, PartnerReadinessStatus } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatRupiah, formatDateShort, formatPhone } from "@/lib/format";
import { Search, KeyRound, RotateCcw, Eye } from "lucide-react";

export default function BookingsPage() {
  const { partner } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [readinessFilter, setReadinessFilter] = useState<string>("semua");
  const [search, setSearch] = useState("");

  const loadBookings = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const res = await api.bookings.getBookings(partner.id, {
        search: search || undefined,
        status:
          activeTab === "semua" ? undefined : (activeTab as BookingStatus),
        readinessStatus:
          readinessFilter === "semua"
            ? undefined
            : (readinessFilter as PartnerReadinessStatus),
        limit: 50,
      });

      if (res.success && res.data) {
        setBookings(res.data.items);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [partner, activeTab, readinessFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBookings();
  };

  const statusTabs = [
    { id: "semua", label: "Semua Pesanan" },
    { id: "diteruskan_mitra", label: "Diteruskan Mitra" },
    { id: "berjalan", label: "Aktif Berjalan" },
    { id: "selesai", label: "Selesai" },
    { id: "dibatalkan", label: "Dibatalkan" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Daftar Penyewaan Kendaraan"
        subtitle="Kelola pesanan masuk pelanggan, konfirmasi kesiapan unit, dan serah terima"
        breadcrumbs={[{ label: "Penyewaan" }]}
      />

      {/* Tabs */}
      <Tabs tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-3.5 sm:p-4">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
          >
            <div className="sm:col-span-2">
              <Input
                placeholder="Cari no. booking, nama pelanggan, unit mobil/motor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              />
            </div>
            <div>
              <Select
                value={readinessFilter}
                onChange={(e) => setReadinessFilter(e.target.value)}
                options={[
                  { value: "semua", label: "Semua Kesiapan Unit" },
                  { value: "pending", label: "Perlu Cek Kesiapan" },
                  { value: "ready", label: "Unit Dikonfirmasi Siap" },
                  { value: "issue_reported", label: "Ada Kendala Dilaporkan" },
                ]}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada data transaksi rental untuk filter ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">No. Booking</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Armada Kendaraan
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Pelanggan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Periode Sewa
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Total Sewa</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Status</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Kesiapan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-[#102447] tabular-nums font-heading">
                        {b.bookingNumber}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-semibold text-slate-800 font-heading">
                          {b.vehicle.nama}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {b.vehicle.platNomor} •{" "}
                          {(
                            b.vehicle.tipe ||
                            b.vehicle.jenis ||
                            "mobil"
                          ).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-medium text-slate-800">
                          {b.customer.nama}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {formatPhone(
                            b.customer.telepon || b.customer.phone || "",
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-medium text-slate-700">
                          {formatDateShort(b.tanggalMulai)} -{" "}
                          {formatDateShort(b.tanggalSelesai)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {b.durasiHari} Hari Sewa
                        </p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-bold text-[#0866F5] tabular-nums text-xs font-heading">
                        {formatRupiah(b.rincianBiaya.subtotalSewa)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <StatusBadge status={b.readinessStatus} size="sm" />
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
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
                          {b.status === "diteruskan_mitra" && (
                            <Link
                              href={`/handover/${b.id}`}
                              title="Serah Terima Kunci"
                            >
                              <Button
                                variant="soft-blue"
                                size="icon-sm"
                                title="Serah Terima Kunci"
                                aria-label="Serah Terima Kunci"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-[#0866F5]" />
                              </Button>
                            </Link>
                          )}
                          {b.status === "berjalan" && (
                            <Link
                              href={`/returns/${b.id}`}
                              title="Inspeksi Pengembalian"
                            >
                              <Button
                                variant="soft-emerald"
                                size="icon-sm"
                                title="Inspeksi Pengembalian"
                                aria-label="Inspeksi Pengembalian"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
