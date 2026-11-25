# AUDIT DESAIN UI/UX — RENTALINAJA MITRA PORTAL
**Comprehensive Design & Usability Evaluation**  
Tanggal Audit: 19 November 2026  
Target: `rental_mitra`

---

## 1. Temuan Audit Visual & Komponen Saat Ini

### 1.1 Global Layout & Shell
- **Sidebar**:
  - Tampilan statis tanpa opsi *collapse* (icon-only mode) untuk layar laptop 13-14 inch, sehingga memakan 288px (w-72) ruang kerja horizontal.
  - Belum ada *counter badge* pada rute operasional penting (misalnya jumlah pesanan baru atau antrean serah terima hari ini).
  - Warna sidebar navy (`#102447`) solid tanpa sentuhan kedalaman visual (depth/ambient accent) atau *indicator pill* halus yang modern.
- **Topbar**:
  - Masih berupa header putih biasa dengan border tipis tanpa efek *glassmorphism* (`backdrop-blur`).
  - Belum memiliki *breadcrumb navigation* dinamis yang menampilkan hierarki navigasi (misal: `Kendaraan > Toyota Innova Zenix > Edit`).
  - Belum memiliki *Command / Quick Search bar* untuk pencarian cepat armada atau booking.
- **Dashboard Shell**:
  - Transisi padding saat sidebar dibuka masih terasa kaku.

### 1.2 Halaman Autentikasi (`/login`)
- Tampilan login masih berbentuk form vertikal standar tanpa visual storytelling produk rental kendaraan.
- Perlu penambahan aksen *ambient glow / spotlight effect* dan *glassmorphic surface* ala Linear/Stripe.
- Demo Switcher masih berupa grid tombol sederhana; dapat disempurnakan menjadi selector kartu interaktif ber-badge (Owner vs Staf) yang lebih intuitif.

### 1.3 Dashboard (`/dashboard`)
- Stat Cards masih menyerupai "4 kotak admin template default": angka besar dengan ikon di pojok kanan.
- Perlu *animated number counters*, indikator persentase pertumbuhan yang lebih terstruktur, dan aksen *card hover depth*.
- Grafik omzet masih memiliki margin dan layout yang kaku; perlu kartu analitik dengan tab filter periode (Minggu/Bulan/Tahun) dan tooltip kursor interaktif yang presisi.
- Quick actions masih berupa tombol teks biasa; perlu dijadikan interactive action tiles dengan ikon dan deskripsi singkat.

### 1.4 Halaman Kendaraan (`/vehicles`, detail, form)
- Kartu armada pada katalog masih sangat sederhana dan kurang menonjolkan foto unit, spesifikasi transmisi/penumpang, serta status kesiapan unit.
- Form tambah armada (`/vehicles/new`) menumpuk seluruh input dalam satu kolom tanpa pembagian *stepper / tabbed card sections*.
- Halaman detail armada (`/vehicles/[id]`) belum memiliki galeri pratinjau yang interaktif dan riwayat servis/pemesanan armada yang rapi.

### 1.5 Modul Operasional (Availability, Bookings, Handover, Returns)
- **Availability**: Kalender masih berbasis grid kaku; perlu pill track horizontal berwarna semantik untuk durasi sewa, maintenance, dan blackout.
- **Bookings**: Tabel pesanan belum memiliki filter status cepat (All, Menunggu Konfirmasi, Diteruskan Mitra, Berjalan, Selesai) dengan *segmented control*.
- **Handover & Returns**: Berita acara serah terima & pengembalian kendaraan di lapangan sangat penting bagi staf operasional. Form inspeksi odometer dan fuel level perlu visual meteran BBM (% interaktif) dan kartu tanda tangan digital yang lebih profesional di mobile/tablet.

### 1.6 Modul Keuangan & Reimbursement (`/finance/*`)
- Halaman pendapatan (`income`) dan pengeluaran (`expenses`) belum memiliki kartu ringkasan margin komisi platform yang informatif.
- Status reimburse perlu indikator badge status yang lebih jelas (*belum dibayar* vs *dibayar*) dan modal pratinjau bukti transfer resmi yang elegan.
- Rekening bank dapat dibuat menyerupai kartu ATM/Bank visual dengan masking nomor rekening untuk keamanan visual.

### 1.7 Modul Tim, Pengaturan, Notifikasi & Bantuan
- Halaman tim (`/team`) memerlukan modal konfigurasi permission yang lebih modern dengan switch toggle per modul.
- Settings memerlukan navigasi sub-menu sticky dua kolom.
- Halaman Help (`/help`) memerlukan accordion FAQ interaktif dan quick contact hotline.

---

## 2. Rencana Eksekusi Perbaikan (Action Plan)

1. **Tokens & Theme Upgrade**: Update `globals.css` dengan CSS custom properties semantik, font tabular, ambient glow, dan border-glow utilities.
2. **Core UI Kit Enhancement**: Sempurnakan `Button`, `Card`, `Badge`, `StatusBadge`, `StatCard`, `DataTable`, `Modal`, `Sheet`, `Tabs`, `Input`, `Select`, `Switch`, `Tooltip`, `Avatar`, dan `NumberTicker`.
3. **Shell Modernization**: Rancang ulang `Sidebar.tsx` (collapsible, live badges, active pill), `Topbar.tsx` (glassmorphic, breadcrumb, quick search, notification drawer), dan `DashboardShell.tsx`.
4. **All-Pages Redesign**: Desain ulang ke-18 halaman secara menyeluruh dengan karakter **Premium Enterprise Fleet Management Dashboard**.
5. **Quality Assurance**: Verifikasi build produksi (`npm run build`) dan TypeScript checking (`npx tsc --noEmit`).
