# Product Requirement Document (PRD) — Portal Mitra RentalinAja
**Enterprise Multi-Partner Vehicle Rental Operations Management System**

---

## 1. Executive Summary & Visi Produk

RentalinAja adalah ekosistem marketplace penyewaan kendaraan terpadu berskala nasional yang menghubungkan pelanggan publik (`rental_user`), pengelola platform (`rental_admin`), dan pengusaha rental lokal terverifikasi (`rental_mitra`).

**Portal Mitra (`rental_mitra`)** dirancang khusus sebagai solusi SaaS operasional B2B kelas enterprise untuk memberdayakan pemilik bisnis rental kendaraan (*fleet operators*) dalam mengotomatisasi, memantau, dan mengontrol seluruh rantai nilai bisnis mereka: mulai dari inventaris kendaraan, penetapan harga sewa, kalender ketersediaan armada anti-bentrok, penerimaan order, proses serah terima fisik (handover), inspeksi pengembalian & denda, jadwal pemeliharaan bengkel, hingga pembukuan keuangan dan pemantauan pencairan dana reimburse dari platform.

---

## 2. Pengguna Sasaran & Peran (Role & Persona)

### A. MITRA_OWNER (Pemilik Bisnis Rental)
* **Tujuan**: Memaksimalkan utilisasi armada, memantau omzet dan margin laba bersih harian/bulanan, memastikan keamanan aset fisik, mengelola akun staf operasional, dan menerima pencairan dana hak mitra secara akurat ke rekening bank utama.
* **Hak Akses**: Akses penuh ke seluruh 12 modul operasional, pembukuan keuangan (pendapatan, pengeluaran, klaim reimburse), rekening bank, laporan analitik bisnis, dan konfigurasi izin staf.

### B. MITRA_STAFF (Staf Lapangan / Petugas Operasional)
* **Tujuan**: Memeriksa kesiapan armada sebelum pelanggan tiba, memverifikasi identitas pelanggan, melakukan checklist serah terima kunci, menjalankan inspeksi bodi & BBM saat unit kembali, serta mencatat jadwal servis bengkel.
* **Hak Akses**: Dibatasi hanya pada modul operasional harian (Kendaraan, Ketersediaan, Penyewaan, Serah Terima, Pengembalian, Pelanggan, Maintenance). Modul keuangan, rekening bank, tim & staf, dan laporan laba dilindungi dan tersembunyi secara ketat.

---

## 3. Spesifikasi Fungsional Per Modul

### 3.1 Dashboard Operasional
* Metrik KPI real-time:
  * **Armada Tersedia**: Total unit aktif yang siap disewa hari ini.
  * **Sewa Aktif Berjalan**: Unit yang sedang berada di tangan pelanggan.
  * **Menunggu Serah Terima**: Transaksi yang jadwal penyerahan kuncinya jatuh hari ini.
  * **Menunggu Pengembalian**: Transaksi yang jatuh tempo kembali hari ini.
  * **Unit Dalam Servis**: Kendaraan yang sedang berada di bengkel perbaikan.
  * **Omzet & Laba Bersih** (khusus Owner): Grafik tren pendapatan vs beban 6 bulan terakhir.
* **Banner Perhatian Operasional**: Notifikasi mencolok bila ada pesanan baru yang membutuhkan verifikasi kesiapan unit atau laporan kendala dari lapangan.
* **Tabel Pesanan Terkini**: Daftar 5 pesanan terbaru lengkap dengan status transaksi dan badge kesiapan mitra.

### 3.2 Manajemen Armada Kendaraan (Fleet Inventory)
* Formulir registrasi unit baru multi-section:
  1. *Info Umum*: Nama unit, merek, model, tahun, tipe (mobil/motor), segmen/kategori, warna, plat nomor.
  2. *Spesifikasi Teknis*: Transmisi (Manual/Matic), kapasitas penumpang, bahan bakar, cc mesin, odometer awal.
  3. *Penetapan Tarif*: Harga sewa per 24 jam, deposit jaminan, tarif supir per hari (opsional).
  4. *Layanan & Fasilitas*: Toggle lepas kunci, dengan sopir, termasuk BBM, AC dingin, dashcam, Bluetooth.
  5. *Foto & Kebijakan*: Foto utama beresolusi tinggi, galeri, deskripsi detail, syarat khusus mitra.
* Filter armada berdasarkan tipe (Mobil & Motor), status operasional (tersedia, disewa, maintenance, nonaktif), dan kata kunci plat/nama.
* Halaman detail unit: Spesifikasi lengkap, riwayat penyewaan, mini-kalender jadwal sewa, dan tombol aksi servis/edit.

### 3.3 Ketersediaan Armada & Deteksi Bentrok (Availability Schedule)
* Kalender timeline visual untuk setiap kendaraan yang terdaftar.
* Klasifikasi blokir tanggal:
  * **Booking Sewa (Biru)**: Otomatis terbit saat pesanan transaksi divalidasi. Tidak dapat dihapus manual.
  * **Maintenance Bengkel (Merah)**: Otomatis terbit saat servis dijadwalkan.
  * **Blokir Manual Mitra (Kuning)**: Fitur bagi mitra untuk memblokir rentang tanggal tertentu (misal: dipakai acara keluarga pemilik, atau istirahat armada).
* **Collision Detection Engine**: Sistem otomatis menolak pembuatan jadwal bila terjadi tumpang tindih (*overlap*) tanggal dengan pesanan atau servis lain.

### 3.4 Siklus Transaksi Penyewaan (Bookings Lifecycle)
* Mengikuti kesepakatan status platform RentalinAja:
  * `menunggu_konfirmasi`: Pelanggan telah checkout, menunggu validasi bayar oleh Admin.
  * `terkonfirmasi`: Pembayaran valid di Admin.
  * `diteruskan_mitra`: Pesanan masuk ke Portal Mitra untuk persiapan armada.
  * `berjalan`: Kunci telah diserahterimakan ke penyewa.
  * `selesai`: Kendaraan telah dikembalikan dan diinspeksi.
  * `dibatalkan`: Transaksi dibatalkan resmi.
* **Konfirmasi Kesiapan Armada (Partner Readiness Status)**:
  * `pending`: Menunggu pengecekan fisik oleh staf mitra.
  * `ready`: Mitra mengonfirmasi armada bersih, BBM cukup, dokumen lengkap, dan siap diserahkan.
  * `issue_reported`: Mitra melaporkan kendala fisik/mesin ke Admin platform agar dicarikan solusi unit pengganti.

### 3.5 Serah Terima Kendaraan (Handover Checklist)
* Validasi identitas fisik asli penyewa (KTP & SIM).
* Form checklist digital terstruktur:
  * Odometer KM awal.
  * Level BBM awal (%) dengan acuan minimal 80-100%.
  * Pengecekan kebersihan kabin & bodi eksterior.
  * Kelengkapan: STNK asli, kunci cadangan, ban serep, dongkrak, toolkit, P3K.
  * Dokumentasi foto kondisi awal unit bersama penyewa.
  * Tanda tangan digital & nama petugas penyerah.
* Submit handover otomatis mengubah status booking menjadi `berjalan` dan unit menjadi `disewa`.

### 3.6 Pengembalian Kendaraan & Inspeksi (Return Inspection)
* Perbandingan otomatis terhadap data acuan serah terima awal (KM awal vs KM akhir, level BBM awal vs akhir).
* Perhitungan denda dan penyesuaian biaya live otomatis:
  * **Keterlambatan**: Denda per jam keterlambatan (Rp 50.000/jam).
  * **Selisih BBM**: Denda kompensasi BBM jika level kembali lebih rendah dari level awal.
  * **Kerusakan Baru**: Biaya perbaikan bodi atau salon interior noda rokok/makanan.
* Submit pengembalian otomatis:
  * Menutup pesanan ke status `selesai`.
  * Mengembalikan status armada ke `tersedia` dan mengupdate odometer terakhir.
  * Membukukan hak bersih transaksi ke Buku Kas Pendapatan.
  * Menerbitkan antrean klaim Reimburse ke Admin platform.

### 3.7 Database Pelanggan & Catatan Operasional
* Daftar seluruh pelanggan yang pernah menyewa armada mitra.
* Ringkasan metrik: Total frekuensi sewa, total nilai belanja, tanggal terakhir menyewa.
* Catatan internal mitra: Fitur bagi staf untuk menyimpan catatan rahasia tentang kebiasaan penyewa (misal: penyewa sangat tertib, atau pernah mengembalikan terlambat).

### 3.8 Pemeliharaan Armada (Maintenance & Servis)
* Pencatatan servis berkala, ganti oli, servis rem, ban, perbaikan AC, dan salon bodi.
* Otomasi sistem:
  * Mengubah status kendaraan menjadi `maintenance`.
  * Memblokir jadwal ketersediaan pada kalender.
  * Otomatis membukukan biaya servis ke modul Pengeluaran Operasional.
* Aksi penyelesaian servis: Mengembalikan status unit ke `tersedia` dan membuka blokir jadwal.

### 3.9 Keuangan: Buku Pendapatan (Income Ledger)
* Rincian finansial per transaksi selesai:
  * Harga sewa kotor (*gross rental fee*).
  * Potongan komisi platform (10%).
  * Hak bersih mitra (*net payout*).
  * Status pencairan reimburse (*menunggu / dicairkan*).
* Ekspor buku besar pendapatan ke file `.csv`.

### 3.10 Keuangan: Pengeluaran Operasional (Expense Tracking)
* Pencatatan beban harian operasional mitra: Biaya servis, BBM armada, cuci mobil, gaji/uang makan driver, pajak/STNK, dan beban umum garasi.
* Pelacakan pengeluaran per unit kendaraan spesifik atau beban umum.
* Penghitungan efisiensi beban operasional terhadap omzet kotor.

### 3.11 Keuangan: Pencairan Dana Hak Mitra (Reimbursements)
* **Aturan Bisnis Platform**:
  * Mitra **hanya membaca status** (`belum_dibayar` / `dibayar`).
  * Mitra **TIDAK BISA** mengubah status reimburse menjadi dibayar atau mengunggah bukti transfer (itu wewenang mutlak Admin platform).
  * Mitra dapat melihat nomor referensi transfer bank, tanggal transfer, catatan admin, dan pratinjau bukti transfer resmi yang diunggah oleh Admin.

### 3.12 Keuangan: Rekening Bank Mitra
* Pengelolaan rekening bank resmi penampung transfer reimburse.
* Menandai satu rekening sebagai "Rekening Utama".
* Penegakan aturan: Minimal 1 rekening wajib tersisa (sistem mencegah penghapusan jika hanya ada 1 rekening).
* Tampilan nomor rekening dengan masking keamanan (`****5678`).

### 3.13 Laporan & Analitik Bisnis
* Periode filter: 30 Hari, 3 Bulan, Tahun Ini.
* KPI profitabilitas: Omzet bruto, total komisi, pendapatan bersih, beban operasional, margin laba bersih.
* Grafik garis & area tren multi-bulan.
* Grafik batang unit armada paling menguntungkan (*top revenue generators*).
* Grafik donat distribusi beban operasional per kategori.
* Ekspor laporan performa bisnis ke CSV.

### 3.14 Manajemen Tim & Staf (RBAC)
* Pembuatan akun staf dengan pembatasan hak akses berbasis checkbox:
  * Kelola Kendaraan
  * Kelola Ketersediaan
  * Proses Serah Terima
  * Proses Pengembalian
  * Kelola Maintenance
* Proteksi: Akun Pemilik Bisnis (`MITRA_OWNER`) tidak dapat dihapus, dan modul sensitif keuangan selalu terkunci dari staf.

### 3.15 Pengaturan Profil Bisnis & Akun
* Profil bisnis resmi: Nama brand rental, badan usaha (PT/CV/Perorangan), alamat garasi, jam operasional layanan, nama & WhatsApp PIC.
* Status verifikasi resmi dan komisi platform (read-only dari Admin).
* Pengaturan akun personal dan simulasi ubah kata sandi.

### 3.16 Pusat Notifikasi & Standar Operasional (SOP)
* Notifikasi aktivitas sistem real-time (pesanan baru, jadwal serah terima, transfer reimburse cair).
* Dokumen SOP panduan penyerahan kunci, verifikasi identitas, inspeksi bodi, dan nomor hotline darurat admin RentalinAja.

---

## 4. Persyaratan Desain & UI/UX

Mengacu pada pedoman desain resmi `rental_user/docs/design/DESIGN.md`:
* **Tema Visual**: *Executive Fleet Modern* — bersih, terpercaya, berwibawa, dan bernuansa mobility technology modern.
* **Palet Warna Fondasi**:
  * Primary Navy: `#102447` (Navbar, Header, Sidebar, Text)
  * Action Blue: `#0866F5` (CTA Utama, Tab Aktif, Icon Aksi)
  * Emerald: `#00C48C` (Status Sukses, Laba Bersih, Tombol Serah Terima Selesai)
  * Canvas: `#F8FAFC` (Latar Belakang Aplikasi)
  * Card Background: `#FFFFFF` dengan border halus `#E2E8F0`
  * Text Primary: `#191C1E` & Text Secondary: `#64748B`
  * Warning Amber: `#FFB800` & Danger Red: `#FF4D4D`
* **Tipografi**:
  * Headings: `Outfit` (Modern, geometric, bold)
  * Body Text & Angka: `Hanken Grotesk` dengan `tabular-nums` untuk nominal uang Rupiah dan angka statistik.
* **Prinsip UI**:
  * Zero AI sparkles.
  * Border dan shadow terukur (*subtle*).
  * State lengkap untuk setiap interaksi: Hover, active, focus, disabled, skeleton loading, dan empty state.
