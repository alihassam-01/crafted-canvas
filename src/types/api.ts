export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  requiresMFA?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'CROCHET' | 'ART' | 'PAINTING' | 'HANDCRAFT';
  logo?: string;
  banner?: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  rating: number;
  totalReviews: number;
  totalProducts: number;
  totalSales: number;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: 'PHYSICAL' | 'DIGITAL';
  category: string;
  tags: string[];
  images: string[];
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  rating: number;
  totalReviews: number;
  shop: {
    id: string;
    name: string;
    logo?: string;
  };
  attributes?: Record<string, string>;
  variations?: {
    id: string;
    name: string; // e.g., "Size", "Color"
    options: {
      id: string;
      value: string;
      price?: number;
      stock?: number;
    }[];
  }[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  shopId: string;
  variationId?: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Review {
  id: string;
  type: 'PRODUCT' | 'SHOP';
  targetId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
