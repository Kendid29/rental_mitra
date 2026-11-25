"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { api } from "@/api";
import { MaintenanceRecord, Vehicle } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formatRupiah, formatDateShort } from "@/lib/format";
import { Plus, CheckCircle2, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function MaintenancePage() {
  const { partner } = useAuth();
  const { canManageMaintenance } = usePermission();

  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [statusFilter, setStatusFilter] = useState("semua");
  const [selectedVehicle, setSelectedVehicle] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const [maintRes, vehRes] = await Promise.all([
        api.maintenance.getMaintenanceRecords(partner.id, {
          status: statusFilter === "semua" ? undefined : statusFilter,
          vehicleId: selectedVehicle === "semua" ? undefined : selectedVehicle,
          limit: 50,
        }),
        api.vehicles.getVehicles(partner.id, { limit: 100 }),
      ]);

      if (maintRes.success && maintRes.data) {
        setRecords(maintRes.data.items);
      }
      if (vehRes.success && vehRes.data) {
        setVehicles(vehRes.data.items);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [partner, statusFilter, selectedVehicle]);

  const handleMarkComplete = async (id: string, name: string) => {
    if (
      !confirm(
        `Konfirmasi bahwa servis untuk unit "${name}" telah selesai dan unit siap beroperasi kembali?`,
      )
    )
      return;
    if (!partner) return;

    const res = await api.maintenance.updateStatus(partner.id, id, "selesai");
    if (res.success) {
      toast.success("Servis ditandai selesai! Unit kini berstatus Tersedia.");
      loadData();
    } else {
      toast.error("Gagal memperbarui status");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Perawatan & Servis Armada"
        subtitle="Jadwal bengkel, ganti oli rutin, servis rem, dan perbaikan armada"
        breadcrumbs={[{ label: "Maintenance" }]}
        actions={
          canManageMaintenance && (
            <Link href="/maintenance/new">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Catat Servis
              </Button>
            </Link>
          )
        }
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-3 sm:p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "semua", label: "Semua Status Servis" },
              {
                value: "sedang_dikerjakan",
                label: "Sedang Dikerjakan di Bengkel",
              },
              { value: "dijadwalkan", label: "Dijadwalkan Akan Datang" },
              { value: "selesai", label: "Selesai Dikerjakan" },
            ]}
          />
          <Select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            <option value="semua">Semua Unit Armada</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nama} ({v.platNomor})
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {/* Maintenance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat & Antrean Servis Bengkel</CardTitle>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {records.length} Catatan
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada catatan servis untuk kriteria filter ini.
            </div>
          ) : (
            <div className="overflow-x-auto" data-lenis-prevent>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Armada Kendaraan
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Jenis Servis
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Bengkel & Lokasi
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Periode Servis
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Biaya Servis
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Status</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {records.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-semibold text-slate-800 text-xs font-heading">
                          {m.vehicleName}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {m.platNomor}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-medium text-slate-800 capitalize">
                          {m.jenisPerawatan}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                          {m.deskripsi || m.deskripsiPekerjaan}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-700 font-medium">
                        {m.namaBengkel}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-600">
                        {formatDateShort(m.tanggalMulai)}{" "}
                        {m.estimasiSelesai
                          ? `s/d ${formatDateShort(m.estimasiSelesai)}`
                          : ""}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-[#102447] tabular-nums">
                        {formatRupiah(m.biaya)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <Badge
                          variant={
                            m.status === "selesai"
                              ? "emerald"
                              : m.status === "sedang_dikerjakan"
                                ? "amber"
                                : "blue"
                          }
                          size="sm"
                        >
                          {m.status.toUpperCase().replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/maintenance/${m.id}`}
                            title="Lihat Detail Servis"
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
                          {m.status !== "selesai" && canManageMaintenance && (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() =>
                                handleMarkComplete(m.id, m.vehicleName)
                              }
                              title="Tandai Selesai Servis"
                              aria-label="Tandai Selesai Servis"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-700" />
                            </Button>
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
