"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { api } from "@/api";
import { Vehicle, VehicleFilters } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatRupiah } from "@/lib/format";
import { StaggerContainer, StaggerItem } from "@/components/motion/reveal";
import {
  Plus,
  Search,
  Car,
  Eye,
  Edit,
  Trash2,
  Fuel,
  Users,
  Gauge,
  LayoutGrid,
  List,
} from "lucide-react";
import toast from "react-hot-toast";

export default function VehiclesPage() {
  const { partner } = useAuth();
  const { canManageVehicles } = usePermission();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"semua" | "mobil" | "motor">(
    "semua",
  );
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const loadVehicles = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const filters: VehicleFilters = {
        search: search || undefined,
        tipe: typeFilter,
        status: statusFilter as any,
        limit: 50,
      };
      const res = await api.vehicles.getVehicles(partner.id, filters);
      if (res.success && res.data) {
        setVehicles(res.data.items);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [partner, typeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadVehicles();
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus unit kendaraan "${name}"?`)) return;
    if (!partner) return;

    const res = await api.vehicles.deleteVehicle(partner.id, id);
    if (res.success) {
      toast.success(`Unit "${name}" berhasil dihapus`);
      loadVehicles();
    } else {
      toast.error(res.error?.message || "Gagal menghapus unit");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Manajemen Armada Kendaraan"
        subtitle={`Inventaris mobil dan motor milik ${partner?.name || "Mitra"}`}
        breadcrumbs={[{ label: "Kendaraan" }]}
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/90 h-8">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#102447] shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-[#102447] shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Tampilan Tabel"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {canManageVehicles && (
              <Link href="/vehicles/new">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Tambah Unit
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Filter & Search Toolbar */}
      <Card>
        <CardContent className="p-3.5 sm:p-4">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
          >
            <div className="lg:col-span-2">
              <Input
                placeholder="Cari nama kendaraan, plat nomor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              />
            </div>
            <div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                options={[
                  { value: "semua", label: "Semua Kategori (Mobil & Motor)" },
                  { value: "mobil", label: "Hanya Mobil" },
                  { value: "motor", label: "Hanya Motor" },
                ]}
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "semua", label: "Semua Status Unit" },
                  { value: "aktif", label: "Tersedia (Aktif)" },
                  { value: "disewa", label: "Sedang Disewa" },
                  { value: "maintenance", label: "Perawatan Bengkel" },
                  { value: "nonaktif", label: "Nonaktif" },
                ]}
              />
            </div>
          </form>

          {/* Active Filter Counter */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
            <span>
              Menampilkan{" "}
              <strong className="text-slate-800 font-semibold">
                {vehicles.length} unit
              </strong>{" "}
              armada
            </span>
            {(search || typeFilter !== "semua" || statusFilter !== "semua") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("semua");
                  setStatusFilter("semua");
                }}
                className="text-[#0866F5] font-semibold hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid or Table Mode */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-68 bg-white rounded-xl animate-pulse border border-slate-200"
            />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0866F5] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#102447] font-heading">
              Tidak ada kendaraan ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5 mb-4">
              Sesuaikan kata kunci pencarian atau ubah filter status yang Anda
              pilih.
            </p>
            {canManageVehicles && (
              <Link href="/vehicles/new">
                <Button
                  variant="primary"
                  size="xs"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Tambah Unit Baru
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <StaggerItem
              key={v.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden hover:border-slate-300 transition-colors flex flex-col group"
            >
              {/* Image & Status Badges */}
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <img
                  src={
                    v.fotoUtama ||
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={v.nama}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                  <StatusBadge status={v.status} size="sm" />
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-white">
                    {v.tipe}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded-md text-[11px] font-bold text-[#102447] tabular-nums shadow-xs border border-slate-200/80 font-heading">
                  {v.platNomor}
                </div>
              </div>

              {/* Body */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#102447] font-heading line-clamp-1">
                        {v.nama}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {v.merek} {v.model} • Thn {v.tahun}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#0866F5] tabular-nums font-heading">
                        {formatRupiah(v.hargaPerHari)}
                      </p>
                      <p className="text-[10px] text-slate-400">/hari</p>
                    </div>
                  </div>

                  {/* Specs Pill Summary */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-md">
                      <Users className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {v.kapasitasPenumpang} Kursi
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-md">
                      <Fuel className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate capitalize">{v.transmisi}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-md">
                      <Gauge className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate tabular-nums">
                        {v.odometerKm.toLocaleString()} KM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 mt-3.5 pt-2.5 border-t border-slate-100">
                  <div className="text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {v.totalPenyewaan}x
                    </span>{" "}
                    disewa
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/vehicles/${v.id}`} title="Lihat Detail">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Lihat Detail"
                        aria-label="Lihat Detail"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                      </Button>
                    </Link>
                    {canManageVehicles && (
                      <>
                        <Link
                          href={`/vehicles/${v.id}/edit`}
                          title="Edit Armada"
                        >
                          <Button
                            variant="outline"
                            size="icon-sm"
                            title="Edit Armada"
                            aria-label="Edit Armada"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-600" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleDeleteVehicle(v.id, v.nama)}
                          title="Hapus Armada"
                          aria-label="Hapus Armada"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto" data-lenis-prevent>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Armada Kendaraan
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Kategori & Tipe
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Tarif Harian
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Odometer</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Status</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {vehicles.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              v.fotoUtama ||
                              "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80"
                            }
                            alt={v.nama}
                            className="w-10 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 text-xs font-heading">
                              {v.nama}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {v.platNomor} • Thn {v.tahun}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <span className="font-medium text-slate-700 capitalize">
                          {v.tipe}
                        </span>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {v.transmisi} • {v.kapasitasPenumpang} Kursi
                        </p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <span className="font-bold text-[#0866F5] text-xs tabular-nums">
                          {formatRupiah(v.hargaPerHari)}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-0.5">
                          /hari
                        </span>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-medium text-slate-700 tabular-nums">
                        {v.odometerKm.toLocaleString()} KM
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <StatusBadge status={v.status} size="sm" />
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/vehicles/${v.id}`} title="Lihat Detail">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              title="Lihat Detail"
                              aria-label="Lihat Detail"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                            </Button>
                          </Link>
                          {canManageVehicles && (
                            <>
                              <Link
                                href={`/vehicles/${v.id}/edit`}
                                title="Edit Armada"
                              >
                                <Button
                                  variant="outline"
                                  size="icon-sm"
                                  title="Edit Armada"
                                  aria-label="Edit Armada"
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-600" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() =>
                                  handleDeleteVehicle(v.id, v.nama)
                                }
                                title="Hapus Armada"
                                aria-label="Hapus Armada"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
