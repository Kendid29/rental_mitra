import { USE_MOCK, request } from '../client';
import { mockStore } from '@/mocks/store';
import { simulatedDelay } from '@/mocks/delay';
import { paginate, sortItems } from '@/mocks/query';
import {
  Vehicle,
  CreateVehicleInput,
  PaginatedResponse,
  ApiResponse,
  VehicleFilters,
} from '@/types';

export const vehiclesApi = {
  async getVehicles(
    partnerId: string,
    filters?: VehicleFilters
  ): Promise<ApiResponse<PaginatedResponse<Vehicle>>> {
    if (USE_MOCK) {
      await simulatedDelay(200, 350);
      let vehicles = mockStore.getVehicles(partnerId);

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        vehicles = vehicles.filter(
          (v) =>
            v.nama.toLowerCase().includes(query) ||
            v.platNomor.toLowerCase().includes(query) ||
            (v.brand && v.brand.toLowerCase().includes(query)) ||
            (v.merek && v.merek.toLowerCase().includes(query)) ||
            v.kategori.toLowerCase().includes(query)
        );
      }

      if (filters?.tipe && filters.tipe !== 'semua') {
        vehicles = vehicles.filter(
          (v) => (v.tipe || v.jenis) === filters.tipe
        );
      }

      if (filters?.status && filters.status !== 'semua') {
        vehicles = vehicles.filter((v) => v.status === filters.status);
      }

      vehicles = sortItems(vehicles, 'createdAt', 'desc');
      const paginated = paginate(vehicles, filters?.page || 1, filters?.limit || 20);

      return {
        success: true,
        data: paginated,
        message: 'Berhasil memuat daftar kendaraan',
      };
    }

    return request<any>(`/vehicles?partnerId=${partnerId}`);
  },

  async list(filters?: any, partnerId?: string) {
    const pId = partnerId || mockStore.getCurrentPartner().id;
    const res = await this.getVehicles(pId, filters);
    return res.data || { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
  },

  async getVehicleById(
    partnerId: string,
    vehicleId: string
  ): Promise<ApiResponse<Vehicle>> {
    if (USE_MOCK) {
      await simulatedDelay(150, 250);
      const vehicle = mockStore.getVehicleById(partnerId, vehicleId);
      if (!vehicle) {
        return {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Kendaraan tidak ditemukan' },
        };
      }
      return {
        success: true,
        data: vehicle,
        message: 'Detail kendaraan ditemukan',
      };
    }
    return request<any>(`/vehicles/${vehicleId}`);
  },

  async getById(id: string, partnerId?: string) {
    const pId = partnerId || mockStore.getCurrentPartner().id;
    const res = await this.getVehicleById(pId, id);
    if (!res.success || !res.data) throw new Error('Kendaraan tidak ditemukan');
    return res.data;
  },

  async createVehicle(
    partnerId: string,
    input: CreateVehicleInput
  ): Promise<ApiResponse<Vehicle>> {
    if (USE_MOCK) {
      await simulatedDelay(300, 500);
      try {
        const vehicle = mockStore.createVehicle(partnerId, input);
        return {
          success: true,
          data: vehicle,
          message: 'Kendaraan berhasil ditambahkan',
        };
      } catch (err: any) {
        return {
          success: false,
          error: { code: 'CREATE_FAILED', message: err.message },
        };
      }
    }
    return request<any>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async create(data: CreateVehicleInput, partnerId?: string) {
    const pId = partnerId || mockStore.getCurrentPartner().id;
    const res = await this.createVehicle(pId, data);
    if (!res.success || !res.data) throw new Error(res.error?.message || 'Gagal membuat kendaraan');
    return res.data;
  },

  async updateVehicle(
    partnerId: string,
    vehicleId: string,
    updates: Partial<Vehicle>
  ): Promise<ApiResponse<Vehicle>> {
    if (USE_MOCK) {
      await simulatedDelay(250, 400);
      try {
        const updated = mockStore.updateVehicle(partnerId, vehicleId, updates);
        return {
          success: true,
          data: updated,
          message: 'Kendaraan berhasil diperbarui',
        };
      } catch (err: any) {
        return {
          success: false,
          error: { code: 'UPDATE_FAILED', message: err.message },
        };
      }
    }
    return request<any>(`/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async update(id: string, data: Partial<Vehicle>, partnerId?: string) {
    const pId = partnerId || mockStore.getCurrentPartner().id;
    const res = await this.updateVehicle(pId, id, data);
    if (!res.success || !res.data) throw new Error(res.error?.message || 'Gagal memperbarui kendaraan');
    return res.data;
  },

  async deleteVehicle(
    partnerId: string,
    vehicleId: string
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    if (USE_MOCK) {
      await simulatedDelay(200, 350);
      try {
        mockStore.deleteVehicle(partnerId, vehicleId);
        return {
          success: true,
          data: { deleted: true },
          message: 'Kendaraan berhasil dihapus',
        };
      } catch (err: any) {
        return {
          success: false,
          error: { code: 'DELETE_FAILED', message: err.message },
        };
      }
    }
    return request<any>(`/vehicles/${vehicleId}`, { method: 'DELETE' });
  },

  async delete(id: string, partnerId?: string) {
    const pId = partnerId || mockStore.getCurrentPartner().id;
    const res = await this.deleteVehicle(pId, id);
    if (!res.success) throw new Error(res.error?.message || 'Gagal menghapus kendaraan');
    return { success: true };
  },
};
