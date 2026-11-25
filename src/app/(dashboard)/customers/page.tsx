'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api';
import { Customer } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatRupiah, formatDateShort, formatPhone } from '@/lib/format';
import { Search, Eye } from 'lucide-react';

export default function CustomersPage() {
  const { partner } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    if (!partner) return;
    setIsLoading(true);
    try {
      const res = await api.customers.getCustomers(partner.id, {
        search: search || undefined,
        limit: 50,
      });
      if (res.success && res.data) {
        setCustomers(res.data.items);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [partner]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Database Pelanggan Rental"
        subtitle="Daftar penyewa yang pernah menyewa armada kendaraan pada mitra Anda"
        breadcrumbs={[{ label: 'Pelanggan' }]}
      />

      {/* Search Bar */}
      <Card>
        <CardContent className="p-3 sm:p-3.5">
          <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
            <div className="flex-1">
              <Input
                placeholder="Cari nama pelanggan, nomor telepon, atau kota asal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
            <Button type="submit" variant="primary" size="sm">
              Cari
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelanggan Terdaftar</CardTitle>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {customers.length} Pelanggan
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2.5">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada data pelanggan yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-heading">
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Nama Pelanggan</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Kontak</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Kota Asal</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Total Transaksi</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Total Belanja</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Terakhir Menyewa</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3">Status</th>
                    <th className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0866F5] font-bold flex items-center justify-center shrink-0 text-xs border border-blue-100">
                            {c.nama.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-xs font-heading">{c.nama}</p>
                            <p className="text-[10px] text-slate-400">ID: {c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <p className="font-medium text-slate-700">{formatPhone(c.telepon || c.phone || '')}</p>
                        <p className="text-[10px] text-slate-400">{c.email}</p>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-700 font-medium">
                        {c.kotaAsal}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-semibold text-slate-800 tabular-nums">
                        {c.totalPenyewaan || c.totalTransaksi || 0}x
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 font-bold text-[#0866F5] tabular-nums">
                        {formatRupiah(c.totalPengeluaran)}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-slate-600">
                        {formatDateShort(c.terakhirMenyewa || c.transaksiTerakhir || new Date().toISOString())}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3">
                        <Badge
                          variant={(c.statusVerifikasi || 'terverifikasi') === 'terverifikasi' ? 'emerald' : 'amber'}
                          size="sm"
                        >
                          {(c.statusVerifikasi || 'terverifikasi').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 sm:py-3 text-right">
                        <Link href={`/customers/${c.id}`} title="Lihat Profil Pelanggan">
                          <Button variant="outline" size="icon-sm" title="Lihat Profil Pelanggan" aria-label="Lihat Profil Pelanggan">
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                          </Button>
                        </Link>
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
