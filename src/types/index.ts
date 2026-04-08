// TypeScript interfaces for all NexCart entities

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category?: Category;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  shippingAddress: ShippingAddress;
  couponCode?: string;
  discountAmount: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface ShippingAddress {
  name: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: Pick<User, 'id' | 'name'>;
}

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  description: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  error: string;
  code: string;
}

// Session types
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
