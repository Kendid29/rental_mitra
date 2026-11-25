# DESIGN SYSTEM SPECIFICATION — RENTALINAJA MITRA PORTAL
**Theme: Premium Enterprise Fleet Management Dashboard**  
Versi: 2.0  
Fokus: High-Fidelity UI, Micro-interactions, & Multi-tenant Consistency

---

## 1. Design Tokens & Color Palette

### 1.1 Brand Palette
| Token Semantik | Hex Code | Penggunaan Utama |
|---|---|---|
| **Primary Navy** | `#102447` | Sidebar background, headings, brand accent, modal headers |
| **Action Blue** | `#0866F5` | Primary buttons, active nav pills, key link states, focus rings |
| **Action Blue Hover** | `#0756D1` | Button hover & active states |
| **Emerald Green** | `#00C48C` | Kesiapan armada (`ready`), profit bersih, transaksi sukses |
| **Warning Amber** | `#FFB800` | Unit sedang disewa, pesanan pending, verifikasi |
| **Urgency / Danger** | `#FF4D4D` | Kendala unit, kerusakan fisik, denda, status batal |
| **Canvas** | `#F8FAFC` | Latar belakang utama aplikasi |
| **Surface / Card** | `#FFFFFF` | Latar kartu dashboard, panel modal, dropdown |
| **Subtle Border** | `#E2E8F0` | Garis batas kartu, pemisah tabel, input fields |
| **Text Primary** | `#191C1E` | Heading dan isi teks utama |
| **Text Muted** | `#64748B` | Subtitle, label sekunder, status bantuan |

### 1.2 Elevation Shadows
- **Level 1 (Card default)**: `0 1px 3px 0 rgba(16, 36, 71, 0.04), 0 1px 2px -1px rgba(16, 36, 71, 0.02)`
- **Level 2 (Hover state)**: `0 10px 25px -5px rgba(16, 36, 71, 0.07), 0 8px 10px -6px rgba(16, 36, 71, 0.03)`
- **Level 3 (Modal & Sheet)**: `0 25px 50px -12px rgba(16, 36, 71, 0.25)`

---

## 2. Tipografi (Typography Hierarchy)

- **Headlines & Page Titles**: Font **Outfit** (`font-heading`, font-weight: 700 / 800, tracking: `-0.02em`).
- **Body & Data Table**: Font **Hanken Grotesk** (`font-body`, font-weight: 400 / 500 / 600).
- **Financial & Numerical Data**: Tabular Numerals (`tabular-nums font-body`) untuk memastikan perataan angka nominal Rupiah dan persentase utilisasi armada.

---

## 3. Komponen UI Primitives

1. **Button (`src/components/ui/Button.tsx`)**:
   - Variants: `primary`, `secondary`, `outline`, `danger`, `ghost`, `success`, `soft`, `soft-blue`, `soft-emerald`, `soft-danger`, `soft-warning`.
   - Sizes: `xs`, `sm`, `md`, `lg`, `icon`, `icon-sm`.
   - Micro-interaction: Active scaling `active:scale-[0.98]` dan loader spinner.
2. **StatusBadge (`src/components/ui/StatusBadge.tsx`)**:
   - Semantic badge dengan indicator dot berdenyut (`animate-ping`) untuk status live seperti sewa berjalan atau unit disewa.
3. **StatCard (`src/components/ui/StatCard.tsx`)**:
   - Desain enterprise dengan accent border gradient, icon container hover scaling, dan trend pill (+12.4% vs bulan lalu).
4. **NumberTicker (`src/components/ui/NumberTicker.tsx`)**:
   - Animasi count-up halus menggunakan `requestAnimationFrame` dengan easing *ease-out-cubic*.
5. **DataTable (`src/components/ui/DataTable.tsx`)**:
   - Header kontras dengan border presisi, hover row highlight, opsi row click callback, dan pagination bar lengkap.
6. **Modal & Sheet (`src/components/ui/Modal.tsx`, `Sheet.tsx`)**:
   - Backdrop blur tingkat tinggi (`backdrop-blur-md`), keyboard accessibility (ESC trigger), dan responsive drawer sliding.

---

## 4. Layout Shell (Linear & Stripe Inspired)

- **Sidebar**:
  - Background: `#102447` dengan subtle border `#1b3b72`.
  - Item Navigasi: Active indicator pill `#0866F5` dengan text putih dan chevron highlight.
  - Section Headings: Uppercase tracking-wider dengan warna `#94A3B8`.
- **Topbar**:
  - Glassmorphic surface: `backdrop-blur-md bg-white/90 border-b border-slate-200/80`.
  - Breadcrumb dinamis dan selector mitra aktif dengan status terverifikasi.
  - Notification popover dengan unread dot indicator.
