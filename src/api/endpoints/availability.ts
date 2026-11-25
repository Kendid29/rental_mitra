import { USE_MOCK, request } from '../client';
import { mockStore } from '@/mocks/store';
import { simulatedDelay } from '@/mocks/delay';
import { AvailabilityBlock, ApiResponse, VehicleAvailabilitySchedule } from '@/types';

export const availabilityApi = {
  async getSchedule(
    partnerId?: string,
    vehicleId?: string
  ): Promise<ApiResponse<AvailabilityBlock[]>> {
    if (USE_MOCK) {
      await simulatedDelay(200, 350);
      const activePartnerId = partnerId || mockStore.getCurrentPartner().id;
      const blocks = mockStore.getAvailabilityBlocks(activePartnerId, vehicleId);
      return {
        success: true,
        data: blocks,
        message: 'Berhasil memuat jadwal ketersediaan',
      };
    }
    return request<any>(`/availability${vehicleId ? `?vehicleId=${vehicleId}` : ''}`);
  },

  async addManualBlock(
    partnerIdOrVehicleId: string,
    inputOrStartDate:
      | { vehicleId: string; startDate: string; endDate: string; notes?: string }
      | string,
    endDateParam?: string,
    notesParam?: string,
    partnerIdParam?: string
  ): Promise<ApiResponse<AvailabilityBlock>> {
    if (USE_MOCK) {
      await simulatedDelay(300, 500);
      try {
        let pId: string;
        let vId: string;
        let sDate: string;
        let eDate: string;
        let notesText: string | undefined;

        if (typeof inputOrStartDate === 'object') {
          pId = partnerIdOrVehicleId;
          vId = inputOrStartDate.vehicleId;
          sDate = inputOrStartDate.startDate;
          eDate = inputOrStartDate.endDate;
          notesText = inputOrStartDate.notes;
        } else {
          vId = partnerIdOrVehicleId;
          sDate = inputOrStartDate;
          eDate = endDateParam || '';
          notesText = notesParam;
          pId = partnerIdParam || mockStore.getCurrentPartner().id;
        }

        const block = mockStore.addManualBlock(pId, vId, sDate, eDate, notesText);
        return {
          success: true,
          data: block,
          message: 'Jadwal berhasil diblokir manual',
        };
      } catch (err: any) {
        return {
          success: false,
          error: { code: 'BLOCK_FAILED', message: err.message },
        };
      }
    }
    return request<any>('/availability/block', {
      method: 'POST',
      body: JSON.stringify({ partnerIdOrVehicleId, inputOrStartDate }),
    });
  },

  async removeBlock(
    partnerIdOrBlockId: string,
    blockIdParam?: string
  ): Promise<ApiResponse<{ removed: boolean }>> {
    if (USE_MOCK) {
      await simulatedDelay(200, 400);
      try {
        const pId = blockIdParam ? partnerIdOrBlockId : mockStore.getCurrentPartner().id;
        const bId = blockIdParam || partnerIdOrBlockId;
        mockStore.removeAvailabilityBlock(pId, bId);
        return {
          success: true,
          data: { removed: true },
          message: 'Blokir jadwal berhasil dibuka',
        };
      } catch (err: any) {
        return {
          success: false,
          error: { code: 'REMOVE_FAILED', message: err.message },
        };
      }
    }
    return request<any>(`/availability/block/${blockIdParam || partnerIdOrBlockId}`, {
      method: 'DELETE',
    });
  },
};
