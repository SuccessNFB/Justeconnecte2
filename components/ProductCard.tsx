'use client'
import Link from 'next/link'
import { useZone } from '@/contexts/ZoneContext'
import { formatPrice } from '@/lib/utils'
import type { Product, ProductVariant, ProductZonePrice } from '@/lib/types'

interface Props {
  product: Product & {
    brands?: { name: string }
    product_variants?: (ProductVariant & { product_zone_prices?: ProductZonePrice[] })[]
  }
}

function PhoneIllustration({ colorHex }: { colorHex?: string }) {
  const fill = colorHex || '#e8e0d4'
  return (
    <svg viewBox="0 0 140 240" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-auto drop-shadow-sm">
      <rect x="12" y="4" width="116" height="232" rx="22" fill={fill} />
      <rect x="16" y="8" width="108" height="224" rx="19" fill={fill} opacity="0.7" />
      {/* Screen */}
      <rect x="18" y="24" width="104" height="192" rx="14" fill="#f0f0f0" opacity="0.9" />
      {/* Dynamic Island */}
      <rect x="52" y="28" width="36" height="10" rx="5" fill="#d0ccc6" />
      {/* Camera bump */}
      <rect x="26" y="30" width="34" height="34" rx="10" fill={fill} opacity="0.4" />
      <circle cx="35" cy="43" r="7" fill="#1a1a1a" opacity="0.6" />
      <circle cx="35" cy="43" r="4" fill="#333" opacity="0.7" />
      <circle cx="51" cy="43" r="7" fill="#1a1a1a" opacity="0.6" />
      <circle cx="51" cy="43" r="4" fill="#333" opacity="0.7" />
      {/* Home indicator */}
      <rect x="54" y="210" width="32" height="4" rx="2" fill="#aaa" opacity="0.5" />
    </svg>
  )
}

export default function ProductCard({ product }: Props) {
  const { zone } = useZone()
  const allVariants = product.product_variants ?? []
  const prices = allVariants.flatMap(v => v.product_zone_prices ?? [])

  let minPrice: number | null = null
  let comparePrice: number | null = null

  if (zone) {
    const zonePrices = prices.filter(p => p.zone_id === zone.id)
    if (zonePrices.length) {
      minPrice = Math.min(...zonePrices.map(p => p.price))
      const withCompare = zonePrices.find(p => p.compare_at_price && p.price === minPrice)
      comparePrice = withCompare?.compare_at_price ?? null
    }
  }
  if (minPrice === null) {
    const allP = prices.map(p => p.price)
    if (allP.length) minPrice = Math.min(...allP)
  }

  const scalapayInstalment = minPrice ? (minPrice / 4).toFixed(2).replace('.', ',') : null
  const firstVariant = allVariants[0]
  const colorHex = firstVariant?.color_hex

  const badge = product.badge
  const badgeClass = badge?.toLowerCase().includes('best') || badge?.toLowerCase().includes('top')
    ? 'jc-badge-best' : 'jc-badge-new'

  return (
    <Link href={`/produits/${product.slug}`} className="block group">
      <div
        className="rounded-2xl overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Image zone */}
        <div className="relative flex items-center justify-center pt-8 pb-4 px-6"
          style={{ background: 'linear-gradient(160deg, #faf8f5 0%, #f0ece4 100%)' }}>
          {badge && (
            <span className={`${badgeClass} absolute top-3 left-3`}>{badge}</span>
          )}
          <PhoneIllustration colorHex={colorHex} />
        </div>

        {/* Info */}
        <div className="px-4 pb-4 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 opacity-45">
            {product.brands?.name}
          </p>
          <h3 className="font-semibold text-sm leading-snug mb-1.5">{product.name}</h3>

          {/* Stars */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="jc-stars text-xs">★★★★★</span>
            <span className="text-[11px] font-medium" style={{ color: 'var(--gold)' }}>4.8</span>
            <span className="text-[11px] opacity-40">· 42 avis</span>
          </div>

          {/* Price */}
          {minPrice !== null && (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-base">{formatPrice(minPrice)}</span>
                {comparePrice && (
                  <span className="text-xs line-through opacity-35">{formatPrice(comparePrice)}</span>
                )}
              </div>
              {scalapayInstalment && (
                <p className="text-[11px] mt-0.5 opacity-45">
                  ou 4× {scalapayInstalment}&nbsp;€ avec Scalapay
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
