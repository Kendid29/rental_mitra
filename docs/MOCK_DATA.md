# DOKUMENTASI DATA MOCK — RENTALINAJA MITRA PORTAL
**Simulasi Multi-Mitra dan Kredensial Pengujian**

---

## 1. Profil 3 Mitra Rental Terdaftar

Sistem disimulasikan dengan 3 profil mitra terverifikasi yang merepresentasikan ragam kota dan skala armada:

### 1.1 Mitra A: Nusantara Rent Yogyakarta
- **ID Mitra**: `mitra-01`
- **Lokasi**: Sleman, D.I. Yogyakarta
- **Spesialisasi**: Rental Mobil Keluarga & Wisata (MPV, SUV)
- **Armada**: 8 unit (Innova Zenix, Avanza 1.5 G, Honda HR-V SE, Mitsubishi Xpander, Fortuner GR Sport, Alphard Transformer, Brio RS, Calya G)
- **Akun Uji Coba**:
  - **Owner**: `owner@nusantararent.com` / `password123` (Nama: Bambang Sudarmono)
  - **Staff Operasional**: `staff@nusantararent.com` / `password123` (Nama: Dedi Kurniawan)

### 1.2 Mitra B: Maju Jaya Rent Bandung
- **ID Mitra**: `mitra-02`
- **Lokasi**: Dago, Bandung, Jawa Barat
- **Spesialisasi**: City Car, Hatchback & Commuter
- **Armada**: 6 unit (Honda Brio RS, Toyota Raize 1.0 Turbo, Daihatsu Rocky, Suzuki Ertiga Hybrid, HiAce Premio, Toyota Yaris Cross)
- **Akun Uji Coba**:
  - **Owner**: `owner@majujayarent.com` / `password123` (Nama: Hendra Gunawan)
  - **Staff Operasional**: `staff@majujayarent.com` / `password123` (Nama: Siti Rahmawati)

### 1.3 Mitra C: Sahabat Motor Denpasar
- **ID Mitra**: `mitra-03`
- **Lokasi**: Kuta, Denpasar, Bali
- **Spesialisasi**: Rental Motor Skuter Matic & Touring
- **Armada**: 8 unit (Yamaha NMAX 155, Honda PCX 160, Honda Vario 160, Vespa Primavera 150, Honda Scoopy Prestige, Yamaha Aerox 155, Kawasaki KLX 150, Honda Beat ESP)
- **Akun Uji Coba**:
  - **Owner**: `owner@sahabatmotor.com` / `password123` (Nama: I Wayan Sudirta)
  - **Staff Operasional**: `staff@sahabatmotor.com` / `password123` (Nama: Ketut Darmawan)

---

## 2. Penyimpanan State Mock (Stateful Browser Storage)

1. **Storage Mechanism**:
   Data mock disimpan di dalam `localStorage` browser dengan key ber-namespace:
   - `rentalinaja_mitra_mock_store_v1`: Menyimpan seluruh data partner, kendaraan, booking, handover, return, pengeluaran, reimburse, rekening bank, tim staf, notifikasi, dan profil bisnis.
   - `rentalinaja_mitra_auth_v1`: Menyimpan sesi aktif (user profile, token, permissions).
2. **SSR Safe**:
   Engine mock (`src/mocks/storage.ts`) memiliki detektor `typeof window !== 'undefined'` sehingga proses Static Site Generation (SSG) dan Server-Side Rendering (SSR) Next.js berjalan tanpa error hidrasi.
3. **Simulasi Latensi Jaringan**:
   Setiap fungsi mock API menyertakan simulasi delay realistis (150ms – 400ms) untuk menguji responsivitas skeleton loading, toast interaksi, dan tombol loading state.
4. **Fitur Reset Data**:
   Disediakan tombol **Reset Database Mock** di menu pengaturan profil untuk mengembalikan state awal jika penguji ingin memulai pengujian dari kondisi seed awal.
