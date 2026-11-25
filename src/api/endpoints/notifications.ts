import { mockStore } from '@/mocks/store';
import { simulateDelay } from '@/mocks/delay';
import { NotificationItem, ApiResponse } from '@/types';

export const notificationsApi = {
  /**
   * Mengambil notifikasi untuk mitra aktif
   */
  async getNotifications(partnerId: string): Promise<ApiResponse<NotificationItem[]>> {
    await simulateDelay();

    const notifs = mockStore.getNotifications(partnerId);
    return {
      success: true,
      data: notifs,
      message: 'Berhasil memuat notifikasi',
    };
  },

  /**
   * Menandai satu notifikasi sudah dibaca
   */
  async markAsRead(
    partnerId: string,
    notificationId: string
  ): Promise<ApiResponse<{ marked: boolean }>> {
    await simulateDelay(200);

    mockStore.markNotificationRead(partnerId, notificationId);
    return {
      success: true,
      data: { marked: true },
      message: 'Notifikasi ditandai telah dibaca',
    };
  },

  /**
   * Menandai semua notifikasi telah dibaca
   */
  async markAllAsRead(partnerId: string): Promise<ApiResponse<{ markedAll: boolean }>> {
    await simulateDelay(300);

    mockStore.markAllNotificationsRead(partnerId);
    return {
      success: true,
      data: { markedAll: true },
      message: 'Semua notifikasi ditandai telah dibaca',
    };
  },
};
