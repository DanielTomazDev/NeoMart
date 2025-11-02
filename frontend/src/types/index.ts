export interface User {
  _id: string
  name: string
  email: string
  role: 'buyer' | 'seller' | 'admin'
  avatar?: string
  phone?: string
  addresses?: Address[]
  favorites?: string[]
  searchHistory?: SearchHistory[]
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Address {
  _id?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface SearchHistory {
  query: string
  timestamp: string
}

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  discount: number
  images: ProductImage[]
  category: Category
  seller: Seller
  stock: number
  condition: 'new' | 'used' | 'refurbished'
  brand?: string
  specifications?: Specification[]
  shipping: Shipping
  rating: Rating
  views: number
  sales: number
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  url: string
  alt?: string
}

export interface Specification {
  key: string
  value: string
}

export interface Shipping {
  freeShipping: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

export interface Rating {
  average: number
  count: number
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Seller {
  _id: string
  name: string
  avatar?: string
}

export interface Order {
  _id: string
  orderNumber: string
  buyer: User
  seller: Seller
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  status: OrderStatus
  paymentMethod: string
  paymentStatus: PaymentStatus
  shippingAddress: Address
  trackingCode?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
  total: number
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'refunded'

export interface Review {
  _id: string
  product: string
  user: User
  rating: number
  comment: string
  images?: string[]
  helpful: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  sender: User
  recipient: User
  content: string
  conversationId: string
  product?: Product
  isRead: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  _id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  product?: Product
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    items: T[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

