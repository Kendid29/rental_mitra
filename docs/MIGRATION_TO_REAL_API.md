# PANDUAN MIGRASI KE BACKEND REAL API (PRODUCTION)
**RentalinAja Mitra Portal — Architecture Decoupling & API Integration Guide**

---

## 1. Arsitektur Lapisan Data Saat Ini

Aplikasi `rental_mitra` dirancang dengan arsitektur **Single Entry-Point Repository Pattern**:
- Komponen UI tidak pernah memanggil `localStorage` atau mock store secara langsung.
- Seluruh pengambilan dan pengubahan data melewati satu pintu tunggal:  
  `src/api/index.ts` -> `src/api/endpoints/*.ts`.
- Mock store saat ini mengimplementasikan antarmuka asynchronous `Promise<ApiResponse<T>>`, yang secara struktural identik dengan pemanggilan HTTP client (seperti `fetch` atau `axios`).

```
[ Komponen UI / Halaman ]
           │
           ▼
[ src/api/index.ts ]
           │
     ┌─────┴────────────────┐
     ▼                      ▼
Saat ini (Mock Engine)    Nantinya (Real API Client)
src/mocks/store.ts        fetch(process.env.NEXT_PUBLIC_API_URL + ...)
```

---

## 2. Langkah-Langkah Migrasi ke Backend Nyata

### Langkah 1: Siapkan Konfigurasi Lingkungan (`.env.local`)
Tambahkan variabel lingkungan untuk URL backend API Gateway:
```env
NEXT_PUBLIC_API_URL=https://api.rentalinaja.com/v1
NEXT_PUBLIC_API_TIMEOUT=15000
```

### Langkah 2: Buat HTTP Client Terpusat (`src/lib/httpClient.ts`)
Gantikan delegasi ke `mockStore` dengan klien HTTP berbasis native `fetch`:
```typescript
// src/lib/httpClient.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function httpClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: { code: string; message: string } }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const partnerId = typeof window !== 'undefined' ? localStorage.getItem('partnerId') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(partnerId ? { 'X-Partner-Id': partnerId } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: json.error || { code: 'HTTP_ERROR', message: `Server error: ${response.statusText}` },
      };
    }

    return json;
  } catch (err: any) {
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: err.message || 'Gagal terhubung ke server.' },
    };
  }
}
```

### Langkah 3: Ubah Endpoint Wrapper (`src/api/endpoints/*.ts`)
Ubah implementasi di dalam setiap file endpoint tanpa mengubah tanda tangan fungsinya (`signature`), sehingga tidak ada satu baris kode pun di halaman UI yang perlu diubah.

Contoh `src/api/endpoints/vehicles.ts`:
```typescript
// Sebelum migrasi (Mock):
export async function getVehicles(partnerId: string, params: VehicleQueryParams) {
  return mockStore.getVehicles(partnerId, params);
}

// Sesudah migrasi (Real API):
import { httpClient } from '@/lib/httpClient';

export async function getVehicles(partnerId: string, params: VehicleQueryParams) {
  const query = new URLSearchParams(params as any).toString();
  return httpClient<VehicleListResponse>(`/partners/${partnerId}/vehicles?${query}`);
}
```

---

## 3. Kompatibilitas Data Model Backend

Pastikan backend (PostgreSQL/NestJS/Go/Laravel) mengikuti skema yang didefinisikan dalam [DATA_MODEL.md](./DATA_MODEL.md) dan kontrak HTTP dalam [API_CONTRACT.md](./API_CONTRACT.md).
Khususnya:
1. Header `X-Partner-Id` wajib divalidasi oleh JWT middleware backend untuk mencegah cross-tenant data leakage.
2. Status booking `diteruskan_mitra` disesuaikan dengan transisi state mesin transaksi pusat.
3. Hak mutasi status reimburse dan upload bukti transfer **HARUS DITOLAK (403 Forbidden)** jika diakses oleh token pengguna portal mitra.
