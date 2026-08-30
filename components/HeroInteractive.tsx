'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

const BRANDS = [
  {
    id: 'apple',
    name: 'Apple',
    tagline: 'iPhone 17 Pro Max : appareil photo cinématique, puce A19 Pro, titanium.',
    model: 'iPhone 17 Pro Max',
    from: 1599,
    glow: 'rgba(196,146,42,0.22)',
    href: '/boutique?marque=apple',
    productHref: '/boutique/iphone-17-pro-max',
    badge: 'Nouveau · iPhone 17 Pro Max disponible',
    image: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9394.png?v=1776375420',
  },
  {
    id: 'samsung',
    name: 'Samsung',
    tagline: 'Galaxy S26 Ultra : IA embarquée, stylet intégré, écran AMOLED 120 Hz.',
    model: 'Galaxy S26 Ultra',
    from: 1299,
    glow: 'rgba(0,120,255,0.12)',
    href: '/boutique?marque=samsung',
    productHref: '/boutique/samsung-galaxy-s26-ultra',
    badge: 'Nouveau · Galaxy S26 Ultra disponible',
    image: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-0062.png?v=1776374854',
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    tagline: 'Xiaomi 15 : Snapdragon 8 Elite, triple capteur Leica, charge 90 W.',
    model: 'Xiaomi 15',
    from: 799,
    glow: 'rgba(255,105,0,0.14)',
    href: '/boutique?marque=xiaomi',
    productHref: '/boutique/xiaomi-15',
    badge: 'Prix malin · Xiaomi 15 en stock',
    image: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1012.webp?v=1776995420',
  },
]

const INTERVAL_MS = 5500
const EXIT_MS     = 220

/* Spring-like enter (overshoots slightly) / sharp exit */
const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)'
const SHARP  = 'cubic-bezier(0.4, 0, 1, 1)'

function t(prop: string, ms: number, delay: number, ease: string) {
  return `${prop} ${ms}ms ${delay}ms ${ease}`
}
function enter(...props: string[]) {
  return (delay = 0, ms = 520) =>
    props.map(p => t(p, ms, delay, SPRING)).join(', ')
}
function exit(...props: string[]) {
  return () => props.map(p => t(p, EXIT_MS, 0, SHARP)).join(', ')
}

const enterOpacityTransform = enter('opacity', 'transform')
const exitOpacityTransform  = exit('opacity', 'transform')

/* ─ TiltCard ─────────────────────────────────────────────────────────────── */
function TiltCard({ children, glow }: { children: React.ReactNode; glow: string }) {
  const ref  = useRef<HTMLDivElement>(null)
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
    setTilt({ x: dx * 7, y: -dy * 7 })
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      style={{
        transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${hovered ? 1.015 : 1})`,
        transition: hovered
          ? 'transform 0.1s linear'
          : `transform 0.6s ${SPRING}`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-25%',
          background: glow,
          filter: 'blur(80px)',
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity 0.7s ease',
        }}
      />
      {children}
    </div>
  )
}

const fmt = (p: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p)

/* ─ Main ─────────────────────────────────────────────────────────────────── */
export default function HeroInteractive({ brandPrices = {} }: { brandPrices?: Record<string, number> }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [entering, setEntering]   = useState(true)
  const [progress, setProgress]   = useState(0)

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeRef   = useRef(0)          /* always current without stale closure */

  const brand    = BRANDS[activeIdx]
  const productSlug = brand.productHref.split('/').pop() ?? ''
  const fromPrice = brandPrices[productSlug] ?? brand.from

  /* ── Progress bar ── */
  const startProgress = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current)
    setProgress(0)
    const tick = 100 / (INTERVAL_MS / 50)
    progressRef.current = setInterval(() => {
      setProgress(p => { if (p + tick >= 100) { clearInterval(progressRef.current!); return 100 } return p + tick })
    }, 50)
  }, [])

  /* ── Switch logic ── */
  const advance = useCallback((nextIdx: number) => {
    setEntering(false)
    if (progressRef.current) clearInterval(progressRef.current)
    setTimeout(() => {
      activeRef.current = nextIdx
      setActiveIdx(nextIdx)
      setEntering(true)
      startProgress()
    }, EXIT_MS + 40)
  }, [startProgress])

  const resetTimer = useCallback((fromIdx?: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      advance((activeRef.current + 1) % BRANDS.length)
    }, INTERVAL_MS)
    if (fromIdx === undefined) startProgress()
  }, [advance, startProgress])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current)    clearInterval(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [resetTimer])

  function switchTo(idx: number) {
    if (idx === activeRef.current) return
    advance(idx)
    resetTimer(idx)
  }

  /* ── Animated style helpers ── */
  function style(
    entering: boolean,
    enterProps: { opacity?: number; transform?: string; delay?: number; ms?: number },
    exitProps:  { opacity?: number; transform?: string },
  ): React.CSSProperties {
    const { opacity = 1, transform = 'translateY(0) scale(1)', delay = 0, ms = 520 } = entering ? enterProps : {}
    const exitOpacity   = exitProps.opacity   ?? 0
    const exitTransform = exitProps.transform ?? 'translateY(6px) scale(0.97)'
    return {
      opacity:    entering ? (enterProps.opacity  ?? 1)  : exitOpacity,
      transform:  entering ? (enterProps.transform ?? 'translateY(0) scale(1)') : exitTransform,
      transition: entering ? enterOpacityTransform(delay, ms) : exitOpacityTransform(),
      willChange: 'opacity, transform',
    }
  }

  return (
    <section className="py-16 sm:py-24 overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="jc-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center">

          {/* ── TEXT COLUMN ── */}
          <div className="animate-fade-up">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-8"
              style={{
                border: '1px solid var(--border-strong)',
                color: 'var(--gold)',
                ...style(entering,
                  { opacity: 1, transform: 'translateY(0) scale(1)', delay: 0 },
                  { opacity: 0, transform: 'translateY(-5px) scale(0.96)' }
                ),
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: 'var(--gold)' }} />
              {brand.badge}
            </div>

            <h1 className="font-bold leading-[1.1] mb-5">
              <span className="block" style={{ fontSize: 'clamp(2.6rem,6vw,4.4rem)' }}>La technologie,</span>
              <span className="block jc-gold-text" style={{ fontSize: 'clamp(2.6rem,6vw,4.4rem)' }}>simplement.</span>
            </h1>

            {/* Tagline */}
            <p
              className="text-sm sm:text-base leading-relaxed mb-3 max-w-lg"
              style={style(entering,
                { opacity: 0.6, transform: 'translateY(0)', delay: 60 },
                { opacity: 0, transform: 'translateY(8px)' }
              )}
            >
              {brand.tagline}
            </p>

            <p className="text-sm font-medium mb-7">
              Livraison gratuite en{' '}
              <span className="font-bold" style={{ color: 'var(--gold)' }}>Guadeloupe / Martinique</span>
              {' & '}
              <span className="font-bold" style={{ color: 'var(--gold)' }}>Guyane</span>
              {' '}· Taxes et octroi de mer inclus
            </p>

            {/* Brand selector pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {BRANDS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => switchTo(i)}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full"
                  style={{
                    border: i === activeIdx ? '1.5px solid var(--gold)' : '1.5px solid var(--border-strong)',
                    background: i === activeIdx ? 'var(--gold-bg)' : 'transparent',
                    color: i === activeIdx ? 'var(--gold-deep)' : 'inherit',
                    opacity: i === activeIdx ? 1 : 0.45,
                    transform: i === activeIdx ? 'scale(1.05)' : 'scale(1)',
                    transition: `all 0.35s ${SPRING}`,
                  }}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-3 mb-10"
              style={style(entering,
                { opacity: 1, transform: 'translateY(0)', delay: 100 },
                { opacity: 0, transform: 'translateY(5px)' }
              )}
            >
              <Link href={brand.href} className="jc-btn-dark text-base px-7 py-3">
                Voir les {brand.name} →
              </Link>
              <Link href={brand.productHref} className="jc-btn-ghost text-base px-7 py-3">
                Paiement sécurisé PayPal
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 text-xs opacity-40 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Authentiques</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Garantie constructeur</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Livraison gratuite</span>
            </div>
          </div>

          {/* ── PHONE COLUMN ── */}
          <div className="flex justify-center lg:justify-end">
            <TiltCard glow={brand.glow}>
              <div className="relative" style={{ width: 'clamp(280px, 44vw, 420px)' }}>

                {/* Phone image */}
                <Link
                  href={brand.productHref}
                  className="group relative block animate-float"
                  style={{
                    height: 'clamp(440px, 66vw, 640px)',
                    ...style(entering,
                      { opacity: 1, transform: 'scale(1) translateY(0)', delay: 30, ms: 580 },
                      { opacity: 0, transform: 'scale(0.95) translateY(8px)' }
                    ),
                  }}
                >
                  <Image
                    src={brand.image}
                    alt={brand.model}
                    fill
                    className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 70vw, 420px"
                    priority={activeIdx === 0}
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full text-white"
                      style={{ background: 'rgba(17,17,17,0.74)', backdropFilter: 'blur(8px)' }}>
                      Voir le produit →
                    </span>
                  </div>
                </Link>

                {/* Floating price badge */}
                <div
                  className="absolute -right-4 sm:-right-8 top-1/3 rounded-2xl px-4 py-3 pointer-events-none"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    ...style(entering,
                      { opacity: 1, transform: 'translateX(0) scale(1)', delay: 180, ms: 500 },
                      { opacity: 0, transform: 'translateX(10px) scale(0.94)' }
                    ),
                  }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-0.5 whitespace-nowrap">À partir de</p>
                  <p className="font-bold text-xl leading-none jc-gold-text">{fmt(fromPrice)}</p>
                  <p className="text-[10px] opacity-30 mt-1">Paiement PayPal sécurisé</p>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-5">
                  {BRANDS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => switchTo(i)}
                      aria-label={`Voir ${BRANDS[i].name}`}
                      className="relative overflow-hidden rounded-full"
                      style={{
                        width: i === activeIdx ? '28px' : '6px',
                        height: '4px',
                        background: 'var(--border-strong)',
                        opacity: i === activeIdx ? 1 : 0.3,
                        transition: `width 0.4s ${SPRING}, opacity 0.3s ease`,
                      }}
                    >
                      {i === activeIdx && (
                        <span
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            width: `${progress}%`,
                            background: 'var(--gold)',
                            transition: 'width 0.05s linear',
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>

              </div>
            </TiltCard>
          </div>

        </div>
      </div>
    </section>
  )
}
