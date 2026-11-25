import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import {
  MaintenanceRecord,
  CreateMaintenanceInput,
  PaginatedResponse,
  ApiResponse,
} from '@/types';
import { paginateList } from '@/mocks/query';

export const maintenanceApi = {
  /**
   * Mengambil riwayat servis dan pemeliharaan armada
   */
  async getMaintenanceRecords(
    partnerId: string,
    filters?: {
      search?: string;
      status?: string;
      vehicleId?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<MaintenanceRecord>>> {
    await simulateDelay();

    let items = mockStore.getMaintenance(partnerId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (m) =>
          m.vehicleName.toLowerCase().includes(q) ||
          m.platNomor.toLowerCase().includes(q) ||
          m.jenisPerawatan.toLowerCase().includes(q) ||
          m.namaBengkel.toLowerCase().includes(q)
      );
    }

    if (filters?.status && filters.status !== 'semua') {
      items = items.filter((m) => m.status === filters.status);
    }

    if (filters?.vehicleId && filters.vehicleId !== 'semua') {
      items = items.filter((m) => m.vehicleId === filters.vehicleId);
    }

    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const paginated = paginateList(items, page, limit);

    return {
      success: true,
      data: paginated,
      message: 'Berhasil memuat daftar riwayat pemeliharaan',
    };
  },

  /**
   * Mengambil detail servis berdasarkan ID
   */
  async getMaintenanceById(
    partnerId: string,
    id: string
  ): Promise<ApiResponse<MaintenanceRecord>> {
    await simulateDelay();

    const record = mockStore.getMaintenanceById(partnerId, id);
    if (!record) {
      return {
        success: false,
        error: {
          code: 'MAINTENANCE_NOT_FOUND',
          message: 'Data perawatan tidak ditemukan',
        },
      };
    }

    return {
      success: true,
      data: record,
      message: 'Berhasil memuat detail perawatan',
    };
  },

  /**
   * Mencatat jadwal servis baru (otomatis memblokir kalender & mencatat pengeluaran)
   */
  async createMaintenance(
    partnerId: string,
    input: CreateMaintenanceInput
  ): Promise<ApiResponse<MaintenanceRecord>> {
    await simulateDelay(600);

    try {
      const created = mockStore.createMaintenance(partnerId, input);
      return {
        success: true,
        data: created,
        message: 'Jadwal servis berhasil dicatat, jadwal armada diblokir dan pengeluaran berhasil dibukukan!',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'CREATE_MAINTENANCE_FAILED',
          message: err.message || 'Gagal mencatat servis kendaraan',
        },
      };
    }
  },

  /**
   * Memperbarui status servis (misal: selesai)
   */
  async updateStatus(
    partnerId: string,
    id: string,
    status: MaintenanceRecord['status']
  ): Promise<ApiResponse<MaintenanceRecord>> {
    await simulateDelay(500);

    try {
      const updated = mockStore.updateMaintenanceStatus(partnerId, id, status);
      return {
        success: true,
        data: updated,
        message: `Status pemeliharaan diperbarui menjadi ${status.replace('_', ' ').toUpperCase()}`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'UPDATE_STATUS_FAILED',
          message: err.message || 'Gagal memperbarui status perawatan',
        },
      };
    }
  },
};
