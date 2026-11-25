# PANDUAN PENGGUNA (USER GUIDE) — RENTALINAJA MITRA PORTAL
**SOP dan Panduan Operasional Manajemen Rental Kendaraan**

---

## 1. Masuk ke Sistem (Login)

1. Buka URL Portal Mitra (`http://localhost:3000/login` atau domain produksi).
2. Di halaman login, tersedia tombol cepat **"1-Click Demo Switcher"** untuk menguji 6 profil (Owner vs Staf untuk masing-masing 3 mitra: Nusantara Rent Jogja, Maju Jaya Rent Bandung, Sahabat Motor Denpasar).
3. Anda juga dapat mengetik email dan password manual (`password123`).
4. Setelah login berhasil, sistem akan mengarahkan ke halaman **Dashboard Operasional**.

---

## 2. Navigasi & Modul Operasional

### 2.1 Dashboard Operasional (`/dashboard`)
- **Statistik Cepat**: Jumlah armada aktif, unit sedang disewa, jadwal serah terima hari ini, jadwal pengembalian hari ini, serta estimasi pendapatan bulan berjalan.
- **Grafik Tren Pendapatan & Utilitas**: Visualisasi tren omzet mingguan/bulanan dan tingkat utilisasi kendaraan (%).
- **Tindakan Cepat (Quick Actions)**: Tambah unit armada baru, jadwal servis/maintenance, blokir ketersediaan kalender, atau catat pengeluaran operasional.
- **Daftar Pesanan Membutuhkan Tindakan**: Menampilkan daftar booking yang berstatus `diteruskan_mitra` atau jadwal serah terima terdekat.

### 2.2 Manajemen Kendaraan (`/vehicles`)
- **Melihat Katalog**: Filter armada berdasarkan kategori (`mobil` / `motor`), status (`aktif`, `disewa`, `maintenance`, `nonaktif`), atau kata kunci nama dan plat nomor.
- **Menambah Armada (`/vehicles/new`)**:
  - Isi nama lengkap unit, kategori, transmisi, kapasitas penumpang & bagasi, jenis bahan bakar, tahun pembuatan, dan nomor plat polisi.
  - Tentukan tarif sewa per hari dan nilai deposit jaminan.
  - Masukkan daftar fitur unggulan (misal: Keyless, Kamera Mundur, Bluetooth Audio) dan aturan sewa (misal: Lepas Kunci, Dilarang Merokok).
- **Mengedit & Mengubah Status Unit (`/vehicles/[id]`)**:
  - Klik kartu atau baris kendaraan untuk melihat detail spesifikasi, riwayat booking unit, dan catatan servis.
  - Ubah status menjadi `maintenance` saat mobil dijadwalkan masuk bengkel.

### 2.3 Kalender Ketersediaan Armada (`/availability`)
- Visualisasi status seluruh unit per tanggal dalam satu bulan kalender.
- Memberikan kepastian ketersediaan armada saat ada pesanan sewa offline/walk-in.
- **Blokir Manual**: Tombol "Blokir Tanggal" memungkinkan pemilik menandai tanggal tertentu ketika unit dipakai untuk keperluan pribadi atau disewa secara offline.

### 2.4 Manajemen Pesanan Sewa (`/bookings`)
- **Status Booking**:
  - `diteruskan_mitra`: Pesanan baru yang sudah diverifikasi admin platform dan ditugaskan ke mitra Anda.
  - Klik pesanan untuk melihat detail penyewa, tanggal mulai & selesai, lokasi penjemputan, serta rincian biaya.
- **Konfirmasi Kesiapan Armada**:
  - Tombol **"Konfirmasi Armada Siap"** (`ready`): Menandai mobil telah dicuci bersih dan siap diserahkan kepada penyewa.
  - Tombol **"Laporkan Kendala"** (`issue_reported`): Mengirimkan notifikasi peringatan kepada tim pusat jika unit mengalami masalah mendadak.

### 2.5 Proses Serah Terima Kendaraan (`/handover`)
- Menampilkan daftar booking yang siap dilakukan serah terima unit hari ini.
- Klik **"Proses Serah Terima"** pada kartu booking terkait:
  1. Catat nama petugas yang bertugas.
  2. Masukkan angka **Odometer** dan **Level BBM** aktual saat kunci diserahkan.
  3. Ceklis kelengkapan: STNK, Kunci Cadangan, Dongkrak, Ban Serep, P3K, Segitiga Pengaman.
  4. Dokumentasikan baret atau cacat fisik eksisting jika ada.
  5. Minta penyewa membubuhkan tanda tangan digital pada area tanda tangan.
  6. Klik **"Simpan & Serahkan Unit"**. Pesanan akan otomatis bergeser ke status `berjalan`.

### 2.6 Proses Pengembalian Kendaraan (`/returns`)
- Menampilkan daftar unit yang dijadwalkan kembali hari ini atau sedang dalam status `berjalan`.
- Klik **"Proses Pengembalian"**:
  1. Masukkan angka odometer akhir dan level sisa bahan bakar.
  2. Jika ada jam keterlambatan, sistem otomatis menghitung denda keterlambatan (`lateFee`).
  3. Jika level bahan bakar kurang dari posisi awal, input kompensasi penggantian BBM (`fuelFee`).
  4. Jika ditemukan baret/kerusakan baru pasca sewa, input estimasi biaya perbaikan (`damageFee`).
  5. Klik **"Selesaikan Pengembalian"**. Status pesanan otomatis beralih menjadi `selesai` dan unit kembali berstatus `aktif` di katalog.

### 2.7 Servis & Perawatan Armada (`/maintenance`)
- Pantau jadwal servis berkala, ganti oli, servis AC, atau penggantian ban.
- Jadwalkan servis baru via tombol **"Jadwalkan Perawatan"**.
- Setelah servis selesai, klik **"Tandai Selesai"** untuk menginput biaya aktual yang otomatis dicatat ke riwayat pengeluaran mitra.

---

## 3. Manajemen Keuangan & Rekening Bank

### 3.1 Rekap Pendapatan (`/finance/income`)
- Rincian penerimaan kotor, potongan komisi platform 10%, dan penerimaan bersih per nomor transaksi.
- Filter berdasarkan bulan atau rentang tanggal tertentu.

### 3.2 Pencatatan Biaya Pengeluaran (`/finance/expenses`)
- Klik **"Catat Pengeluaran"** untuk membukukan pengeluaran bahan bakar, cuci armada, honor driver, perbaikan bengkel, atau operasional kantor.
- Tersedia ringkasan total pengeluaran per kategori secara visual.

### 3.3 Status Reimbursement (`/finance/reimbursements`)
- Melihat daftar klaim pencairan dana sewa dari platform pusat.
- Status reimbursement:
  - `belum_dibayar`: Menunggu jadwal pencairan batch dari Super Admin platform.
  - `dibayar`: Dana telah ditransfer oleh admin platform. Klik pada baris untuk melihat detail invoice dan pratinjau bukti transfer transfer bank.

### 3.4 Rekening Bank Penerimaan (`/finance/bank-accounts`)
- Daftarkan rekening bank resmi atas nama perusahaan rental atau pemilik.
- Tandai salah satu rekening sebagai **Rekening Utama** untuk tujuan pencairan dana reimburse mingguan.

---

## 4. Pengelolaan Tim, Staf & Hak Akses (`/team`)
- Pemilik (`MITRA_OWNER`) dapat menambahkan akun baru untuk manajer operasional atau staf lapangan.
- Konfigurasi hak akses (permission checklist) untuk membatasi staf agar tidak dapat melihat laporan laba rugi atau mengubah rekening penampungan.
