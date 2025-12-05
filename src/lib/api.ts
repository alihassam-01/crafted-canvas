import { ApiResponse } from '@/types/api';

const PORTS = {
  auth: 3001,
  shop: 3002,
  product: 3003,
  order: 3004,
  cart: 3004,
  payment: 3005,
  notification: 3006,
  review: 3008,
  admin: 3009,
  promotion: 3010,
};

const BASE_URL = 'http://localhost';

type Service = keyof typeof PORTS;

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private static instance: ApiClient;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${BASE_URL}:${PORTS.auth}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.setTokens(data.data.accessToken, data.data.refreshToken);
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to refresh token', error);
    }

    this.clearTokens();
    return false;
  }

  public async request<T>(
    service: Service,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${BASE_URL}:${PORTS[service]}${endpoint}`);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as any)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url.toString(), {
        ...options,
        headers,
      });

      if (response.status === 401 && this.refreshToken) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry request with new token
          (headers as any)['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url.toString(), {
            ...options,
            headers,
          });
        } else {
          // Refresh failed, redirect to login or handle logout
          window.location.href = '/auth?mode=login';
          throw new Error('Session expired');
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Failed', error);
      throw error;
    }
  }
}

export const api = ApiClient.getInstance();
