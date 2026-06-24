'use client'
import { useEffect, useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useWishlist } from '@/contexts/WishlistContext'
import { createClient } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import type { Product, Brand, ProductVariant, ProductZonePrice } from '@/lib/types'

export const dynamic = 'force-dynamic'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

export default function WishlistPage() {
  const { slugs } = useWishlist()
  const [products, setProducts] = useState<FullProduct[]>([])
  const [loading, setLoading]   = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!slugs.length) { setLoading(false); return }
    supabase
      .from('products')
      .select(`*, brands(*), product_variants(*, product_zone_prices(*))`)
      .in('slug', slugs)
      .eq('is_active', true)
      .then(({ data }) => {
        setProducts((data ?? []) as FullProduct[])
        setLoading(false)
      })
  }, [slugs.join(',')])

  return (
    <div className="py-12 min-h-screen">
      <div className="jc-container">
        <div className="flex items-center gap-3 mb-10">
          <Heart size={24} style={{ color: 'var(--gold)', fill: 'var(--gold)' }} />
          <h1 className="text-3xl font-bold">Mes favoris</h1>
          {slugs.length > 0 && (
            <span className="text-sm opacity-40">{slugs.length} produit{slugs.length > 1 ? 's' : ''}</span>
          )}
        </div>

        {loading ? (
          <p className="opacity-40 text-sm">Chargement…</p>
        ) : slugs.length === 0 ? (
          <div className="text-center py-32">
            <Heart size={48} className="mx-auto mb-4 opacity-15" />
            <p className="text-xl font-medium mb-2">Aucun favori pour l'instant</p>
            <p className="text-sm mb-8 opacity-45">
              Appuyez sur le cœur d'un produit pour le sauvegarder ici.
            </p>
            <Link href="/boutique" className="jc-btn-primary">Voir la boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 70} direction="up">
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
