'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

// ── Brand config ─────────────────────────────────────────────────────────────

const BRANDS = [
  {
    id: 'apple',   name: 'Apple',
    tagline: 'iPhone certifié Grade A — garantie constructeur 12 mois incluse.',
    model: 'iPhone 14', from: 649,
    glow: 'rgba(196,146,42,0.20)',
    href: '/boutique?marque=apple', badge: 'Nouveau · iPhone 16 Pro disponible',
    body: '#c8b89a', screen: '#d4c4a8', frame: '#b8a888', fill: '#ede5d4',
  },
  {
    id: 'samsung', name: 'Samsung',
    tagline: 'Galaxy S22 — Dynamic AMOLED 120 Hz, triple capteur 50 Mpx.',
    model: 'Galaxy S22', from: 419,
    glow: 'rgba(0,120,255,0.10)',
    href: '/boutique?marque=samsung', badge: 'Bestseller · Galaxy S24 disponible',
    body: '#1a1a1a', screen: '#0d0d0d', frame: '#2a2a2a', fill: '#111111',
  },
  {
    id: 'google',  name: 'Pixel',
    tagline: 'Google Pixel 7 — photo nocturne exceptionnelle, puce Tensor G2.',
    model: 'Pixel 7', from: 379,
    glow: 'rgba(66,133,244,0.12)',
    href: '/boutique?marque=google', badge: 'Top vente · Pixel 8 disponible',
    body: '#f0ede8', screen: '#e8e4dc', frame: '#d8d4cc', fill: '#e4e0d8',
  },
  {
    id: 'xiaomi',  name: 'Xiaomi',
    tagline: 'Xiaomi 13T Pro — puissance maximale, le meilleur rapport qualité‑prix.',
    model: '13T Pro', from: 349,
    glow: 'rgba(255,105,0,0.12)',
    href: '/boutique?marque=xiaomi', badge: 'Prix malin · 13T Pro en stock',
    body: '#2a2a2a', screen: '#111111', frame: '#1e1e1e', fill: '#0d0d0d',
  },
]

type Brand = typeof BRANDS[0]

// ── Phone SVGs ────────────────────────────────────────────────────────────────

function ApplePhone({ b }: { b: Brand }) {
  return (
    <svg viewBox="0 0 160 320" fill="none" className="w-full drop-shadow-2xl">
      <rect x="4" y="4" width="152" height="312" rx="28" fill={b.body}/>
      <rect x="10" y="10" width="140" height="300" rx="23" fill={b.screen}/>
      <rect x="14" y="14" width="132" height="292" rx="20" fill={b.fill} opacity="0.5"/>
      {/* Dynamic Island */}
      <rect x="53" y="22" width="54" height="17" rx="8.5" fill="#0a0a0a"/>
      {/* Camera module */}
      <rect x="14" y="78" width="62" height="62" rx="14" fill={b.frame}/>
      <circle cx="33" cy="97" r="14" fill="#111"/><circle cx="33" cy="97" r="9" fill="#080808"/><circle cx="33" cy="97" r="4" fill="#1c1c1c"/>
      <circle cx="57" cy="97" r="12" fill="#111"/><circle cx="57" cy="97" r="7.5" fill="#080808"/><circle cx="57" cy="97" r="3" fill="#1c1c1c"/>
      <circle cx="45" cy="120" r="8" fill="#111"/>
      <circle cx="65" cy="120" r="4" fill="#d4b87a"/>
      {/* Home bar */}
      <rect x="52" y="300" width="56" height="5" rx="2.5" fill={b.frame} opacity="0.7"/>
    </svg>
  )
}

function SamsungPhone({ b }: { b: Brand }) {
  return (
    <svg viewBox="0 0 160 320" fill="none" className="w-full drop-shadow-2xl">
      <rect x="4" y="4" width="152" height="312" rx="26" fill={b.body}/>
      <rect x="8" y="8" width="144" height="304" rx="22" fill={b.fill}/>
      {/* Punch-hole */}
      <circle cx="80" cy="36" r="8" fill="#080808"/><circle cx="80" cy="36" r="4" fill="#050505"/>
      {/* Camera strip */}
      <rect x="118" y="58" width="32" height="92" rx="13" fill={b.frame}/>
      <circle cx="134" cy="78" r="11" fill="#111"/><circle cx="134" cy="78" r="7" fill="#0a0a0a"/>
      <circle cx="134" cy="106" r="11" fill="#111"/><circle cx="134" cy="106" r="7" fill="#0a0a0a"/>
      <circle cx="134" cy="130" r="8" fill="#111"/>
      {/* Home indicator */}
      <rect x="52" y="300" width="56" height="5" rx="2.5" fill={b.frame} opacity="0.8"/>
    </svg>
  )
}

function GooglePhone({ b }: { b: Brand }) {
  return (
    <svg viewBox="0 0 160 320" fill="none" className="w-full drop-shadow-2xl">
      <rect x="4" y="4" width="152" height="312" rx="22" fill={b.body}/>
      {/* Horizontal visor */}
      <rect x="4" y="4" width="152" height="72" rx="22" fill={b.frame}/>
      <rect x="4" y="42" width="152" height="30" rx="0" fill={b.frame}/>
      {/* Visor lenses */}
      <circle cx="50" cy="40" r="18" fill="#1a1a1a"/><circle cx="50" cy="40" r="12" fill="#0d0d0d"/><circle cx="50" cy="40" r="5" fill="#1f1f1f"/>
      <circle cx="94" cy="40" r="14" fill="#1a1a1a"/><circle cx="94" cy="40" r="9" fill="#0d0d0d"/><circle cx="94" cy="40" r="4" fill="#1f1f1f"/>
      <circle cx="124" cy="40" r="6" fill="#d4b87a"/>
      {/* Screen */}
      <rect x="10" y="74" width="140" height="236" rx="4" fill={b.fill} opacity="0.35"/>
      {/* Punch-hole */}
      <circle cx="80" cy="98" r="7" fill="#1a1a1a"/>
      <rect x="52" y="300" width="56" height="5" rx="2.5" fill={b.frame} opacity="0.6"/>
    </svg>
  )
}

function XiaomiPhone({ b }: { b: Brand }) {
  return (
    <svg viewBox="0 0 160 320" fill="none" className="w-full drop-shadow-2xl">
      <rect x="4" y="4" width="152" height="312" rx="24" fill={b.body}/>
      <rect x="8" y="8" width="144" height="304" rx="20" fill={b.fill}/>
      {/* Punch-hole */}
      <circle cx="80" cy="35" r="7.5" fill="#080808"/>
      {/* Round camera island */}
      <circle cx="80" cy="90" r="40" fill={b.frame}/>
      <circle cx="64" cy="80" r="14" fill="#111"/><circle cx="64" cy="80" r="9" fill="#0a0a0a"/>
      <circle cx="96" cy="80" r="11" fill="#111"/><circle cx="96" cy="80" r="7" fill="#0a0a0a"/>
      <circle cx="80" cy="107" r="12" fill="#111"/><circle cx="80" cy="107" r="7.5" fill="#0a0a0a"/>
      <circle cx="108" cy="107" r="5" fill="#d4b87a"/>
      <rect x="52" y="300" width="56" height="5" rx="2.5" fill={b.frame} opacity="0.8"/>
    </svg>
  )
}

function PhoneSVG({ brand }: { brand: Brand }) {
  if (brand.id === 'apple')   return <ApplePhone b={brand}/>
  if (brand.id === 'samsung') return <SamsungPhone b={brand}/>
  if (brand.id === 'google')  return <GooglePhone b={brand}/>
  return <XiaomiPhone b={brand}/>
}

// ── Tilt wrapper ──────────────────────────────────────────────────────────────

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
    setTilt({ x: dx * 10, y: -dy * 10 })
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
      {/* Ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-700"
        style={{
          inset: '-20%',
          background: glow,
          filter: 'blur(60px)',
          opacity: hovered ? 1 : 0.6,
        }}
      />
      {children}
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

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
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-8"
              style={{ border: '1px solid var(--border-strong)', color: 'var(--gold)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: 'var(--gold)' }} />
              <span style={transStyle}>{brand.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-bold leading-[1.1] mb-5">
              <span className="block" style={{ fontSize: 'clamp(2.6rem,6vw,4.4rem)' }}>La technologie,</span>
              <span className="block jc-gold-text" style={{ fontSize: 'clamp(2.6rem,6vw,4.4rem)' }}>simplement.</span>
            </h1>

            {/* Dynamic tagline */}
            <p className="text-sm sm:text-base leading-relaxed mb-3 max-w-lg" style={{ ...transStyle, opacity: visible ? 0.6 : 0 }}>
              {brand.tagline}
            </p>

            <p className="text-sm font-medium mb-7">
              Livraison en{' '}
              <span className="font-bold" style={{ color: 'var(--gold)' }}>Guadeloupe / Martinique</span>
              {' & '}
              <span className="font-bold" style={{ color: 'var(--gold)' }}>Guyane</span>
            </p>

            {/* Brand selector */}
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

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href={brand.href} className="jc-btn-dark text-base px-7 py-3" style={transStyle}>
                Voir les {brand.name} →
              </Link>
              <button className="jc-btn-ghost text-base px-7 py-3">
                Paiement en 4× sans frais
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-5 text-xs opacity-40 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Authentiques</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Garantie constructeur</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Livraison express</span>
            </div>
          </div>

          {/* ── PHONE ── */}
          <div className="flex justify-center lg:justify-end">
            <TiltCard glow={brand.glow}>
              <div className="relative w-52 sm:w-60">

                {/* Phone */}
                <div style={transStyle}>
                  <PhoneSVG brand={brand} />
                </div>

                {/* Floating price badge */}
                <div
                  className="absolute -right-6 top-1/3 rounded-2xl px-4 py-3 shadow-xl pointer-events-none"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0) translateY(0)' : 'translateX(10px)',
                    transition: 'opacity 0.4s 0.12s ease, transform 0.4s 0.12s ease',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-0.5 whitespace-nowrap">À partir de</p>
                  <p className="font-bold text-xl leading-none jc-gold-text">{fmt(brand.from)}</p>
                  <p className="text-[10px] opacity-30 mt-1">ou 4× sans frais</p>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-5">
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
