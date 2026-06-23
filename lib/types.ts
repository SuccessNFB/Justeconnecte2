export interface Zone {
  id: string
  name: string
  label: string
  tax_rate: number
  sort_order: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  sort_order: number
}

export interface Product {
  id: string
  brand_id: string
  name: string
  slug: string
  description: string | null
  specs: Record<string, string>
  is_active: boolean
  is_new: boolean
  is_bestseller: boolean
  badge: string | null
  created_at: string
  brands?: Brand
  product_variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  color_name: string
  color_hex: string
  storage: string
  sku: string
  stock: number
  is_active: boolean
  sort_order: number
  product_zone_prices?: ProductZonePrice[]
}

export interface ProductZonePrice {
  id: string
  variant_id: string
  zone_id: string
  price: number
  compare_at_price: number | null
}

export interface CartItem {
  variantId: string
  quantity: number
  variant?: ProductVariant & { products?: Product }
}
