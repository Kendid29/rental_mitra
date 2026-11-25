import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import {
  Booking,
  BookingFilters,
  PaginatedResponse,
  ApiResponse,
  PartnerReadinessStatus,
} from '@/types';
import { paginateList } from '@/mocks/query';

export const bookingsApi = {
  /**
   * Mengambil daftar pesanan rental untuk mitra aktif
   */
  async getBookings(
    partnerId: string,
    filters?: BookingFilters
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    await simulateDelay();

    let items = mockStore.getBookings(partnerId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(q) ||
          b.customer.nama.toLowerCase().includes(q) ||
          (b.customer.telepon && b.customer.telepon.includes(q)) ||
          (b.customer.phone && b.customer.phone.includes(q)) ||
          b.vehicle.nama.toLowerCase().includes(q) ||
          b.vehicle.platNomor.toLowerCase().includes(q)
      );
    }

    if (filters?.status && filters.status !== 'semua') {
      items = items.filter((b) => b.status === filters.status);
    }

    if (filters?.readinessStatus && filters.readinessStatus !== 'semua') {
      items = items.filter((b) => b.readinessStatus === filters.readinessStatus);
    }

    if (filters?.vehicleType && filters.vehicleType !== 'semua') {
      items = items.filter((b) => (b.vehicle.tipe || b.vehicle.jenis) === filters.vehicleType);
    }

    if (filters?.dateRange?.startDate && filters?.dateRange?.endDate) {
      const { startDate, endDate } = filters.dateRange;
      items = items.filter(
        (b) => b.tanggalMulai >= startDate && b.tanggalSelesai <= endDate
      );
    }

    // Sort newest booking first
    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const paginated = paginateList(items, page, limit);

    return {
      success: true,
      data: paginated,
      message: 'Berhasil memuat daftar pesanan',
    };
  },

  /**
   * Mengambil detail pesanan berdasarkan ID
   */
  async getBookingById(
    partnerId: string,
    bookingId: string
  ): Promise<ApiResponse<Booking>> {
    await simulateDelay();

    const booking = mockStore.getBookingById(partnerId, bookingId);
    if (!booking) {
      return {
        success: false,
        error: {
          code: 'BOOKING_NOT_FOUND',
          message: 'Data pesanan tidak ditemukan atau tidak memiliki izin akses',
        },
      };
    }

    return {
      success: true,
      data: booking,
      message: 'Berhasil memuat detail pesanan',
    };
  },

  /**
   * Konfirmasi kesiapan armada oleh Mitra (Ready / Issue Reported)
   */
  async updateReadiness(
    partnerId: string,
    bookingId: string,
    readinessStatus: PartnerReadinessStatus,
    partnerNotes?: string,
    issueData?: { alasan: string; catatan: string }
  ): Promise<ApiResponse<Booking>> {
    await simulateDelay(600);

    try {
      const updated = mockStore.updateBookingReadiness(
        partnerId,
        bookingId,
        readinessStatus,
        partnerNotes,
        issueData
      );

      return {
        success: true,
        data: updated,
        message:
          readinessStatus === 'ready'
            ? 'Armada berhasil dikonfirmasi SIAP untuk serah terima'
            : 'Laporan kendala kesiapan armada berhasil dikirim ke Admin',
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'UPDATE_READINESS_FAILED',
          message: err.message || 'Gagal memperbarui status kesiapan',
        },
      };
    }
  },
};
