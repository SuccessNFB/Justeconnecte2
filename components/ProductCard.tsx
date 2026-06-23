'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useZone } from '@/contexts/ZoneContext'
import { formatPrice } from '@/lib/utils'
import type { Product, ProductVariant, ProductZonePrice } from '@/lib/types'

interface Props {
  product: Product & {
    brands?: { name: string }
    product_variants?: (ProductVariant & { product_zone_prices?: ProductZonePrice[] })[]
  }
}

export default function ProductCard({ product }: Props) {
  const { zone } = useZone()

  const allVariants = product.product_variants ?? []
  const prices = allVariants.flatMap(v => v.product_zone_prices ?? [])

  let minPrice: number | null = null
  if (zone) {
    const zonePrices = prices.filter(p => p.zone_id === zone.id).map(p => p.price)
    if (zonePrices.length) minPrice = Math.min(...zonePrices)
  }
  if (minPrice === null) {
    const allPrices = prices.map(p => p.price)
    if (allPrices.length) minPrice = Math.min(...allPrices)
  }

  const image = `/images/placeholder-phone.svg`

  return (
    <Link href={`/produits/${product.slug}`} className="block jc-card overflow-hidden group">
      {/* Image zone */}
      <div
        className="relative aspect-square flex items-center justify-center p-8"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, oklch(0.745 0.085 78 / 0.08) 0%, var(--surface-soft) 70%)',
        }}
      >
        {product.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: 'var(--gold-deep)' }}
          >
            {product.badge}
          </span>
        )}
        {product.is_new && !product.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: 'var(--success)' }}
          >
            Nouveau
          </span>
        )}
        {/* Phone placeholder SVG */}
        <svg
          viewBox="0 0 120 200"
          className="w-32 h-auto transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="5" width="100" height="190" rx="16" fill="var(--primary)" opacity="0.08"/>
          <rect x="14" y="9" width="92" height="182" rx="13" fill="var(--primary)" opacity="0.12"/>
          <rect x="18" y="13" width="84" height="174" rx="10" fill="var(--primary)" opacity="0.85"/>
          <rect x="22" y="20" width="76" height="140" rx="6" fill="oklch(0.88 0.002 247)"/>
          <circle cx="60" cy="173" r="8" fill="oklch(0.75 0.002 247)"/>
        </svg>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--gold-deep)' }}>
          {product.brands?.name}
        </p>
        <h3 className="font-semibold text-sm leading-snug mb-3">{product.name}</h3>

        <div className="flex items-center justify-between">
          {minPrice !== null ? (
            <p className="text-sm">
              <span className="text-xs opacity-50 mr-1">À partir de</span>
              <span className="font-bold">{formatPrice(minPrice)}</span>
            </p>
          ) : (
            <p className="text-sm text-opacity-50">Prix non disponible</p>
          )}
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all group-hover:opacity-90"
            style={{ background: 'var(--gradient-gold)' }}
          >
            Voir →
          </span>
        </div>
      </div>
    </Link>
  )
}
