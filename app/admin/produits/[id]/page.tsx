'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ProductForm from '@/components/ui/ProductForm'
import type { Product, ProductVariant, ProductZonePrice } from '@/lib/types'

type Full = Product & {
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

export default function EditProduit() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Full | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('products')
      .select(`*, product_variants(*, product_zone_prices(*))`)
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProduct(data as Full)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>Chargement…</p>
  if (!product) return <p style={{ color: 'var(--destructive)' }}>Produit introuvable.</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Éditer — {product.name}</h1>
      <ProductForm product={product} />
    </div>
  )
}
