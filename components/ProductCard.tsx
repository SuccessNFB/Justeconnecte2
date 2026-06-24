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

function PhoneIllustration({ colorHex }: { colorHex?: string }) {
  const fill = colorHex || '#e8e0d4'
  return (
    <svg viewBox="0 0 140 240" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-auto drop-shadow-md">
      <rect x="12" y="4" width="116" height="232" rx="22" fill={fill} />
      <rect x="16" y="8" width="108" height="224" rx="19" fill={fill} opacity="0.7" />
      <rect x="18" y="24" width="104" height="192" rx="14" fill="#f0f0f0" opacity="0.9" />
      <rect x="52" y="28" width="36" height="10" rx="5" fill="#d0ccc6" />
      <rect x="26" y="30" width="34" height="34" rx="10" fill={fill} opacity="0.4" />
      <circle cx="35" cy="43" r="7" fill="#1a1a1a" opacity="0.6" />
      <circle cx="35" cy="43" r="4" fill="#333" opacity="0.7" />
      <circle cx="51" cy="43" r="7" fill="#1a1a1a" opacity="0.6" />
      <circle cx="51" cy="43" r="4" fill="#333" opacity="0.7" />
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
    <Link href={`/produits/${product.slug}`} className="block">
      <div className="jc-product-card">

        {/* ── Image zone ── */}
        <div className="relative flex items-center justify-center pt-8 pb-6 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #faf8f5 0%, #f0ece4 100%)' }}>

          {badge && (
            <span className={`${badgeClass} absolute top-3 left-3 z-10`}>{badge}</span>
          )}

          {/* Phone with spring-scale on hover */}
          <div className="jc-phone-wrap">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={200}
                height={200}
                className="w-36 h-36 object-contain drop-shadow-md"
                sizes="160px"
              />
            ) : (
              <PhoneIllustration colorHex={colorHex} />
            )}
          </div>

          {/* Gold radial glow */}
          <div className="jc-img-glow absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 10%, rgba(196,146,42,0.12) 0%, transparent 65%)' }} />

          {/* CTA badge */}
          <div className="jc-cta-overlay absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-10">
            <span className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full text-white"
              style={{ background: 'rgba(17,17,17,0.74)', backdropFilter: 'blur(8px)' }}>
              Voir le produit →
            </span>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="jc-card-info px-4 pb-4 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 opacity-40">
            {product.brands?.name}
          </p>
          <h3 className="font-semibold text-sm leading-snug mb-1.5">{product.name}</h3>

          <div className="flex items-center gap-1.5 mb-2">
            <span className="jc-stars text-xs">★★★★★</span>
            <span className="text-[11px] font-medium" style={{ color: 'var(--gold)' }}>4.8</span>
            <span className="text-[11px] opacity-40">· 42 avis</span>
          </div>

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
