# Global Motion & Smooth Scroll Implementation — RentalinAja Mitra

Dokumentasi arsitektur dan panduan implementasi motion design, micro-interactions, smooth scrolling (Lenis), dan sistem interaksi modern untuk aplikasi **RentalinAja Mitra**.

---

## 1. Filosofi Desain

> **"Motion should make RentalinAja Mitra feel expensive, not animated for the sake of animation."**

Sebagai aplikasi SaaS operasional B2B, animasi dirancang dengan prinsip:
- **Subtle & Refined**: Menggunakan durasi cepat (150ms–250ms) dan kurva deselerasi eksponensial khas SaaS modern (Linear, Stripe, Raycast).
- **Non-blocking**: Pengguna tidak pernah dipaksa menunggu animasi selesai untuk dapat berinteraksi, mengklik tombol, atau mengetik form.
- **Accessible**: Menghormati pengaturan sistem operasi `prefers-reduced-motion: reduce` secara penuh.
- **High Performance**: Hanya memanfaatkan properti terakselerasi GPU (`opacity` dan `transform`), mencegah layout thrashing dan memory leak.

---

## 2. Struktur Sentralisasi Motion

Seluruh konfigurasi motion dipusatkan dalam direktori berikut agar konsisten dan reusable:

```
src/
├── lib/
│   └── motion/
│       ├── transitions.ts       # Durasi, kurva easing, dan preset transisi
│       └── variants.ts          # Framer Motion variants standar (page, modal, sheet, dropdown, dll.)
├── components/
│   ├── providers/
│   │   ├── motion-provider.tsx  # Provider global MotionConfig (reducedMotion="user")
│   │   └── lenis-provider.tsx   # Provider global Lenis Smooth Scroll + route watcher
│   ├── motion/
│   │   ├── page-transition.tsx  # Wrapper transisi antarhalaman (opacity + 6px Y)
│   │   ├── reveal.tsx           # Komponen Reveal, StaggerContainer, StaggerItem
│   │   └── motion-card.tsx      # Komponen Card dengan micro-interaction interaktif
```

---

## 3. Lenis Smooth Scroll

### Konfigurasi Khusus SaaS
Lenis diimplementasikan di `LenisProvider` (`src/components/providers/lenis-provider.tsx`) dengan konfigurasi yang disesuaikan untuk aplikasi operasional:

```ts
const lenis = new Lenis({
  duration: 0.85, // Snappy dan natural, tidak terasa berat atau licin
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  syncTouch: false, // Menjaga scrolling sentuh bawaan tetap asli di mobile/tablet
  autoRaf: false,  // Siklus requestAnimationFrame dikontrol manual dengan cleanup teratur
});
```

### Isolasi Scrolling Mandiri (`[data-lenis-prevent]`)
Agar Lenis tidak mengganggu elemen yang membutuhkan scrolling horizontal atau kontainer bersarang, atribut `data-lenis-prevent` dipasang pada:
- **Tabel Data**: `<div className="overflow-x-auto" data-lenis-prevent>` pada semua tabel (Armada, Booking, Pelanggan, Keuangan, Maintenance).
- **Modal Dialog**: Kontainer konten modal di `Modal.tsx`.
- **Drawer / Sheet**: Kontainer isi drawer di `Sheet.tsx`.
- **Dropdown Menu & Popover**: Daftar opsi pada `Select.tsx`, popover kalender pada `DatePicker.tsx`, daftar notifikasi & tenant switcher pada `Topbar.tsx`.
- **Sidebar Navigasi**: Kontainer navigasi di `Sidebar.tsx`.
- **Tab Filter**: Tab navigasi horizontal pada `Tabs.tsx`.

### Scroll Restoration & Route Navigation
Ketika pengguna berpindah rute (halaman) di Next.js App Router, `LenisProvider` mendengarkan perubahan `pathname` dan mengeksekusi `lenis.scrollTo(0, { immediate: true })`, sehingga halaman baru selalu dimulai dari posisi teratas tanpa efek flickering.

---

## 4. Page Transitions

Setiap perpindahan halaman diatur oleh komponen `PageTransition` (`src/components/motion/page-transition.tsx`) yang terintegrasi di `DashboardShell.tsx` dan `login/page.tsx`:
- **Entrance**: `opacity: 0 -> 1`, `y: 6px -> 0px`.
- **Durasi**: `0.22s` dengan kurva `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Exit**: Cepat `0.15s` tanpa blocking interaksi kursor.
- **Zero Layout Shift**: Tidak mengubah dimensi grid atau flex layout induk.

---

## 5. Staggered Content Reveal

Untuk KPI Metric cards, statistik ringkasan, dan grid armada:
- **Komponen**: `<StaggerContainer>` dan `<StaggerItem>`.
- **Stagger Delay**: `40ms` antar elemen dengan entrance `opacity: 0 -> 1` dan `y: 8px -> 0px`.
- **Penerapan**:
  - Dashboard KPI Operasional (Armada Siap Pakai, Sewa Aktif, Menunggu Serah Terima, Bengkel).
  - Dashboard Keuangan Bruto & Pengeluaran.
  - Halaman Manajemen Armada (`/vehicles`) mode Grid.

---

## 6. Micro-Interactions Komponen UI

1. **Button (`Button.tsx`)**:
   - Dilengkapi tactile press feedback `active:scale-[0.98]` dan `transition-all duration-150`.
   - Disabled states dinonaktifkan dari animasi press (`disabled:active:scale-100`).
2. **StatCard (`StatCard.tsx`)**:
   - Hover elevation halus `hover:-translate-y-0.5 hover:shadow-sm hover:border-slate-300 transition-all duration-200`.
3. **Modal Dialog (`Modal.tsx`)**:
   - `AnimatePresence` dengan backdrop fade dan modal scale `0.97 -> 1` + `y: 8px -> 0px`.
4. **Sheet / Drawer (`Sheet.tsx`)**:
   - Sliding panel halus dari kanan atau kiri (`x: 100% -> 0` / `x: -100% -> 0`).
5. **Select & DatePicker (`Select.tsx`, `DatePicker.tsx`)**:
   - Popover dropdown menu muncul dengan scale `0.98 -> 1`, `y: -4px -> 0px`, dan opacity fade yang responsif.
6. **Tooltip (`Tooltip.tsx`)**:
   - Floating tooltip dengan entrance halus via `tooltipVariants`.
7. **NumberTicker (`NumberTicker.tsx`)**:
   - Menghormati prefers-reduced-motion; jika data berubah, melakukan transisi angka dari nilai sebelumnya ke nilai baru dengan easing kubik.

---

## 7. Aksesibilitas & Prefers-Reduced-Motion

Sistem ini mendukung aksesibilitas pengguna secara menyeluruh:
1. **MotionConfig**:
   ```tsx
   <MotionConfig reducedMotion="user">
   ```
   Secara otomatis mematikan atau menyederhanakan animasi transform ketika pengguna mengaktifkan preferensi "Reduce Motion" di Windows, macOS, atau browser.
2. **Lenis Smooth Scroll Bypass**:
   Ketika `window.matchMedia('(prefers-reduced-motion: reduce)').matches` bernilai true, inisialisasi Lenis dilewati dan browser menggunakan native instant scrolling.
3. **Global CSS Media Query (`globals.css`)**:
   ```css
   @media (prefers-reduced-motion: reduce) {
     html.lenis, html.lenis body {
       scroll-behavior: auto !important;
     }
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

---

## 8. Verifikasi Kualitas & Build

Sistem telah diuji dan divalidasi dengan:
- **TypeScript**: 0 error.
- **Production Build (`npm run build`)**: 24/24 static & dynamic route terkompilasi 100% sukses.
- **Performance**: Zero duplicate instances, zero memory leaks, dan event listener dibersihkan secara bersih saat unmount.
