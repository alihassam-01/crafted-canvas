import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export interface Promotion {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const promotionService = {
  listPromotions: async (params: any): Promise<ApiResponse<PaginatedResponse<Promotion>>> => {
    return api.request<PaginatedResponse<Promotion>>('promotion', '/promotion', { params });
  },

  getPromotion: async (id: string): Promise<ApiResponse<Promotion>> => {
    return api.request<Promotion>('promotion', `/promotion/${id}`);
  },

  validatePromotion: async (code: string, cartTotal: number): Promise<ApiResponse<Promotion>> => {
    return api.request<Promotion>('promotion', '/promotion/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    });
  },
};
