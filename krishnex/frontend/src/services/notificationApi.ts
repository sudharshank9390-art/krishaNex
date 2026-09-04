import { api } from './api';

export interface NotificationRecord { id: string; title: string; message: string; readAt?: string | null; createdAt: string; }

export const notificationApi = {
  list: async () => (await api.get<{ data: NotificationRecord[]; unreadCount: number }>('/notifications')).data,
  markRead: async (id: string) => { await api.patch(`/notifications/${id}/read`); },
};