import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ProductDetail from './ProductDetail'
import type { Brand, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

async function getProduct(slug: string): Promise<FullProduct | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`*, brands(*), product_variants(*, product_zone_prices(*))`)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data as FullProduct | null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Produit introuvable' }
  return {
    title: product.name,
    description: product.description ?? `${product.name} reconditionné certifié — Juste Connecté`,
    openGraph: { title: product.name, description: product.description ?? '' },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
