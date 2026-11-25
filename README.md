# RentalinAja — Partner Portal (Portal Mitra)
**Enterprise Vehicle Rental Partner Management System**

Aplikasi ketiga dalam ekosistem platform penyewaan kendaraan **RentalinAja**, dibangun khusus untuk pemilik bisnis rental dan staf operasional dalam mengelola armada, jadwal ketersediaan, serah terima, pengembalian, perawatan bengkel, serta laporan keuangan multi-mitra.

---

## 🚀 Fitur Utama & Modul

1. **Dashboard Operasional Eksekutif**: Ringkasan armada aktif, pemesanan berjalan, utilisasi armada (%), omzet bulan berjalan, serta antrean serah terima & pengembalian hari ini.
2. **Katalog Armada Kendaraan**: Pengelolaan unit mobil dan motor dengan filter status (`aktif`, `disewa`, `maintenance`, `nonaktif`), form tambah/edit unit, dan manajemen deposit jaminan.
3. **Kalender Ketersediaan (Armada Schedule)**: Visualisasi ketersediaan tanggal sewa dan fitur blokir manual (blackout date) untuk keperluan servis atau sewa offline.
4. **Penyewaan & Pesanan (Booking Management)**: Alur penerimaan pesanan dari platform customer dengan konfirmasi kesiapan armada (`pending`, `ready`, `issue_reported`).
5. **Berita Acara Serah Terima (Handover)**: Inspeksi odometer, level bahan bakar, checklist kelengkapan (STNK, dongkrak, ban serep), pencatatan baret fisik lama, dan tanda tangan digital penyewa.
6. **Berita Acara Pengembalian (Return Inspection)**: Kalkulasi otomatis denda keterlambatan (late fee), kekurangan bahan bakar (fuel fee), dan biaya perbaikan kerusakan baru.
7. **Perawatan Kendaraan (Maintenance Log)**: Penjadwalan servis rutin berkala, penggantian oli, riwayat bengkel, dan integrasi otomatis ke pencatatan biaya operasional.
8. **Keuangan & Rekening Bank**:
   - Rekap pendapatan bersih (dipotong komisi platform 10%).
   - Pencatatan pengeluaran operasional per kategori.
   - Status reimbursement dari Super Admin platform (read-only dengan pratinjau bukti transfer resmi).
   - Registrasi rekening bank pencairan dana resmi.
9. **Manajemen Staf & Hak Akses (RBAC)**: Pengaturan peran `MITRA_OWNER` vs `MITRA_STAFF` dengan toggle permission granular.
10. **Isolasi Data Multi-Mitra (Multi-Tenant)**: Proteksi data 100% terisolasi berdasarkan `mitraId` untuk mencegah kebocoran data antar pemilik rental.

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 16 (App Router) & React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS 4 dengan Design Tokens *Executive Fleet Modern* (`#102447`, `#0866F5`, `#00C48C`, `#F8FAFC`)
- **Tipografi**: Outfit (Headings) & Hanken Grotesk (Body & Angka Tabular)
- **Ikonografi**: Lucide React
- **Notifikasi**: React Hot Toast
- **State & Mock Engine**: In-Memory Stateful Mock Engine tersinkronisasi ke browser `localStorage` dengan simulasi latensi jaringan (SSR-safe).

---

## 👥 Akun Simulasi & Kredensial Demo

Di halaman login (`/login`), tersedia tombol **"1-Click Demo Switcher"** untuk menguji akun berikut secara instan:

| No | Mitra Rental | Lokasi | Role | Email | Password |
|---|---|---|---|---|---|
| 1 | Nusantara Rent | Yogyakarta | Owner | `owner@nusantararent.com` | `password123` |
| 2 | Nusantara Rent | Yogyakarta | Staff | `staff@nusantararent.com` | `password123` |
| 3 | Maju Jaya Rent | Bandung | Owner | `owner@majujayarent.com` | `password123` |
| 4 | Maju Jaya Rent | Bandung | Staff | `staff@majujayarent.com` | `password123` |
| 5 | Sahabat Motor | Denpasar | Owner | `owner@sahabatmotor.com` | `password123` |
| 6 | Sahabat Motor | Denpasar | Staff | `staff@sahabatmotor.com` | `password123` |

---

## 💻 Panduan Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
cd rental_mitra
npm install
```

### 2. Jalankan Mode Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. Build Produksi & Type-Check
```bash
npm run build
```

---

## 📚 Dokumentasi Terkait

- [Design System & UI Guidelines (DESIGN_SYSTEM.md)](docs/DESIGN_SYSTEM.md)
- [Audit UI/UX (DESIGN_AUDIT.md)](docs/DESIGN_AUDIT.md)
- [Progress Redesign UI/UX (DESIGN_REDESIGN_PROGRESS.md)](docs/DESIGN_REDESIGN_PROGRESS.md)
- [PRD & Arsitektur Sistem](docs/PRD_MITRA.md)
- [Kontrak API (API_CONTRACT.md)](docs/API_CONTRACT.md)
- [Model Data & Entity Relationship](docs/DATA_MODEL.md)
- [Aturan Bisnis & SOP Operasional](docs/BUSINESS_RULES.md)
- [Panduan Pengguna (User Guide)](docs/USER_GUIDE.md)
- [Dokumentasi Data Mock](docs/MOCK_DATA.md)
- [Panduan Migrasi ke Backend Real API](docs/MIGRATION_TO_REAL_API.md)
