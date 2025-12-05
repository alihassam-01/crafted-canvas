import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Order } from '@/types/api';

export const orderService = {
  createOrder: async (data: any): Promise<ApiResponse<Order>> => {
    return api.request<Order>('order', '/order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return api.request<Order>('order', `/order/${id}`);
  },

  listOrders: async (params: any): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    return api.request<PaginatedResponse<Order>>('order', '/order', { params });
  },

  cancelOrder: async (id: string, reason: string): Promise<ApiResponse<Order>> => {
    return api.request<Order>('order', `/order/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    return api.request<Order>('order', `/order/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
