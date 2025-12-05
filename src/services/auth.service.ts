import { api } from '@/lib/api';
import { AuthResponse, ApiResponse, User } from '@/types/api';

export const authService = {
  register: async (data: any): Promise<ApiResponse<AuthResponse>> => {
    return api.request<AuthResponse>('auth', '/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: any): Promise<ApiResponse<AuthResponse>> => {
    return api.request<AuthResponse>('auth', '/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    await api.request('auth', '/auth/logout', { method: 'POST' });
    api.clearTokens();
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return api.request<User>('auth', '/auth/me');
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return api.request('auth', '/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (data: any): Promise<ApiResponse<{ message: string }>> => {
    return api.request('auth', '/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
