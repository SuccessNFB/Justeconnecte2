'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Zap, Award, CheckCircle, AlertTriangle, XCircle, ChevronDown, Heart } from 'lucide-react'
import { useZone } from '@/contexts/ZoneContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatPrice, getStockStatus } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import type { Brand, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

const PAYMENT = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Scalapay']

const REVIEWS = [
  { name: 'Marc S.',     note: 'Très satisfait',            body: "Produit arrivé en 9 jours, emballage d'origine scellé, téléphone neuf et impeccable. Exactement ce que j'avais commandé.", rating: 5, date: 'il y a 2 semaines' },
  { name: 'Sandrine T.', note: 'Excellent service client',  body: "Très réactif sur WhatsApp, réponse en moins d'une heure. Je recommande sans hésiter.", rating: 5, date: 'il y a 3 semaines' },
  { name: 'Kevin M.',    note: 'Neuf et scellé',            body: "iPhone reçu dans son emballage d'origine intact. Livraison en 8 jours en Guadeloupe. Parfait.", rating: 5, date: 'il y a 1 mois' },
  { name: 'Lara D.',     note: 'Prix introuvable en local', body: 'Prix bien inférieur aux boutiques de Guyane pour le même smartphone neuf. Livraison en 10 jours sans frais. Très contente.', rating: 4, date: 'il y a 1 mois' },
]

const RATING_BARS = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 14 },
  { stars: 3, pct: 6  },
  { stars: 2, pct: 2  },
  { stars: 1, pct: 0  },
]

const FAQ = [
  { q: "Les appareils sont-ils vraiment neufs et scellés ?",
    a: "Oui, tous nos smartphones sont neufs, sous emballage d'origine scellé en usine. Ils n'ont jamais été utilisés et bénéficient de la garantie constructeur complète." },
  { q: "Quelle est la politique de retour ?",
    a: "Vous disposez de 14 jours après réception pour retourner votre appareil sans justification. Le remboursement est effectué sous 5 jours ouvrés." },
  { q: "Comment fonctionne la garantie constructeur ?",
    a: "Chaque appareil est couvert par la garantie officielle du fabricant (Apple, Samsung, Xiaomi…) pour 12 à 24 mois selon la marque. En cas de panne, contactez-nous ou directement le service après-vente constructeur." },
  { q: "Le téléphone est-il débloqué tout opérateur ?",
    a: "Tous nos appareils sont débloqués et compatibles avec tous les opérateurs (Orange, SFR, Bouygues, Free et opérateurs locaux antillais)." },
  { q: "Comment fonctionne le paiement en 4 fois avec Scalapay ?",
    a: "Sélectionnez Scalapay au moment du paiement. Vous payez le premier quart immédiatement, puis 3 prélèvements à 30 jours d'intervalle. Zéro frais, zéro intérêt." },
]

function IconSavings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/>
      <path d="M11 15l4-4"/>
      <circle cx="11" cy="15" r="0.85" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="11" r="0.85" fill="currentColor" stroke="none"/>
    </svg>
  )
}
function IconCpu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="7" y="7" width="10" height="10" rx="1.5"/>
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/>
    </svg>
  )
}
function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M6.5 18.5C6.5 11 12.5 4.5 21 4c0 8.5-6 14.5-14.5 14.5z"/>
      <path d="M6.5 18.5L13 12"/>
    </svg>
  )
}
function IconUnlock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="3" y="11" width="18" height="11" rx="2.5"/>
      <path d="M7 11V7a5 5 0 019.9-1"/>
    </svg>
  )
}
function IconShieldCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  )
}
function IconReturn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M3 7h14a4 4 0 010 8H7"/>
      <path d="M7 4l-4 3 4 3"/>
    </svg>
  )
}

const BENEFITS = [
  { icon: IconSavings,      title: 'Prix compétitifs',       body: 'Meilleurs tarifs que les revendeurs locaux sur des appareils 100 % neufs.' },
  { icon: IconCpu,          title: '100 % neuf',             body: "Jamais utilisé, emballage d'origine scellé — prêt à l'emploi dès l'ouverture." },
  { icon: IconLeaf,         title: 'Livraison gratuite',     body: 'Expédié depuis la France. Livraison offerte en Guadeloupe, Martinique et Guyane — taxe & octroi de mer inclus.' },
  { icon: IconUnlock,       title: 'Débloqué',               body: 'Compatible tous opérateurs sans restriction.' },
  { icon: IconShieldCheck,  title: 'Garantie constructeur',  body: 'Garantie officielle 12 à 24 mois selon la marque. Batterie incluse.' },
  { icon: IconReturn,       title: 'Retours 14 jours',       body: 'Satisfait ou remboursé, sans condition ni justification.' },
]

function PhoneDisplay({ colorHex }: { colorHex: string }) {
  return (
    <svg viewBox="0 0 200 360" fill="none" className="w-full max-w-xs mx-auto drop-shadow-2xl">
      <rect x="14" y="6" width="172" height="348" rx="30" fill={colorHex || '#c8b89a'} />
      <rect x="18" y="10" width="164" height="340" rx="27" fill={colorHex || '#d4c4a8'} opacity="0.75" />
      <rect x="22" y="28" width="156" height="290" rx="16" fill="#eee8dc" opacity="0.9" />
      <rect x="80" y="34" width="40" height="13" rx="6.5" fill={colorHex || '#b8a888'} opacity="0.6"/>
      <rect x="26" y="40" width="56" height="56" rx="14" fill={colorHex || '#b8a888'} opacity="0.35"/>
      <circle cx="40" cy="60" r="11" fill="#111" opacity="0.65"/>
      <circle cx="40" cy="60" r="7"  fill="#1a1a1a" opacity="0.75"/>
      <circle cx="62" cy="60" r="11" fill="#111" opacity="0.65"/>
      <circle cx="62" cy="60" r="7"  fill="#1a1a1a" opacity="0.75"/>
      <circle cx="51" cy="84" r="5"  fill="#111" opacity="0.3"/>
      <rect x="80" y="328" width="40" height="6" rx="3" fill={colorHex || '#b8a888'} opacity="0.5"/>
    </svg>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold transition-colors"
        style={{ color: open ? 'var(--gold-deep)' : 'inherit' }}
      >
        {q}
        <ChevronDown size={16} className="shrink-0 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none', opacity: 0.5 }} />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed opacity-55">{a}</p>
      )}
    </div>
  )
}

export default function ProductDetail({ product, faq: faqProp }: { product: FullProduct; faq?: { q: string; a: string }[] }) {
  const faqItems = faqProp ?? FAQ
  const { zone }                   = useZone()
  const { addItem }                = useCart()
  const { toggle, isWishlisted }   = useWishlist()
  const router                     = useRouter()
  const ctaRef                     = useRef<HTMLDivElement>(null)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [viewers, setViewers]      = useState(0)
  const wishlisted                 = isWishlisted(product.slug)

  useEffect(() => {
    trackEvent('product_view', { productSlug: product.slug, zone: zone?.name })
  }, [product.slug])

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 8) + 4)
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  const variants = product.product_variants ?? []
  const colorMap  = new Map(variants.map(v => [v.color_hex, v]))
  const colors    = Array.from(colorMap.values())

  const [selectedColor,   setSelectedColor]   = useState<string>(colors[0]?.color_hex ?? '')
  const colorVariants = variants.filter(v => v.color_hex === selectedColor)
  const storages      = colorVariants.map(v => v.storage)
  const [selectedStorage, setSelectedStorage] = useState<string>(storages[0] ?? '')

  const selectedVariant = colorVariants.find(v => v.storage === selectedStorage) ?? colorVariants[0]

  // Gallery images: prefer variant-level images (per colour), fall back to product-level
  const variantImages  = (selectedVariant?.images ?? []).filter(Boolean)
  const galleryImages: string[] = variantImages.length
    ? variantImages
    : product.images?.length
      ? product.images
      : product.image_url
        ? [product.image_url]
        : []

  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef  = useRef<HTMLDivElement>(null)
  const slideCount   = useRef(galleryImages.length)
  const touchStartX  = useRef(0)
  const touchStartY  = useRef(0)
  const dragStartX   = useRef(0)
  const isDragging   = useRef(false)
  slideCount.current = galleryImages.length

  // Native touch listeners with non-passive touchmove so we can
  // call preventDefault and stop the page scrolling during a horizontal swipe
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    function onTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }
    function onTouchMove(e: TouchEvent) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current)
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current)
      if (dx > dy && slideCount.current > 1) e.preventDefault()
    }
    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(dx) > 40 && slideCount.current > 1) {
        setCurrentSlide(s => dx < 0
          ? (s + 1) % slideCount.current
          : (s - 1 + slideCount.current) % slideCount.current)
      }
    }
    el.addEventListener('touchstart',  onTouchStart, { passive: true  })
    el.addEventListener('touchmove',   onTouchMove,  { passive: false })
    el.addEventListener('touchend',    onTouchEnd,   { passive: true  })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = true
    dragStartX.current = e.clientX
  }
  function handleMouseUp(e: React.MouseEvent) {
    if (!isDragging.current) return
    isDragging.current = false
    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 40 && galleryImages.length > 1) {
      setCurrentSlide(s => dx < 0
        ? (s + 1) % galleryImages.length
        : (s - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  const zonePrice         = selectedVariant?.product_zone_prices?.find(p => zone ? p.zone_id === zone.id : false)
                         ?? selectedVariant?.product_zone_prices?.[0]
  const isOutOfStock      = selectedVariant?.out_of_stock ?? false
  const stockStatus       = isOutOfStock ? 'out_of_stock' : (selectedVariant ? getStockStatus(selectedVariant.stock) : 'out_of_stock')
  const selectedColorName = variants.find(v => v.color_hex === selectedColor)?.color_name ?? ''
  const scalapay  = zonePrice ? (zonePrice.price / 4).toFixed(2).replace('.', ',') : null
  const discount  = zonePrice?.compare_at_price
    ? Math.round((1 - zonePrice.price / zonePrice.compare_at_price) * 100) : null

  function handleColorSelect(hex: string) {
    setSelectedColor(hex)
    const newStorages = variants.filter(v => v.color_hex === hex).map(v => v.storage)
    if (!newStorages.includes(selectedStorage)) setSelectedStorage(newStorages[0] ?? '')
    setCurrentSlide(0)
  }

  const canBuy = stockStatus !== 'out_of_stock' && !!selectedVariant

  return (
    <div className="py-10">

      {/* ── STICKY BAR ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(18px)',
          borderTop: '1px solid var(--border)',
          transform: stickyVisible ? 'translateY(0)' : 'translateY(100%)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <div className="jc-container flex items-center justify-between gap-4 py-3">
          <div className="hidden sm:block">
            <p className="font-semibold text-sm">{product.name}</p>
            {zonePrice && <p className="text-xs font-bold jc-gold-text">{formatPrice(zonePrice.price)}</p>}
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              disabled={!canBuy}
              onClick={() => { if (selectedVariant) { addItem(selectedVariant.id); trackEvent('add_to_cart', { productSlug: product.slug, variantId: selectedVariant.id, zone: zone?.name }) } }}
              className="jc-btn-primary px-6 py-2.5 text-sm"
            >
              <ShoppingCart size={15} />
              Ajouter au panier
            </button>
            <button
              disabled={!canBuy}
              onClick={() => { if (selectedVariant) { addItem(selectedVariant.id); trackEvent('add_to_cart', { productSlug: product.slug, variantId: selectedVariant.id, zone: zone?.name }); router.push('/panier') } }}
              className="jc-btn-ghost px-5 py-2.5 text-sm"
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </div>

      <div className="jc-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

          {/* ── GALERIE ── */}
          <div className="flex flex-col gap-3">
            {/* Main carousel */}
            <div
              ref={carouselRef}
              className="rounded-3xl overflow-hidden relative select-none"
              style={{
                background: 'linear-gradient(160deg,#f9f5ee 0%,#ede5d4 100%)',
                border: '1px solid var(--border)',
                aspectRatio: '4/5',
                cursor: galleryImages.length > 1 ? 'grab' : 'default',
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { isDragging.current = false }}
            >
              {galleryImages.length > 0 ? (
                <>
                  <div
                    className="flex h-full"
                    style={{
                      width: `${galleryImages.length * 100}%`,
                      transform: `translateX(-${(currentSlide * 100) / galleryImages.length}%)`,
                      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    {galleryImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative flex-shrink-0"
                        style={{ width: `${100 / galleryImages.length}%`, height: '100%' }}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} — photo ${i + 1}`}
                          fill
                          className="object-contain p-4 drop-shadow-xl"
                          sizes="(max-width: 1024px) 90vw, 45vw"
                          priority={i === 0}
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>

                  {galleryImages.length > 1 && (
                    <>
                      {/* Dot indicators */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {galleryImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className="rounded-full transition-all duration-300"
                            style={{
                              width: i === currentSlide ? '20px' : '6px',
                              height: '6px',
                              background: i === currentSlide ? 'var(--gold)' : 'rgba(0,0,0,0.25)',
                            }}
                          />
                        ))}
                      </div>

                      {/* Arrow navigation */}
                      <button
                        onClick={() => setCurrentSlide(s => (s - 1 + galleryImages.length) % galleryImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full z-10 transition-all hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                        aria-label="Photo précédente"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M9 2.5L5 7L9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentSlide(s => (s + 1) % galleryImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full z-10 transition-all hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                        aria-label="Photo suivante"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5 2.5L9 7L5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <PhoneDisplay colorHex={selectedColor} />
                </div>
              )}
            </div>

            {/* Thumbnail strip — visible when product has multiple images */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-0.5">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="relative flex-shrink-0 rounded-xl overflow-hidden"
                    style={{
                      width: '64px',
                      height: '64px',
                      border: `2px solid ${i === currentSlide ? 'var(--gold)' : 'var(--border)'}`,
                      background: 'linear-gradient(160deg,#f9f5ee 0%,#ede5d4 100%)',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <Image src={img} alt={`Miniature ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INFOS ── */}
          <div className="flex flex-col gap-5">

            {/* Social proof */}
            {viewers > 0 && (
              <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--gold-deep)' }}>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                {viewers} personnes regardent ce produit en ce moment
              </div>
            )}

            {/* Stars */}
            <div className="flex items-center gap-1.5">
              <span className="jc-stars">★★★★★</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>4.8</span>
              <span className="text-sm opacity-40">· 42 avis vérifiés</span>
            </div>

            {/* Name */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-35 mb-1">{product.brands?.name}</p>
              <h1 className="font-bold leading-tight" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
                {product.name}
              </h1>
            </div>

            {/* Price */}
            {zonePrice && (
              <div className="rounded-2xl p-4" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-bold" style={{ fontSize: '2rem' }}>{formatPrice(zonePrice.price)}</span>
                  {zonePrice.compare_at_price && (
                    <>
                      <span className="text-base line-through opacity-30">{formatPrice(zonePrice.compare_at_price)}</span>
                      {discount && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(196,146,42,.15)', color: 'var(--gold-deep)' }}>
                          −{discount} %
                        </span>
                      )}
                    </>
                  )}
                </div>
                {scalapay && (
                  <p className="text-xs opacity-50 mb-2">
                    ou 4× <strong>{scalapay} €</strong> sans frais avec Scalapay
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {PAYMENT.map(p => (
                    <span key={p} className="text-[9px] font-semibold px-2 py-1 rounded border opacity-40"
                      style={{ borderColor: 'var(--border-strong)' }}>{p}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Colour */}
            <div>
              <p className="text-xs font-semibold mb-2">
                Couleur : <span className="font-normal opacity-50">{selectedColorName}</span>
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {colors.map(v => {
                  const oos = v.out_of_stock ?? false
                  return (
                    <button
                      key={v.color_hex}
                      onClick={() => handleColorSelect(v.color_hex)}
                      title={oos ? `${v.color_name} — Rupture de stock` : v.color_name}
                      className="relative w-8 h-8 rounded-full transition-all"
                      style={{
                        background: v.color_hex,
                        opacity: oos ? 0.45 : 1,
                        boxShadow: selectedColor === v.color_hex
                          ? `0 0 0 2px var(--surface), 0 0 0 4px ${v.color_hex}`
                          : '0 0 0 1.5px rgba(0,0,0,.12)',
                      }}
                    >
                      {oos && (
                        <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full" aria-hidden>
                          <line x1="6" y1="6" x2="26" y2="26" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Storage */}
            <div>
              <p className="text-xs font-semibold mb-2">Stockage</p>
              <div className="flex gap-2 flex-wrap">
                {storages.map(s => (
                  <button key={s} onClick={() => setSelectedStorage(s)}
                    className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{
                      background: selectedStorage === s ? 'var(--primary)' : 'var(--surface)',
                      color:      selectedStorage === s ? '#fff' : 'inherit',
                      border:     `1.5px solid ${selectedStorage === s ? 'var(--primary)' : 'var(--border-strong)'}`,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock + urgency */}
            {selectedVariant && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {stockStatus === 'in_stock'     && <><CheckCircle size={15} style={{ color: 'var(--success)' }} /><span style={{ color: 'var(--success)' }}>En stock · Expédié sous 24 à 48 h</span></>}
                  {stockStatus === 'low_stock'    && <><AlertTriangle size={15} style={{ color: 'var(--warning)' }} /><span style={{ color: 'var(--warning)' }}>⚡ Plus que {selectedVariant.stock} en stock — dépêchez-vous !</span></>}
                  {stockStatus === 'out_of_stock' && <><XCircle size={15} style={{ color: 'var(--destructive)' }} /><span style={{ color: 'var(--destructive)' }}>Rupture de stock</span></>}
                </div>
                {stockStatus === 'low_stock' && (
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min((selectedVariant.stock / 10) * 100, 100)}%`, background: 'var(--warning)' }} />
                  </div>
                )}
              </div>
            )}

            {/* CTAs */}
            <div ref={ctaRef} className="flex gap-3">
              <button
                disabled={!canBuy}
                onClick={() => { if (selectedVariant) { addItem(selectedVariant.id); trackEvent('add_to_cart', { productSlug: product.slug, variantId: selectedVariant.id, zone: zone?.name }) } }}
                className="jc-btn-primary flex-1 py-3.5 text-sm"
              >
                <ShoppingCart size={16} />
                {stockStatus === 'out_of_stock' ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
              <button
                disabled={!canBuy}
                onClick={() => { if (selectedVariant) { addItem(selectedVariant.id); trackEvent('add_to_cart', { productSlug: product.slug, variantId: selectedVariant.id, zone: zone?.name }); router.push('/panier') } }}
                className="jc-btn-ghost flex-1 py-3.5 text-sm"
              >
                <Zap size={16} /> Acheter maintenant
              </button>
              <button
                onClick={() => toggle(product.slug)}
                className="p-3.5 rounded-full transition-all"
                aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                style={{
                  border: `1.5px solid ${wishlisted ? 'var(--gold)' : 'var(--border-strong)'}`,
                  background: wishlisted ? 'var(--gold-bg)' : 'transparent',
                }}
              >
                <Heart
                  size={17}
                  style={{
                    fill: wishlisted ? 'var(--gold)' : 'none',
                    color: wishlisted ? 'var(--gold)' : 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: CheckCircle, label: '100 % Authentique',   sub: 'Sélectionné chez les distributeurs officiels' },
                { icon: Award,       label: 'Garantie 12 mois',     sub: 'Garantie constructeur, batterie incluse' },
                { icon: CheckCircle, label: 'Retours 14 jours',     sub: 'Satisfait ou remboursé, sans conditions' },
                { icon: CheckCircle, label: 'Paiement sécurisé',    sub: 'SSL + 4× sans frais avec Scalapay' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex gap-2.5 text-xs p-3 rounded-xl"
                  style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
                  <Icon size={15} style={{ color: 'var(--gold)' }} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5">{label}</p>
                    <p className="opacity-40">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SKU */}
            {selectedVariant && (
              <p className="font-mono text-[10px] opacity-25">SKU : {selectedVariant.sku}</p>
            )}
          </div>
        </div>

        {/* ── SPECS ── */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="font-bold text-xl mb-6">Caractéristiques techniques</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {Object.entries(product.specs).map(([key, val], i) => (
                <div key={key} className="flex text-sm"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div className="w-44 px-5 py-3.5 font-medium opacity-40 shrink-0"
                    style={{ background: 'var(--surface-soft)' }}>{key}</div>
                  <div className="px-5 py-3.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── POURQUOI JUSTE CONNECTÉ ── */}
        <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mb-8">
            <p className="jc-overline mb-2">Nos engagements</p>
            <h2 className="font-bold text-2xl">Pourquoi choisir Juste Connecté ?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BENEFITS.map(b => (
              <div key={b.title} className="rounded-2xl p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div
                  className="mb-3.5 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--gold-bg)', color: 'var(--gold-deep)' }}
                >
                  <b.icon />
                </div>
                <p className="font-bold text-sm mb-1">{b.title}</p>
                <p className="text-xs opacity-45 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <h2 className="font-bold text-xl mb-6">Questions fréquentes</h2>
          <div className="max-w-2xl rounded-2xl px-6 py-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {faqItems.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </div>

        {/* ── AVIS ── */}
        <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-8 mb-8">
            {/* Score global */}
            <div className="shrink-0 text-center">
              <p className="font-bold" style={{ fontSize: '3.5rem', lineHeight: 1 }}>4.8</p>
              <div className="jc-stars text-lg my-1">★★★★★</div>
              <p className="text-xs opacity-35">42 avis vérifiés</p>
            </div>
            {/* Barres */}
            <div className="flex-1 flex flex-col gap-2">
              {RATING_BARS.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2.5 text-xs">
                  <span className="w-3 opacity-40 font-medium">{stars}</span>
                  <span className="jc-stars text-[10px]">★</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: 'var(--gold)' }} />
                  </div>
                  <span className="w-7 opacity-35 text-right">{pct} %</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVIEWS.map(r => (
              <div key={r.name} className="rounded-2xl p-5"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="jc-stars text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <p className="text-xs font-bold mt-0.5">{r.note}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#16a34a' }}>✓ Achat vérifié</span>
                </div>
                <p className="text-sm opacity-55 leading-relaxed mb-3">{r.body}</p>
                <div className="flex items-center justify-between text-xs opacity-35">
                  <span className="font-medium">{r.name}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        {product.description && (
          <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="font-bold text-xl mb-4">Description</h2>
            <div className="text-sm leading-relaxed opacity-55 max-w-2xl space-y-2">
              {product.description
                .replace(/[-—]{4,}/g, '\n')
                .split('\n')
                .map(l => l.trim())
                .filter(Boolean)
                .map((line, i) => <p key={i}>{line}</p>)
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
