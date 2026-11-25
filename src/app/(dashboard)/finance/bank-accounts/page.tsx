"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { api } from "@/api";
import { BankAccount } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { maskAccountNumber } from "@/lib/format";
import { BANK_OPTIONS } from "@/lib/constants";
import { Building2, Plus, Star, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function BankAccountsPage() {
  const { partner } = useAuth();
  const { isOwner } = usePermission();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAccounts = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const res = await api.bankAccounts.getBankAccounts(partner.id);
      if (res.success && res.data) {
        setAccounts(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [partner]);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    if (!accountNumber || !accountHolder) {
      toast.error("Nomor rekening dan nama pemilik wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.bankAccounts.addBankAccount(partner.id, {
        bankName,
        accountNumber,
        accountHolder,
        isPrimary,
      });

      if (res.success) {
        toast.success("Rekening bank berhasil ditambahkan");
        setIsModalOpen(false);
        setAccountNumber("");
        setAccountHolder("");
        loadAccounts();
      } else {
        toast.error(res.error?.message || "Gagal menambahkan rekening");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    if (!partner) return;
    const res = await api.bankAccounts.setPrimary(partner.id, accountId);
    if (res.success) {
      toast.success("Rekening utama berhasil diperbarui");
      loadAccounts();
    } else {
      toast.error("Gagal memperbarui rekening");
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (accounts.length <= 1) {
      toast.error(
        "Tidak dapat menghapus rekening satu-satunya. Minimal harus ada 1 rekening penerima.",
      );
      return;
    }

    if (!confirm("Hapus rekening bank ini?")) return;
    if (!partner) return;

    const res = await api.bankAccounts.deleteBankAccount(partner.id, accountId);
    if (res.success) {
      toast.success("Rekening berhasil dihapus");
      loadAccounts();
    } else {
      toast.error(res.error?.message || "Gagal menghapus rekening");
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
          Hanya Pemilik Bisnis (MITRA_OWNER) yang berhak mengatur rekening
          pencairan dana.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Rekening Bank Penerima Reimburse"
        subtitle="Kelola rekening bank resmi tempat transfer pencairan pendapatan sewa dari Admin platform"
        breadcrumbs={[{ label: "Keuangan" }, { label: "Rekening Bank" }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Tambah Rekening
          </Button>
        }
      />

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-2.5">
            <div className="h-20 bg-white rounded-xl animate-pulse border border-slate-200" />
            <div className="h-20 bg-white rounded-xl animate-pulse border border-slate-200" />
          </div>
        ) : (
          accounts.map((acc) => (
            <div
              key={acc.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-xs ${
                acc.isPrimary
                  ? "border-blue-400/90 ring-1 ring-blue-400/20"
                  : "border-slate-200/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    acc.isPrimary
                      ? "bg-[#0866F5] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#102447] text-sm font-heading">
                      {acc.bankName}
                    </span>
                    {acc.isPrimary && (
                      <Badge variant="blue" size="sm">
                        UTAMA
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5 font-mono tracking-wider">
                    {maskAccountNumber(acc.accountNumber)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    a/n{" "}
                    <span className="font-medium text-slate-700">
                      {acc.accountHolder}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!acc.isPrimary && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleSetPrimary(acc.id)}
                    leftIcon={<Star className="w-3 h-3 text-amber-500" />}
                  >
                    Jadikan Utama
                  </Button>
                )}
                {accounts.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleDeleteAccount(acc.id)}
                    title="Hapus Rekening"
                    aria-label="Hapus Rekening"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Account */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Rekening Bank Baru"
        description="Pastikan nama rekening sesuai identitas pemilik rental atau badan usaha resmi."
      >
        <form onSubmit={handleAddAccount} className="space-y-3">
          <Select
            label="Nama Bank"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            options={BANK_OPTIONS.map((b) => ({ value: b, label: b }))}
          />

          <Input
            label="Nomor Rekening"
            placeholder="Contoh: 1234567890"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />

          <Input
            label="Nama Pemilik Rekening"
            placeholder="Contoh: PT NUSANTARA RENT ABADI"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            required
          />

          <Switch
            label="Jadikan Sebagai Rekening Utama"
            description="Pencairan reimburse otomatis dikirim ke rekening ini"
            checked={isPrimary}
            onChange={setIsPrimary}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
              Simpan Rekening
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
