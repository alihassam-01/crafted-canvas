import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Product } from '@/types/api';

export const productService = {
  createProduct: async (data: any): Promise<ApiResponse<Product>> => {
    return api.request<Product>('products', '', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return api.request<Product>('products', `/${id}`);
  },

  updateProduct: async (id: string, data: any): Promise<ApiResponse<Product>> => {
    return api.request<Product>('products', `/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.request('products', `/${id}`, { method: 'DELETE' });
  },

  listProducts: async (params: any): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return api.request<PaginatedResponse<Product>>('products', '', { params });
  },

  getShopProducts: async (shopId: string, params: any): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return api.request<PaginatedResponse<Product>>('products', `/shop/${shopId}`, { params });
  },

  updateInventory: async (id: string, data: { stock: number; lowStockThreshold?: number }): Promise<ApiResponse<any>> => {
    return api.request('products', `/${id}/inventory`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  addVariation: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return api.request('products', `/${id}/variations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
