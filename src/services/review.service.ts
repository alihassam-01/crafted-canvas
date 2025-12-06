import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse, Review } from '@/types/api';

export const reviewService = {
  createReview: async (data: any): Promise<ApiResponse<Review>> => {
    return api.request<Review>('reviews', '', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getReviews: async (targetId: string, params: any): Promise<ApiResponse<PaginatedResponse<Review> & { summary: any }>> => {
    return api.request<PaginatedResponse<Review> & { summary: any }>('reviews', `/target/${targetId}`, { params });
  },
};
