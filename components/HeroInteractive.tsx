'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

const BRANDS = [
  {
    id: 'apple',
    name: 'Apple',
    tagline: 'iPhone 17 Pro Max — appareil photo cinématique, puce A19 Pro, titanium.',
    model: 'iPhone 17 Pro Max',
    from: 1599,
    glow: 'rgba(196,146,42,0.22)',
    href: '/boutique?marque=apple',
    productHref: '/produits/iphone-17-pro-max',
    badge: 'Nouveau · iPhone 17 Pro Max disponible',
    image: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9394.png?v=1776375420',
  },
  {
    id: 'samsung',
    name: 'Samsung',
    tagline: 'Galaxy S26 Ultra — IA embarquée, stylet intégré, écran AMOLED 120 Hz.',
    model: 'Galaxy S26 Ultra',
    from: 439,
    glow: 'rgba(0,120,255,0.12)',
    href: '/boutique?marque=samsung',
    productHref: '/produits/samsung-galaxy-s26-ultra',
    badge: 'Nouveau · Galaxy S26 Ultra disponible',
    image: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-0062.png?v=1776374854',
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    tagline: 'Xiaomi 15 — Snapdragon 8 Elite, triple capteur Leica, charge 90 W.',
    model: 'Xiaomi 15',
    from: 389,
    glow: 'rgba(255,105,0,0.14)',
    href: '/boutique?marque=xiaomi',
    productHref: '/produits/xiaomi-15',
    badge: 'Prix malin · Xiaomi 15 en stock',
    image: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1012.webp?v=1776995420',
  },
]

type Brand = typeof BRANDS[0]

function TiltCard({ children, glow }: { children: React.ReactNode; glow: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
    setTilt({ x: dx * 8, y: -dy * 8 })
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      style={{
        transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
        transition: 'transform 0.18s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-700"
        style={{ inset: '-20%', background: glow, filter: 'blur(70px)', opacity: hovered ? 1 : 0.55 }}
      />
      {children}
    </div>
  )
}

const fmt = (p: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p)

export default function HeroInteractive() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [visible, setVisible]     = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const brand = BRANDS[activeIdx]

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setActiveIdx(p => (p + 1) % BRANDS.length); setVisible(true) }, 350)
    }, 5000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  function switchTo(idx: number) {
    if (idx === activeIdx) return
    setVisible(false)
    setTimeout(() => { setActiveIdx(idx); setVisible(true) }, 350)
    startTimer()
  }

  const transStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
  }

  return (
    <section className="py-16 sm:py-24 overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="jc-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center">

          {/* ── TEXT ── */}
          <div className="animate-fade-up">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-8"
              style={{ border: '1px solid var(--border-strong)', color: 'var(--gold)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: 'var(--gold)' }} />
              <span style={transStyle}>{brand.badge}</span>
            </div>

            <h1 className="font-bold leading-[1.1] mb-5">
              <span className="block" style={{ fontSize: 'clamp(2.6rem,6vw,4.4rem)' }}>La technologie,</span>
              <span className="block jc-gold-text" style={{ fontSize: 'clamp(2.6rem,6vw,4.4rem)' }}>simplement.</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed mb-3 max-w-lg" style={{ ...transStyle, opacity: visible ? 0.6 : 0 }}>
              {brand.tagline}
            </p>

            <p className="text-sm font-medium mb-7">
              Livraison en{' '}
              <span className="font-bold" style={{ color: 'var(--gold)' }}>Guadeloupe / Martinique</span>
              {' & '}
              <span className="font-bold" style={{ color: 'var(--gold)' }}>Guyane</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {BRANDS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => switchTo(i)}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    border: i === activeIdx ? '1.5px solid var(--gold)' : '1.5px solid var(--border-strong)',
                    background: i === activeIdx ? 'var(--gold-bg)' : 'transparent',
                    color: i === activeIdx ? 'var(--gold-deep)' : 'inherit',
                    opacity: i === activeIdx ? 1 : 0.45,
                    transform: i === activeIdx ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  {b.name}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href={brand.href} className="jc-btn-dark text-base px-7 py-3" style={transStyle}>
                Voir les {brand.name} →
              </Link>
              <button className="jc-btn-ghost text-base px-7 py-3">
                Paiement en 4× sans frais
              </button>
            </div>

            <div className="flex flex-wrap gap-5 text-xs opacity-40 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Authentiques</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Garantie constructeur</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Livraison express</span>
            </div>
          </div>

          {/* ── PHONE IMAGE ── */}
          <div className="flex justify-center lg:justify-end">
            <TiltCard glow={brand.glow}>
              <div className="relative" style={{ width: 'clamp(220px, 36vw, 340px)' }}>

                {/* Phone — no card, floats freely */}
                <Link
                  href={brand.productHref}
                  className="group relative block"
                  style={{ ...transStyle, height: 'clamp(360px, 55vw, 520px)' }}
                >
                  <Image
                    src={brand.image}
                    alt={brand.model}
                    fill
                    className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 55vw, 340px"
                    priority={activeIdx === 0}
                  />
                  {/* Hover label */}
                  <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full text-white"
                      style={{ background: 'rgba(17,17,17,0.74)', backdropFilter: 'blur(8px)' }}>
                      Voir le produit →
                    </span>
                  </div>
                </Link>

                {/* Floating price badge */}
                <div
                  className="absolute -right-4 sm:-right-8 top-1/3 rounded-2xl px-4 py-3 shadow-xl pointer-events-none"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(10px)',
                    transition: 'opacity 0.4s 0.12s ease, transform 0.4s 0.12s ease',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-0.5 whitespace-nowrap">À partir de</p>
                  <p className="font-bold text-xl leading-none jc-gold-text">{fmt(brand.from)}</p>
                  <p className="text-[10px] opacity-30 mt-1">ou 4× sans frais</p>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {BRANDS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => switchTo(i)}
                      aria-label={`Voir ${BRANDS[i].name}`}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === activeIdx ? '20px' : '6px',
                        height: '6px',
                        background: i === activeIdx ? 'var(--gold)' : 'var(--border-strong)',
                        opacity: i === activeIdx ? 1 : 0.35,
                      }}
                    />
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
