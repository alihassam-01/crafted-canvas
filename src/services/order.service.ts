import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Order } from '@/types/api';

export const orderService = {
  createOrder: async (data: any): Promise<ApiResponse<Order>> => {
    return api.request<Order>('orders', '', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return api.request<Order>('orders', `/${id}`);
  },

  listOrders: async (params: any): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    return api.request<PaginatedResponse<Order>>('orders', '', { params });
  },

  cancelOrder: async (id: string, reason: string): Promise<ApiResponse<Order>> => {
    return api.request<Order>('orders', `/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    return api.request<Order>('orders', `/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
