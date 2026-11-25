export type NotificationCategory =
  | 'pesanan'
  | 'jadwal'
  | 'serah_terima'
  | 'pengembalian'
  | 'maintenance'
  | 'reimburse'
  | 'sistem';

export interface NotificationItem {
  id: string;
  partnerId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
