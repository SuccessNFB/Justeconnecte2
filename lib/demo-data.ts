import type { Brand, Product, ProductVariant, ProductZonePrice, Zone } from './types'

export const DEMO_ZONE: Zone = { id: 'z1', name: 'martinique-guadeloupe', label: 'Martinique / Guadeloupe', tax_rate: 0.085, sort_order: 1 }

export const DEMO_BRANDS: Brand[] = [
  { id: 'b1', name: 'Apple',   slug: 'apple',   logo_url: null, sort_order: 1 },
  { id: 'b2', name: 'Samsung', slug: 'samsung', logo_url: null, sort_order: 2 },
  { id: 'b3', name: 'Google',  slug: 'google',  logo_url: null, sort_order: 3 },
  { id: 'b4', name: 'Xiaomi',  slug: 'xiaomi',  logo_url: null, sort_order: 4 },
]

const makePrice = (variantId: string, price: number, compare: number): ProductZonePrice => ({
  id: `p-${variantId}`, variant_id: variantId, zone_id: 'z1', price, compare_at_price: compare,
})

const makeVariant = (productId: string, id: string, colorName: string, colorHex: string, storage: string, sku: string, stock: number): ProductVariant & { product_zone_prices: ProductZonePrice[] } => ({
  id, product_id: productId, color_name: colorName, color_hex: colorHex,
  storage, sku, stock, is_active: true, sort_order: 0,
  product_zone_prices: [makePrice(id, 529, 699)],
})

export const DEMO_PRODUCTS: (Product & { brands: Brand; product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[] })[] = [
  {
    id: 'p1', brand_id: 'b1', name: 'iPhone 13', slug: 'iphone-13', badge: 'Bestseller',
    description: "L'iPhone 13 reconditionné — puce A15 Bionic, double caméra améliorée, certifié Grade A.",
    specs: { 'Écran': '6,1" Super Retina XDR', 'Puce': 'A15 Bionic', '5G': 'Oui', 'IP': 'IP68' },
    is_active: true, is_new: true, is_bestseller: true, created_at: '2024-01-01',
    brands: DEMO_BRANDS[0],
    product_variants: [
      makeVariant('p1', 'v1', 'Minuit', '#1c1c1e', '128 GB', 'IP13-MID-128', 8),
      makeVariant('p1', 'v2', 'Minuit', '#1c1c1e', '256 GB', 'IP13-MID-256', 5),
      makeVariant('p1', 'v3', 'Lumière stellaire', '#f5e6c8', '128 GB', 'IP13-STL-128', 4),
    ],
  },
  {
    id: 'p2', brand_id: 'b1', name: 'iPhone 14', slug: 'iphone-14', badge: 'Nouveau',
    description: "iPhone 14 reconditionné — caméra 12 Mpx AF, mode Accident, iOS 17.",
    specs: { 'Écran': '6,1" Super Retina XDR', 'Puce': 'A15 Bionic', '5G': 'Oui', 'IP': 'IP68' },
    is_active: true, is_new: true, is_bestseller: false, created_at: '2024-02-01',
    brands: DEMO_BRANDS[0],
    product_variants: [
      { ...makeVariant('p2', 'v4', 'Minuit', '#1c1c1e', '128 GB', 'IP14-MID-128', 6), product_zone_prices: [makePrice('v4', 649, 859)] },
      { ...makeVariant('p2', 'v5', 'Violet', '#8b5cf6', '128 GB', 'IP14-VIO-128', 7), product_zone_prices: [makePrice('v5', 649, 859)] },
    ],
  },
  {
    id: 'p3', brand_id: 'b2', name: 'Samsung Galaxy S22', slug: 'samsung-galaxy-s22', badge: 'Top vendeur',
    description: "Galaxy S22 reconditionné — Dynamic AMOLED 120Hz, triple capteur 50 Mpx.",
    specs: { 'Écran': '6,1" AMOLED 120Hz', 'Puce': 'Snapdragon 8 Gen 1', '5G': 'Oui', 'IP': 'IP68' },
    is_active: true, is_new: false, is_bestseller: true, created_at: '2024-01-15',
    brands: DEMO_BRANDS[1],
    product_variants: [
      { ...makeVariant('p3', 'v6', 'Phantom Black', '#1a1a1a', '128 GB', 'SGS22-BLK-128', 10), product_zone_prices: [makePrice('v6', 419, 599)] },
      { ...makeVariant('p3', 'v7', 'Phantom White', '#f0ede8', '128 GB', 'SGS22-WHT-128', 5), product_zone_prices: [makePrice('v7', 419, 599)] },
    ],
  },
  {
    id: 'p4', brand_id: 'b3', name: 'Google Pixel 7', slug: 'google-pixel-7', badge: 'Nouveau',
    description: "Pixel 7 reconditionné — puce Tensor G2, photo nocturne exceptionnelle.",
    specs: { 'Écran': '6,3" OLED 90Hz', 'Puce': 'Tensor G2', '5G': 'Oui', 'IP': 'IP68' },
    is_active: true, is_new: true, is_bestseller: false, created_at: '2024-03-01',
    brands: DEMO_BRANDS[2],
    product_variants: [
      { ...makeVariant('p4', 'v8', 'Obsidian', '#1c1c1e', '128 GB', 'GP7-OBS-128', 6), product_zone_prices: [makePrice('v8', 379, 549)] },
      { ...makeVariant('p4', 'v9', 'Snow', '#f5f5f0', '128 GB', 'GP7-SNW-128', 4), product_zone_prices: [makePrice('v9', 379, 549)] },
    ],
  },
]
