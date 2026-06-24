import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ProductDetail from './ProductDetail'
import type { Brand, Product, ProductVariant, ProductZonePrice, SiteContent } from '@/lib/types'
import { DEMO_PRODUCTS } from '@/lib/demo-data'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

async function getProduct(slug: string): Promise<FullProduct | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select(`*, brands(*), product_variants(*, product_zone_prices(*))`)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    if (data) return data as FullProduct
  } catch {}
  return (DEMO_PRODUCTS.find(p => p.slug === slug) ?? null) as FullProduct | null
}

async function getFaq(): Promise<{ q: string; a: string }[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_content')
      .select('key, value')
      .eq('page', 'produit')
      .eq('section', 'faq')
      .order('key')
    if (!data?.length) return []
    const map: Record<string, string> = {}
    for (const row of data) map[row.key] = row.value
    const faq: { q: string; a: string }[] = []
    for (let i = 1; i <= 5; i++) {
      const q = map[`${i}_q`]
      const a = map[`${i}_a`]
      if (q && a) faq.push({ q, a })
    }
    return faq
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Produit introuvable' }
  return {
    title: product.name,
    description: product.description ?? `${product.name} — Juste Connecté`,
    openGraph: { title: product.name, description: product.description ?? '' },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, faq] = await Promise.all([getProduct(params.slug), getFaq()])
  if (!product) notFound()
  return <ProductDetail product={product} faq={faq.length ? faq : undefined} />
}
