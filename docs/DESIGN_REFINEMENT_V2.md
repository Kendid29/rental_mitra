# DOKUMENTASI DESIGN REFINEMENT V2 — RENTALINAJA MITRA
**Compact, Consistent & Premium SaaS Interface**
*Tanggal Implementasi: 19 November 2026*

---

## 1. Ringkasan Eksekutif & Tujuan Refinement

Tahap **Design Refinement V2** dilakukan untuk mentransformasi antarmuka portal mitra **RentalinAja** dari tampilan template dashboard konvensional (yang sebelumnya memiliki elemen grafis berlebih, efek gradient/glassmorphism yang dominan, serta ruang vertikal yang terlalu longgar) menjadi antarmuka **Compact, Refined, Premium Enterprise SaaS**.

Inspirasi visual diambil dari standar produk SaaS modern tier-1 seperti **Linear, Stripe Dashboard, Vercel, dan Raycast**, dengan filosofi utama:
> **Consistency > Decoration**
> *(Setiap elemen didesain dengan hierarki visual tegas, skala ukuran yang seragam, dan efisiensi ruang tinggi untuk kebutuhan operasional harian).*

---

## 2. Standarisasi Design Tokens & Skala Ukuran

### 2.1 Skala Ukuran Tombol (Button Scale)
Semua tombol kini tunduk pada aturan ketat ukuran tinggi dan padding seragam:
| Ukuran | Height | Padding Horizontal | Font Size & Weight | Penggunaan Utama |
| :--- | :--- | :--- | :--- | :--- |
| **`xs`** | `h-7` (28px) | `px-2` | 11px font-semibold | Tombol aksi dalam tabel & baris data |
| **`sm`** | `h-8` (32px) | `px-2.5` | 12px font-semibold | Tombol filter toolbar, modal, & secondary actions |
| **`md`** | `h-9` (36px) | `px-3` | 13px font-semibold | Tombol standar form input & navigasi |
| **`lg`** | `h-10` (40px) | `px-4` | 14px font-bold | Tombol login & call-to-action utama |
| **`icon-sm`** | `h-7 w-7` (28px) | - | - | Tombol icon baris tabel (edit/delete) |
| **`icon`** | `h-8 w-8` (32px) | - | - | Tombol icon navigasi & toolbar |

Radius seluruh tombol distandarisasi ke **`rounded-lg`** (8px) dengan bayangan halus `shadow-xs`.

### 2.2 Standardisasi Kartu (Card Standard)
- **Container Radius**: `rounded-xl` (12px) seragam di seluruh card.
- **Border**: `border border-slate-200/80` (1px clean border, tidak ada border neon atau double border).
- **Shadow**: `shadow-xs` (`0 1px 2px 0 rgba(0, 0, 0, 0.04)`), bayangan lembut minim polusi visual.
- **Card Header**: `px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 bg-transparent flex items-center justify-between`.
- **Card Content**: `p-4 sm:p-5`.

### 2.3 Skala Form Input & Kontrol (Input & Select)
- **Tinggi Input / Select**: `h-9` (36px).
- **Radius**: `rounded-lg`.
- **Label**: `text-[11px] font-semibold text-slate-700 uppercase tracking-wider font-heading mb-1`.
- **Focus Ring**: `focus:ring-1 focus:ring-[#0866F5] focus:border-[#0866F5]` halus dan tegas.

### 2.4 Status Badge & Pill
- Mengganti animasi `animate-ping` yang mengganggu dengan **titik statis rapi** (`w-1.5 h-1.5 rounded-full`).
- **Dimensi**: `text-[11px] px-2 py-0.5 rounded-md border font-medium`.

### 2.5 Tabel Data (DataTable & Ledger)
- **Header Tabel**: `bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading px-4 py-2.5 sm:px-5 sm:py-3`.
- **Baris Data**: Tinggi baris dibuat kompak (`px-4 py-2.5 sm:px-5 sm:py-3`), teks `text-xs` (13px), hover subtle `hover:bg-slate-50/70`.

---

## 3. Restrukturisasi Shell & Komponen Layout

### 3.1 Sidebar (`Sidebar.tsx`)
- **Lebar**: Disederhanakan dari `w-72` (288px) menjadi **`w-64` (256px)** yang kompak.
- **Header Brand**: Tinggi dipangkas menjadi **`h-14` (56px)** dengan logo 32px dan tipografi ramping.
- **Partner Info**: Mini card compact `bg-white/5 border border-white/10 rounded-lg p-2`.
- **Item Navigasi**:
  - Tinggi link: `py-1.5 px-2.5 rounded-lg text-xs font-medium`.
  - Status aktif: `bg-[#0866F5] text-white font-semibold shadow-xs`.
  - Jarak antar seksi navigasi: `space-y-3.5`.
- **Footer**: Profile badge dengan logout button kompak `h-8 text-xs rounded-lg`.

### 3.2 Topbar (`Topbar.tsx`)
- **Tinggi Header**: Dipangkas menjadi **`h-14` (56px)** dari sebelumnya 64px.
- **Partner Switcher**: Kontrol `h-8 px-2.5 rounded-lg border border-slate-200/90 text-xs shadow-xs`.
- **Role Switcher**: Segmented pill `h-8 bg-slate-100 p-0.5 rounded-lg` dengan tombol `h-7 text-[11px] font-bold`.
- **Notification Bell**: Tombol `w-8 h-8 rounded-lg border border-slate-200/80 shadow-xs`.
- **User Profile**: Tombol `h-8 px-2 rounded-lg border border-slate-200/80 shadow-xs`.
- **Popover Dropdowns**: `rounded-xl shadow-lg border border-slate-200`.

### 3.3 Dashboard Shell (`DashboardShell.tsx`)
- Offset margin desktop: `lg:pl-64` (presisi mengikuti lebar sidebar 256px).
- Container padding: `p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-5`.

---

## 4. Perombakan Halaman Dashboard (`/dashboard`)

1. **Penggantian Hero Banner Raksasa**:
   - Menghilangkan banner gradasi 450px dengan background glow blur yang mendominasi layar.
   - Digantikan oleh **Executive Welcome Bar Ramping (~115px height)** berwarna dark navy `#102447` yang anggun dan fungsional.
   - Menyajikan informasi esensial: Chip Mitra Resmi Terverifikasi, Kota Layanan, Nama Tenant, Rate Komisi Platform, tombol Tambah Armada & Kalender (`size="sm"`), serta mini-strip distribusi status armada (Tersedia, Disewa, Servis, Total).
2. **Kompak KPI Cards**:
   - Menghapus aksen garis gradasi pelangi pada card.
   - Angka statistik ditampilkan dengan ukuran seimbang (`text-xl sm:text-2xl font-bold font-heading`).
   - Ukuran container ikon: 32px (`w-8 h-8 rounded-lg`).
3. **Penyempurnaan Grafik & Tabel**:
   - `LineAreaChart` diatur pada tinggi proporsional `height={200}`.
   - Quick action shortcuts dibuat kompak dengan border clean dan rounded-lg.
   - Tabel 5 pesanan terbaru menggunakan padding kompak `py-2.5 sm:py-3` dengan tombol aksi `size="xs"` (28px).

---

## 5. Audit & Standardisasi Seluruh 24 Route Aplikasi

Semua rute telah disesuaikan dengan Design Tokens V2:
1. `/login`: Form card clean `rounded-xl border border-slate-200`, quick demo account switcher chip `h-7`, tanpa particle glow berlebih.
2. `/vehicles`: Grid card kendaraan kompak `rounded-xl border border-slate-200`, foto `h-40`, pill spek `rounded-md`, table view kompak.
3. `/vehicles/new` & `/vehicles/[id]/edit`: Form input rapi dengan input tinggi `h-9` dan tombol submit `size="sm"`.
4. `/vehicles/[id]`: Detail halaman armada dengan perbandingan harga, spesifikasi, dan riwayat pesanan.
5. `/availability`: Toolbar pemilihan armada ramping, legend cards kompak `p-3`, tabel blackout dates rapi.
6. `/bookings`: Segmented tabs status pesanan `h-8`, filter toolbar rapi, tabel booking kompak dengan tombol aksi `size="xs"`.
7. `/bookings/[id]`: Action bar status operasional navy ramping, rincian biaya, dan timeline audit transaksi.
8. `/handover` & `/handover/[id]`: SOP info card ringkas, checklist serah terima bertahap dengan switch kompak.
9. `/returns` & `/returns/[id]`: Baseline perbandingan serah terima vs pengembalian, kalkulator denda keterlambatan dan selisih BBM otomatis.
10. `/customers` & `/customers/[id]`: Direktori penyewa dengan riwayat total transaksi, pengeluaran, dan formulir catatan internal mitra.
11. `/maintenance` & `/maintenance/new`: Antrean bengkel, pemblokiran kalender otomatis, dan pencatatan pengeluaran.
12. `/finance/income`: Buku kas pendapatan sewa bruto, komisi platform 10%, hak bersih mitra, dan ekspor CSV.
13. `/finance/expenses`: Buku beban kas operasional armada, modal input pengeluaran, filter kategori.
14. `/finance/reimbursements`: Daftar klaim pencairan dana platform, modal preview bukti transfer admin resmi.
15. `/finance/bank-accounts`: Kartu rekening bank penerima reimburse dengan penanda rekening utama.
16. `/reports`: Laporan analitik bisnis, tren omzet bulanan, unit paling menguntungkan, dan distribusi biaya.
17. `/team`: Manajemen staf operasional dengan sakelar hak akses granular (RBAC).
18. `/settings/business`: Profil bisnis, jam buka pool, dan kontak PIC.
19. `/settings/account`: Profil pengguna, pembaruan sandi, dan tombol reset database simulasi.
20. `/notifications`: Feed aktivitas real-time dengan kategori transaksi, keuangan, dan maintenance.
21. `/help`: Pusat bantuan SOP operasional 4 langkah dan FAQ.

---

## 6. Hasil Verifikasi & QA Teknis

- **TypeScript Typecheck (`npx tsc --noEmit`)**: **PASSED (Exit Code: 0)**
  - Seluruh types diuji dan diverifikasi sinkron dengan model data `src/types/`.
- **Next.js Production Build (`next build --webpack`)**: **PASSED (Exit Code: 0)**
  - Seluruh 24 rute halaman terkompilasi sebagai static & dynamic pages tanpa error.
- **Performance & Usability**:
  - Mengurangi beban render grafis berat dan efek blur CSS yang membebani GPU.
  - Peningkatan informasi yang terlihat langsung pada layar pertama (above-the-fold) tanpa perlu scrolling panjang.
