import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Notification } from '@/types/api';

export const notificationService = {
  listNotifications: async (params: any): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    return api.request<PaginatedResponse<Notification>>('notification', '/notification', { params });
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    return api.request<Notification>('notification', `/notification/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return api.request<void>('notification', '/notification/read-all', {
      method: 'PUT',
    });
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    return api.request<void>('notification', `/notification/${id}`, {
      method: 'DELETE',
    });
  },
};
