import type { Brand, Product, ProductVariant, ProductZonePrice, Zone } from './types'

export const DEMO_ZONE: Zone = { id: 'z1', name: 'martinique-guadeloupe', label: 'Martinique / Guadeloupe', tax_rate: 0.085, sort_order: 1 }

export const DEMO_BRANDS: Brand[] = [
  { id: 'b1', name: 'Apple',   slug: 'apple',   logo_url: null, sort_order: 1 },
  { id: 'b2', name: 'Samsung', slug: 'samsung', logo_url: null, sort_order: 2 },
  { id: 'b3', name: 'Xiaomi',  slug: 'xiaomi',  logo_url: null, sort_order: 3 },
]

export const DEMO_PRODUCTS: (Product & { brands: Brand; product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[] })[] = []
