// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  role: 'customer' | 'vendor' | 'admin';
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Shop Types
export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner?: string;
  ownerId: string;
  owner: User;
  rating: number;
  reviewCount: number;
  productCount: number;
  followers: number;
  category: ProductCategory;
  location: string;
  createdAt: string;
  isVerified: boolean;
}

// Product Types
export type ProductCategory = 'crochet' | 'painting' | 'handicraft';

export interface ProductSize {
  id: string;
  name: string;
  dimensions?: string;
  price: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: ProductCategory;
  subcategory?: string;
  tags: string[];
  sizes?: ProductSize[];
  sizeChart?: SizeChartEntry[];
  colors?: string[];
  materials?: string[];
  shopId: string;
  shop: Shop;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isHandmade: boolean;
  processingTime: string;
  createdAt: string;
}

export interface SizeChartEntry {
  size: string;
  bust?: string;
  waist?: string;
  hips?: string;
  length?: string;
  width?: string;
  height?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user: User;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
  verified: boolean;
}

export interface ProductReview extends Review {
  productId: string;
}

export interface ShopReview extends Review {
  shopId: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export interface ProductFilters {
  category?: ProductCategory;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular' | 'rating';
  inStock?: boolean;
  isHandmade?: boolean;
}

export interface ShopFilters {
  category?: ProductCategory;
  rating?: number;
  isVerified?: boolean;
  sortBy?: 'newest' | 'popular' | 'rating';
}

// Pagination Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Search Types
export interface SearchResult {
  products: Product[];
  shops: Shop[];
  totalProducts: number;
  totalShops: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'review' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
