// src/types/index.ts
export type { User, Product, Category, Order, OrderItem, Review, Coupon, Banner, Cart, CartItem, Variant } from '@prisma/client'

export interface ProductWithRelations {
  id: string
  name: string
  slug: string
  description: string
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  stock: number
  featured: boolean
  active: boolean
  productionDays: number
  weight?: number | null
  dimensions?: Record<string, number> | null
  materials: string[]
  finishes: string[]
  metaTitle?: string | null
  metaDescription?: string | null
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category: { id: string; name: string; slug: string }
  images: { id: string; url: string; alt?: string | null; order: number }[]
  variants: { id: string; name: string; value: string; price?: number | null; stock: number }[]
  reviews: ReviewWithUser[]
  _count?: { reviews: number; favorites: number }
}

export interface ReviewWithUser {
  id: string
  rating: number
  title?: string | null
  body?: string | null
  approved: boolean
  createdAt: Date
  user: { name: string; avatar?: string | null }
}

export interface OrderWithRelations {
  id: string
  number: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  trackingCode?: string | null
  trackingUrl?: string | null
  paidAt?: Date | null
  shippedAt?: Date | null
  deliveredAt?: Date | null
  createdAt: Date
  updatedAt: Date
  user: { id: string; name: string; email: string; phone?: string | null }
  address: Address
  coupon?: { code: string; value: number; type: string } | null
  items: OrderItemWithProduct[]
  timeline: { id: string; status: string; message?: string | null; createdAt: Date }[]
}

export interface OrderItemWithProduct {
  id: string
  name: string
  sku?: string | null
  image?: string | null
  price: number
  quantity: number
  total: number
  product: { id: string; slug: string }
  variant?: { name: string; value: string } | null
}

export interface CartState {
  items: CartItemState[]
  coupon?: CouponState | null
  shippingCost: number
  subtotal: number
  discount: number
  total: number
}

export interface CartItemState {
  id: string
  productId: string
  variantId?: string | null
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: { url: string; alt?: string | null }[]
  }
  variant?: { id: string; name: string; value: string; price?: number | null } | null
}

export interface CouponState {
  id: string
  code: string
  type: string
  value: number
  discount: number
}

export interface Address {
  id: string
  userId: string
  label?: string | null
  name: string
  phone?: string | null
  zipCode: string
  street: string
  number: string
  complement?: string | null
  district: string
  city: string
  state: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  days: number
  company?: string
}

export interface DashboardMetrics {
  revenueMonth: number
  revenueMonthDelta: number
  ordersMonth: number
  ordersMonthDelta: number
  avgTicket: number
  avgTicketDelta: number
  newCustomers: number
  newCustomersDelta: number
  topProducts: { name: string; sold: number; revenue: number }[]
  recentOrders: OrderWithRelations[]
  salesByDay: { date: string; total: number }[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FilterParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
  featured?: boolean
  active?: boolean
}
