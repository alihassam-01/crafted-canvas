import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';

export const paymentService = {
  createPaymentIntent: async (orderId: string): Promise<ApiResponse<{ clientSecret: string }>> => {
    return api.request<{ clientSecret: string }>('payment', '/payment/intent', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  confirmPayment: async (paymentIntentId: string): Promise<ApiResponse<any>> => {
    return api.request('payment', `/payment/confirm/${paymentIntentId}`, {
      method: 'POST',
    });
  },

  listPaymentMethods: async (): Promise<ApiResponse<any[]>> => {
    return api.request<any[]>('payment', '/payment/methods');
  },

  addPaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<any>> => {
    return api.request('payment', '/payment/methods', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });
  },

  deletePaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<void>> => {
    return api.request<void>('payment', `/payment/methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
  },
};
