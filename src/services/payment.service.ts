import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';

export const paymentService = {
  createPaymentIntent: async (orderId: string): Promise<ApiResponse<{ clientSecret: string }>> => {
    return api.request<{ clientSecret: string }>('payments', '/intent', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  confirmPayment: async (paymentIntentId: string): Promise<ApiResponse<any>> => {
    return api.request('payments', `/confirm/${paymentIntentId}`, {
      method: 'POST',
    });
  },

  listPaymentMethods: async (): Promise<ApiResponse<any[]>> => {
    return api.request<any[]>('payments', '/methods');
  },

  addPaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<any>> => {
    return api.request('payments', '/methods', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });
  },

  deletePaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<void>> => {
    return api.request<void>('payments', `/methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
  },
};
