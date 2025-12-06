import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Shop } from '@/types/api';

export const shopService = {
  createShop: async (data: any): Promise<ApiResponse<Shop>> => {
    return api.request<Shop>('shops', '', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getShop: async (id: string): Promise<ApiResponse<Shop>> => {
    return api.request<Shop>('shops', `/${id}`);
  },

  updateShop: async (id: string, data: any): Promise<ApiResponse<Shop>> => {
    return api.request<Shop>('shops', `/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteShop: async (id: string): Promise<void> => {
    await api.request('shops', `/${id}`, { method: 'DELETE' });
  },

  listShops: async (params: any): Promise<ApiResponse<PaginatedResponse<Shop>>> => {
    return api.request<PaginatedResponse<Shop>>('shops', '', { params });
  },

  submitVerification: async (id: string, documents: string[]): Promise<ApiResponse<{ id: string; verificationStatus: string; submittedAt: string }>> => {
    return api.request('shops', `/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ documents }),
    });
  },

  getAnalytics: async (id: string, period: string = 'month'): Promise<ApiResponse<any>> => {
    return api.request('shops', `/${id}/analytics`, {
      params: { period },
    });
  },

  getMyShops: async (): Promise<ApiResponse<Shop[]>> => {
    return api.request<Shop[]>('shops', '/seller/my-shops');
  },
};
