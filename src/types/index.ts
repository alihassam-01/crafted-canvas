export * from './api';

import { Shop, Product, User } from './api';

export type ProductCategory = 'CROCHET' | 'ART' | 'PAINTING' | 'HANDCRAFT';

export interface ProductFilters {
  category?: ProductCategory | ProductCategory[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price' | 'createdAt' | 'rating' | 'newest' | 'popular' | 'price-low' | 'price-high';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  inStock?: boolean;
  isHandmade?: boolean;
}

export interface ShopFilters {
  category?: ProductCategory;
  status?: string;
  search?: string;
  isVerified?: boolean;
  sortBy?: 'newest' | 'popular' | 'rating';
}
