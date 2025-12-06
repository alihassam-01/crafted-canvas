import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Notification } from '@/types/api';

export const notificationService = {
  listNotifications: async (params: any): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    return api.request<PaginatedResponse<Notification>>('notifications', '', { params });
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    return api.request<Notification>('notifications', `/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return api.request<void>('notifications', '/read-all', {
      method: 'PUT',
    });
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    return api.request<void>('notifications', `/${id}`, {
      method: 'DELETE',
    });
  },
};
