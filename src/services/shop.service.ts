import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Shop } from '@/types/api';

export const shopService = {
  createShop: async (data: any): Promise<ApiResponse<Shop>> => {
    return api.request<Shop>('shop', '/shop', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getShop: async (id: string): Promise<ApiResponse<Shop>> => {
    return api.request<Shop>('shop', `/shop/${id}`);
  },

  updateShop: async (id: string, data: any): Promise<ApiResponse<Shop>> => {
    return api.request<Shop>('shop', `/shop/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteShop: async (id: string): Promise<void> => {
    await api.request('shop', `/shop/${id}`, { method: 'DELETE' });
  },

  listShops: async (params: any): Promise<ApiResponse<PaginatedResponse<Shop>>> => {
    return api.request<PaginatedResponse<Shop>>('shop', '/shop', { params });
  },

  submitVerification: async (id: string, documents: string[]): Promise<ApiResponse<{ id: string; verificationStatus: string; submittedAt: string }>> => {
    return api.request('shop', `/shop/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ documents }),
    });
  },

  getAnalytics: async (id: string, period: string = 'month'): Promise<ApiResponse<any>> => {
    return api.request('shop', `/shop/${id}/analytics`, {
      params: { period },
    });
  },

  getMyShops: async (): Promise<ApiResponse<Shop[]>> => {
    return api.request<Shop[]>('shop', '/shop/seller/my-shops');
  },
};
