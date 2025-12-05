import { api } from '@/lib/api';
import { ApiResponse, Cart, CartItem } from '@/types/api';

export const cartService = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', '/cart');
  },

  addItem: async (data: { productId: string; quantity: number; variationId?: string }): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', '/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateItem: async (itemId: string, data: { quantity: number }): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', `/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  removeItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', `/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (): Promise<ApiResponse<void>> => {
    return api.request<void>('cart', '/cart', {
      method: 'DELETE',
    });
  },
};
