export type OrderType = 'table' | 'delivery' | 'pickup'

export type ViewName = 'menu' | 'checkout' | 'review' | 'success'

export type MenuStatus = 'loading' | 'ready' | 'error'

export type PaymentMethod = 'cash' | 'card' | 'transfer'

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
  featured?: boolean
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  reference: string
  paymentMethod: PaymentMethod
}

export interface CustomerLocation {
  lat: number
  lng: number
  mapsUrl: string
}

export interface BusinessConfig {
  name: string
  tagline: string
  whatsappNumber: string
  address: string
  currency: string
  deliveryFee: number
  paymentMethods: Array<{
    id: PaymentMethod
    label: string
  }>
}

export interface OrderPayload {
  items: CartItem[]
  orderType: OrderType
  tableNumber: string
  customerInfo: CustomerInfo
  location: CustomerLocation | null
  subtotal: number
  deliveryFee: number
  total: number
}
