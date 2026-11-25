# API CONTRACT — RENTALINAJA MITRA PORTAL
**Portal Manajemen Operasional Mitra Multi-Tenant**  
Versi: `v1.0.0`  
Standard Response Format: JSend / RESTful JSON  
Base Path: `/api/v1`

---

## 1. Konvensi Global

### 1.1 Header Wajib
Semua request yang membutuhkan autentikasi harus menyertakan header:
```http
Authorization: Bearer <session_or_jwt_token>
X-Partner-Id: <mitra_id>
Content-Type: application/json
```

### 1.2 Format Response Sukses
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil"
}
```

### 1.3 Format Response Paginasi
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 1.4 Format Response Error
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED | FORBIDDEN | NOT_FOUND | VALIDATION_ERROR | CONFLICT",
    "message": "Pesan deskripsi kesalahan dalam Bahasa Indonesia"
  }
}
```

---

## 2. Modul Autentikasi & Akun (`/auth`)

### 2.1 Login Staf / Pemilik Mitra
- **Endpoint**: `POST /auth/login`
- **Akses**: Public
- **Request Body**:
```json
{
  "email": "owner@nusantararent.com",
  "password": "password123"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "token": "mock-jwt-token-xyz",
    "user": {
      "id": "usr-01",
      "mitraId": "mitra-01",
      "name": "Bambang Sudarmono",
      "email": "owner@nusantararent.com",
      "role": "MITRA_OWNER",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120",
      "partnerName": "Nusantara Rent Yogyakarta",
      "partnerCity": "Yogyakarta",
      "partnerLogo": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120",
      "permissions": [
        "view_dashboard", "manage_vehicles", "manage_availability",
        "manage_orders", "process_handover", "process_return",
        "manage_maintenance", "view_financials", "manage_expenses",
        "manage_bank_accounts", "manage_team", "manage_business_profile"
      ]
    }
  }
}
```

### 2.2 Sesi Aktif
- **Endpoint**: `GET /auth/me`
- **Akses**: Terautentikasi (Owner / Staff)
- **Response `200 OK`**: Menghasilkan profil pengguna aktif sesuai data token.

### 2.3 Logout
- **Endpoint**: `POST /auth/logout`
- **Akses**: Terautentikasi

---

## 3. Modul Dashboard (`/dashboard`)

### 3.1 Ringkasan Metrik Bisnis
- **Endpoint**: `GET /dashboard/metrics`
- **Akses**: Owner & Staff (Field pendapatan disensor untuk Staff jika tidak memiliki permission `view_financials`)
- **Query Params**: `period=month | week | year`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalArmada": 12,
    "armadaAktif": 9,
    "armadaDisewa": 4,
    "armadaMaintenance": 2,
    "bookingAktif": 5,
    "serahTerimaHariIni": 2,
    "pengembalianHariIni": 1,
    "pendapatanBulanIni": 18450000,
    "pengeluaranBulanIni": 3200000,
    "pendapatanBersihBulanIni": 15250000,
    "reimbursePending": 4850000,
    "utilizationRate": 68.5,
    "pertumbuhanPendapatan": 12.4
  }
}
```

---

## 4. Modul Kendaraan (`/vehicles`)

### 4.1 Daftar Kendaraan Mitra
- **Endpoint**: `GET /vehicles`
- **Query Params**: `category=all|mobil|motor`, `status=all|aktif|disewa|maintenance|nonaktif`, `search=string`, `page=1`, `limit=10`
- **Response `200 OK`**: Paginasi daftar kendaraan milik mitra aktif.

### 4.2 Tambah Kendaraan Baru
- **Endpoint**: `POST /vehicles`
- **Akses**: Mitra Owner & Staff dengan permission `manage_vehicles`
- **Request Body**:
```json
{
  "name": "Toyota Innova Zenix 2.0 V CVT",
  "category": "mobil",
  "type": "MPV",
  "transmission": "matic",
  "seats": 7,
  "luggage": 4,
  "fuel": "Bensin (Pertalite/Pertamax)",
  "year": 2023,
  "plateNumber": "AB 1234 XY",
  "pricePerDay": 700000,
  "images": ["https://images.unsplash.com/..."],
  "features": ["AC Digital Double Blower", "Wireless Charger", "Apple CarPlay"],
  "rules": ["Bebas asap rokok", "Wajib BBM terisi sama"],
  "securityDeposit": 500000,
  "location": "Sleman, Yogyakarta"
}
```

### 4.3 Update Status Kendaraan
- **Endpoint**: `PATCH /vehicles/:id/status`
- **Request Body**:
```json
{
  "status": "maintenance",
  "reason": "Servis berkala 10.000 KM"
}
```

---

## 5. Modul Ketersediaan Armada (`/availability`)

### 5.1 Kalender Jadwal Booking & Blokir
- **Endpoint**: `GET /availability/calendar`
- **Query Params**: `month=2026-11`, `vehicleId=all|string`
- **Response `200 OK`**: Daftar rentang tanggal tersewa, maintenance, dan blokir manual untuk setiap armada.

### 5.2 Blokir Tanggal Manual (Blackout)
- **Endpoint**: `POST /availability/block`
- **Request Body**:
```json
{
  "vehicleId": "v-01",
  "startDate": "2026-11-25",
  "endDate": "2026-11-27",
  "reason": "Dipakai keperluan internal manajemen mitra"
}
```

---

## 6. Modul Penyewaan & Pesanan (`/bookings`)

### 6.1 Daftar Pesanan Sewa
- **Endpoint**: `GET /bookings`
- **Query Params**: `status=all|menunggu_konfirmasi|terkonfirmasi|diteruskan_mitra|berjalan|selesai|dibatalkan`, `readiness=all|pending|ready|issue_reported`, `search=string`, `page=1`, `limit=10`

### 6.2 Konfirmasi Kesiapan Armada
- **Endpoint**: `PATCH /bookings/:id/readiness`
- **Request Body**:
```json
{
  "readiness": "ready",
  "notes": "Unit sudah dicuci, BBM penuh, wangi, kunci siap di meja operasional."
}
```

---

## 7. Modul Serah Terima (`/handover`)

### 7.1 Submit Berita Acara Serah Terima
- **Endpoint**: `POST /handover/:bookingId/submit`
- **Request Body**:
```json
{
  "handoverDate": "2026-11-20T09:00:00Z",
  "odometer": 42150,
  "fuelLevel": 100,
  "cleanliness": "sangat_bersih",
  "checklist": {
    "stnk": true,
    "kunciCadangan": false,
    "dongkrak": true,
    "banSerep": true,
    "p3k": true,
    "segitigaPengaman": true
  },
  "existingDamages": [
    { "area": "Bumper depan kiri", "description": "Baret halus 4cm", "photo": "url" }
  ],
  "customerSignature": "data:image/svg+xml;base64,...",
  "officerName": "Dedi Kurniawan",
  "notes": "Penyewa diinfokan batas waktu pengembalian 22 Nov pk 09:00 WIB"
}
```

---

## 8. Modul Pengembalian Kendaraan (`/returns`)

### 8.1 Submit Berita Acara Pengembalian
- **Endpoint**: `POST /returns/:bookingId/submit`
- **Request Body**:
```json
{
  "returnDate": "2026-11-22T09:30:00Z",
  "returnOdometer": 42680,
  "returnFuelLevel": 75,
  "cleanliness": "cukup_bersih",
  "lateHours": 0,
  "lateFee": 0,
  "fuelFee": 75000,
  "damageFee": 0,
  "totalFine": 75000,
  "notes": "BBM berkurang 1/4 bar, dikenakan penggantian BBM Rp 75.000."
}
```

---

## 9. Modul Maintenance (`/maintenance`)

### 9.1 Jadwalkan Servis / Perbaikan
- **Endpoint**: `POST /maintenance/schedule`
- **Request Body**:
```json
{
  "vehicleId": "v-01",
  "serviceType": "berkala",
  "title": "Ganti Oli Mesin & Filter 40.000 KM",
  "workshopName": "Bengkel Resmi Nasmoco Mlati",
  "scheduledDate": "2026-11-25",
  "estimatedCost": 1250000,
  "description": "Penggantian oli TMO 0W-20, filter oli, balancing 4 roda"
}
```

---

## 10. Modul Keuangan (`/finance`)

### 10.1 Rekap Pendapatan Bersih
- **Endpoint**: `GET /finance/income`
- **Catatan Formula**:
  - `Harga Sewa Kotor` = Tarif x Durasi Hari
  - `Komisi Platform` = 10% x Tarif Dasar
  - `Pendapatan Bersih Mitra` = Tarif Dasar - Komisi Platform + Denda Pengembalian (jika ada)

### 10.2 Pencatatan Pengeluaran Operasional
- **Endpoint**: `POST /finance/expenses`
- **Akses**: `MITRA_OWNER` atau Staf dengan permission `manage_expenses`
- **Request Body**:
```json
{
  "category": "bahan_bakar | cuci_mobil | servis | suku_cadang | gaji_driver | operasional_kantor | lain_lain",
  "vehicleId": "v-01",
  "amount": 250000,
  "date": "2026-11-19",
  "description": "Pengisian pertamax unit sebelum sewa",
  "receiptPhoto": "url"
}
```

### 10.3 Rekap Reimbursement dari Platform
- **Endpoint**: `GET /finance/reimbursements`
- **Aturan Hak Akses**:
  - Mitra **HANYA DAPAT MEMBACA** status reimburse (`belum_dibayar` / `dibayar`).
  - Mitra **TIDAK DAPAT** mengubah status menjadi dibayar ataupun mengunggah bukti transfer (Hanya hak Super Admin platform).
  - Mitra dapat mengunduh bukti transfer yang diunggah Super Admin saat status `dibayar`.

---

## 11. Modul Rekening Bank (`/bank-accounts`)

### 11.1 Tambah Rekening Penerimaan Reimburse
- **Endpoint**: `POST /bank-accounts`
- **Akses**: Khusus `MITRA_OWNER`
- **Request Body**:
```json
{
  "bankName": "Bank Central Asia (BCA)",
  "accountNumber": "8465293810",
  "accountHolder": "PT Nusantara Rent Kencana",
  "branch": "KCU Yogyakarta Sudirman",
  "isPrimary": true
}
```
