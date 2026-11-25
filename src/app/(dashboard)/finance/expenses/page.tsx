"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { api } from "@/api";
import { ExpenseEntry, Vehicle } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Textarea } from "@/components/ui/Textarea";
import { formatRupiah, formatDateShort } from "@/lib/format";
import { Receipt, Plus, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function ExpensesPage() {
  const { partner, user } = useAuth();
  const { isOwner } = usePermission();

  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kategori, setKategori] = useState("Cuci & Salon Mobil");
  const [deskripsi, setDeskripsi] = useState("");
  const [nominal, setNominal] = useState<number>(50000);
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [metodePembayaran, setMetodePembayaran] = useState("Transfer Bank");
  const [vehicleId, setVehicleId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const [expRes, vehRes] = await Promise.all([
        api.finance.getExpenses(partner.id, {
          kategori: categoryFilter === "semua" ? undefined : categoryFilter,
          limit: 50,
        }),
        api.vehicles.getVehicles(partner.id, { limit: 100 }),
      ]);

      if (expRes.success && expRes.data) {
        setExpenses(expRes.data.items);
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
  }, [partner, categoryFilter]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    if (!deskripsi || !nominal) {
      toast.error("Mohon isi deskripsi dan nominal pengeluaran");
      return;
    }

    const linkedVeh = vehicles.find((v) => v.id === vehicleId);

    setIsSubmitting(true);
    try {
      const res = await api.finance.createExpense(partner.id, {
        kategori,
        tanggal,
        deskripsi,
        nominal: Number(nominal),
        metodePembayaran,
        vehicleId: linkedVeh?.id,
        vehicleName: linkedVeh?.nama,
        platNomor: linkedVeh?.platNomor,
        dicatatOleh: user?.name || "Staff",
      });

      if (res.success) {
        toast.success("Pengeluaran berhasil dicatat ke buku kas");
        setIsModalOpen(false);
        setDeskripsi("");
        loadData();
      } else {
        toast.error("Gagal mencatat pengeluaran");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string, desc: string) => {
    if (!confirm(`Hapus pengeluaran "${desc}"?`)) return;
    if (!partner) return;

    const res = await api.finance.deleteExpense(partner.id, id);
    if (res.success) {
      toast.success("Pengeluaran berhasil dihapus");
      loadData();
    } else {
      toast.error("Gagal menghapus");
    }
  };

  if (!isOwner) {
    return (
      <Card className="p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900 font-heading">
          Akses Dibatasi
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Hanya Pemilik Bisnis (MITRA_OWNER) yang memiliki izin untuk mengelola
          buku pengeluaran operasional.
        </p>
      </Card>
    );
  }

  const totalPengeluaran = expenses.reduce((acc, cur) => acc + cur.nominal, 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Pengeluaran Operasional Armada"
        subtitle="Catatan biaya pemeliharaan, cuci mobil, BBM, dan suku cadang"
        breadcrumbs={[{ label: "Keuangan" }, { label: "Pengeluaran" }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Catat Pengeluaran
          </Button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          title="Total Beban Operasional Tercatat"
          value={formatRupiah(totalPengeluaran)}
          subtitle={`${expenses.length} bukti pengeluaran`}
          icon={<Receipt className="w-4 h-4 text-rose-600" />}
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Rata-rata Pengeluaran per Catatan"
          value={formatRupiah(
            expenses.length > 0 ? totalPengeluaran / expenses.length : 0,
          )}
          subtitle="Biaya operasional rata-rata"
          icon={<Receipt className="w-4 h-4 text-slate-600" />}
          iconBg="bg-slate-100"
        />
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-700 font-heading">
            Filter Kategori Beban:
          </div>
          <div className="w-full sm:w-72">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: "semua", label: "Semua Kategori Beban" },
                { value: "Cuci & Salon Mobil", label: "Cuci & Salon Mobil" },
                { value: "Servis & Sparepart", label: "Servis & Sparepart" },
                { value: "BBM & Tol", label: "BBM & Tol" },
                {
                  value: "Pajak & Dokumen STNK",
                  label: "Pajak & Dokumen STNK",
                },
                { value: "Operasional Kantor", label: "Operasional Kantor" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Buku Pengeluaran Kas</CardTitle>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {expenses.length} Catatan
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada data pengeluaran operasional.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Tanggal</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Kategori</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Deskripsi</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Armada Terkait
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">
                      Metode Bayar
                    </th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Nominal</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {expenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-600 font-medium">
                        {formatDateShort(exp.tanggal)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <Badge variant="blue" size="sm">
                          {exp.kategori}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-800 font-medium">
                        {exp.deskripsi}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-600">
                        {exp.vehicleName ? (
                          <span>
                            {exp.vehicleName}{" "}
                            <span className="text-[10px] text-slate-400">
                              ({exp.platNomor})
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">
                            Umum / Semua
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-600">
                        {exp.metodePembayaran}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-rose-600 tabular-nums">
                        {formatRupiah(exp.nominal)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            handleDeleteExpense(exp.id, exp.deskripsi)
                          }
                          title="Hapus Catatan"
                          aria-label="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Add Expense */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Pengeluaran Operasional"
        description="Masukkan bukti pengeluaran kas sewa armada"
      >
        <form onSubmit={handleCreateExpense} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori Beban"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              options={[
                { value: "Cuci & Salon Mobil", label: "Cuci & Salon Mobil" },
                { value: "Servis & Sparepart", label: "Servis & Sparepart" },
                { value: "BBM & Tol", label: "BBM & Tol" },
                {
                  value: "Pajak & Dokumen STNK",
                  label: "Pajak & Dokumen STNK",
                },
                { value: "Operasional Kantor", label: "Operasional Kantor" },
              ]}
              required
            />
            <DatePicker
              label="Tanggal Transaksi"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
          </div>

          <Input
            label="Nominal Biaya (Rp)"
            type="number"
            min={1000}
            step={1000}
            value={nominal}
            onChange={(e) => setNominal(Number(e.target.value))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Metode Bayar"
              value={metodePembayaran}
              onChange={(e) => setMetodePembayaran(e.target.value)}
              options={[
                { value: "Transfer Bank", label: "Transfer Bank" },
                { value: "Kas Tunai (Cash)", label: "Kas Tunai (Cash)" },
                { value: "QRIS / E-Wallet", label: "QRIS / E-Wallet" },
                { value: "Kartu Debit", label: "Kartu Debit" },
              ]}
              required
            />
            <Select
              label="Armada Terkait (Opsional)"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            >
              <option value="">Umum / Tidak Spesifik</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nama} ({v.platNomor})
                </option>
              ))}
            </Select>
          </div>

          <Textarea
            label="Keterangan / Deskripsi"
            placeholder="Contoh: Cuci mobil eksterior & interior setelah pengembalian unit"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={2}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Simpan Pengeluaran
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
