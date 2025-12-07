import { api } from '@/lib/api';
import { ApiResponse, Cart, CartItem } from '@/types/api';

export const cartService = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', '');
  },

  addItem: async (data: { 
    productId: string; 
    shopId?: string;
    quantity: number; 
    price: number;
    productName: string;
    productImage: string;
    variationId?: string;
  }): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', '/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateItem: async (itemId: string, data: { quantity: number }): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', `/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  removeItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
    return api.request<Cart>('cart', `/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (): Promise<ApiResponse<void>> => {
    return api.request<void>('cart', '', {
      method: 'DELETE',
    });
  },
};
