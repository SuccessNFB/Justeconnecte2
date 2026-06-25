'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import type { Product, Brand, ProductVariant, ProductZonePrice } from '@/lib/types'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

interface Props {
  title: string
  products: FullProduct[]
  href: string
}

export default function ProductCarousel({ title, products, href }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const checkScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = trackRef.current
    if (!el) return
    // Re-check after images load
    const timer = setTimeout(checkScroll, 200)
    return () => clearTimeout(timer)
  }, [products, checkScroll])

  function nudge(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const cardW = card ? card.offsetWidth + 16 : 280
    el.scrollBy({ left: dir * cardW, behavior: 'smooth' })
  }

  if (!products.length) return null

  return (
    <section className="py-14" style={{ background: 'var(--surface)' }}>
      <div className="jc-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold" style={{ fontSize: 'clamp(1.7rem,3.5vw,2.4rem)' }}>
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Arrows — always rendered so layout doesn't shift */}
            <button
              onClick={() => nudge(-1)}
              disabled={!canPrev}
              aria-label="Précédent"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                opacity: canPrev ? 1 : 0.25,
                cursor: canPrev ? 'pointer' : 'default',
              }}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => nudge(1)}
              disabled={!canNext}
              aria-label="Suivant"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                opacity: canNext ? 1 : 0.25,
                cursor: canNext ? 'pointer' : 'default',
              }}
            >
              <ChevronRight size={17} />
            </button>
            <Link
              href={href}
              className="text-sm font-medium opacity-40 hover:opacity-70 transition-opacity ml-1"
            >
              Tout voir
            </Link>
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '4px',
          }}
        >
          {products.map(p => (
            <div
              key={p.id}
              data-card
              style={{
                scrollSnapAlign: 'start',
                flex: '0 0 auto',
                // Mobile: ~1.15 cards visible; tablet: ~2; desktop: ~4
                width: 'clamp(68%, 42%, 23%)',
              }}
            >
              <ProductCard product={p} />
            </div>
          ))}
          {/* Right sentinel so last card can fully snap */}
          <div style={{ flex: '0 0 1px' }} aria-hidden="true" />
        </div>

        {/* Swipe hint — visible only on touch devices via CSS */}
        <p className="text-[11px] opacity-25 text-center mt-3 sm:hidden">
          ← glissez pour voir plus →
        </p>
      </div>

      {/* Hide scrollbar in WebKit */}
      <style>{`
        [data-carousel-track]::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
