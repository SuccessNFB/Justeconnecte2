'use client'
import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Zap, Award, CheckCircle, AlertTriangle, XCircle, ChevronDown } from 'lucide-react'
import { useZone } from '@/contexts/ZoneContext'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, getStockStatus } from '@/lib/utils'
import type { Brand, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

const PAYMENT = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Scalapay']

const REVIEWS = [
  { name: 'Marc S.',     note: 'Très satisfait',            body: 'Produit conforme à la description, emballage soigné. Impossible de distinguer du neuf.', rating: 5, date: 'il y a 2 jours' },
  { name: 'Sandrine T.', note: 'Excellent service client',  body: 'Très réactif sur WhatsApp, réponse en moins d\'une heure. Je recommande sans hésiter.', rating: 5, date: 'il y a 5 jours' },
  { name: 'Kevin M.',    note: 'Comme neuf',                body: 'Batterie à 98 %, pas une égratignure. Livraison dans les délais. Parfait.', rating: 5, date: 'il y a 1 semaine' },
  { name: 'Lara D.',     note: 'Bon rapport qualité-prix',  body: 'Économie de 30 % par rapport au neuf pour une qualité identique. Très contente.', rating: 4, date: 'il y a 2 semaines' },
]

const RATING_BARS = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 14 },
  { stars: 3, pct: 6  },
  { stars: 2, pct: 2  },
  { stars: 1, pct: 0  },
]

const FAQ = [
  { q: "Qu'est-ce qu'un smartphone reconditionné Grade A ?",
    a: "Un appareil Grade A a été inspecté, nettoyé et testé. Il présente peu ou aucune trace d'usure, toutes ses fonctions sont 100 % opérationnelles — batterie, caméra, écran, boutons." },
  { q: "Quelle est la politique de retour ?",
    a: "Vous disposez de 14 jours après réception pour retourner votre appareil sans justification. Le remboursement est effectué sous 5 jours ouvrés." },
  { q: "La garantie couvre-t-elle la batterie ?",
    a: "Oui. La garantie 12 mois inclut la batterie. Si la capacité descend sous 80 % dans l'année, nous la remplaçons sans frais." },
  { q: "Le téléphone est-il débloqué tout opérateur ?",
    a: "Tous nos appareils sont débloqués et compatibles avec tous les opérateurs (Orange, SFR, Bouygues, Free et opérateurs locaux)." },
  { q: "Comment fonctionne le paiement en 4 fois avec Scalapay ?",
    a: "Sélectionnez Scalapay au moment du paiement. Vous payez le premier quart immédiatement, puis 3 prélèvements à 30 jours d'intervalle. Zéro frais, zéro intérêt." },
]

const BENEFITS = [
  { emoji: '💰', title: 'Jusqu\'à −40 %',     body: 'Par rapport au prix neuf, à qualité équivalente.' },
  { emoji: '⚡', title: 'Performances neuves', body: 'Puce, écran, batterie — 100 % opérationnels.' },
  { emoji: '🌱', title: '−70 % CO₂',          body: 'Empreinte carbone réduite vs fabrication neuf.' },
  { emoji: '🔓', title: 'Débloqué',            body: 'Compatible tous opérateurs sans restriction.' },
  { emoji: '🛡️', title: 'Garantie 12 mois',   body: 'Garantie constructeur complète, batterie incluse.' },
  { emoji: '↩️', title: 'Retours 14 j',        body: 'Satisfait ou remboursé, sans condition.' },
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

export default function ProductDetail({ product }: { product: FullProduct }) {
  const { zone }     = useZone()
  const { addItem }  = useCart()
  const ctaRef       = useRef<HTMLDivElement>(null)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [viewers, setViewers] = useState(0)

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

  const selectedVariant  = colorVariants.find(v => v.storage === selectedStorage) ?? colorVariants[0]
  const zonePrice        = selectedVariant?.product_zone_prices?.find(p => zone ? p.zone_id === zone.id : false)
                        ?? selectedVariant?.product_zone_prices?.[0]
  const stockStatus      = selectedVariant ? getStockStatus(selectedVariant.stock) : 'out_of_stock'
  const selectedColorName = variants.find(v => v.color_hex === selectedColor)?.color_name ?? ''
  const scalapay  = zonePrice ? (zonePrice.price / 4).toFixed(2).replace('.', ',') : null
  const discount  = zonePrice?.compare_at_price
    ? Math.round((1 - zonePrice.price / zonePrice.compare_at_price) * 100) : null

  function handleColorSelect(hex: string) {
    setSelectedColor(hex)
    const newStorages = variants.filter(v => v.color_hex === hex).map(v => v.storage)
    if (!newStorages.includes(selectedStorage)) setSelectedStorage(newStorages[0] ?? '')
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
              onClick={() => selectedVariant && addItem(selectedVariant.id)}
              className="jc-btn-primary px-6 py-2.5 text-sm"
            >
              <ShoppingCart size={15} />
              Ajouter au panier
            </button>
            <button disabled={!canBuy} className="jc-btn-ghost px-5 py-2.5 text-sm">
              Acheter maintenant
            </button>
          </div>
        </div>
      </div>

      <div className="jc-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

          {/* ── GALERIE ── */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-3xl aspect-[4/5] flex items-center justify-center p-10 relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg,#f9f5ee 0%,#ede5d4 100%)', border: '1px solid var(--border)' }}
            >
              {/* Grade badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'var(--gold-bg)', border: '1px solid rgba(196,146,42,0.3)', color: 'var(--gold-deep)' }}>
                ✓ Grade A — Comme neuf
              </div>
              <PhoneDisplay colorHex={selectedColor} />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {colors.slice(0, 4).map(v => (
                <button
                  key={v.color_hex}
                  onClick={() => handleColorSelect(v.color_hex)}
                  className="rounded-xl p-2.5 flex-1 flex items-center justify-center transition-all"
                  style={{
                    border: `2px solid ${selectedColor === v.color_hex ? 'var(--gold)' : 'var(--border)'}`,
                    background: selectedColor === v.color_hex ? 'var(--gold-bg)' : 'var(--surface-soft)',
                  }}
                >
                  <svg viewBox="0 0 60 100" className="w-8 h-auto">
                    <rect x="5" y="2" width="50" height="96" rx="10" fill={v.color_hex} opacity="0.85"/>
                    <rect x="9" y="10" width="42" height="72" rx="6" fill="#eee" opacity="0.7"/>
                  </svg>
                </button>
              ))}
            </div>
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
                {colors.map(v => (
                  <button key={v.color_hex} onClick={() => handleColorSelect(v.color_hex)} title={v.color_name}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      background: v.color_hex,
                      boxShadow: selectedColor === v.color_hex
                        ? `0 0 0 2px var(--surface), 0 0 0 4px ${v.color_hex}`
                        : '0 0 0 1.5px rgba(0,0,0,.12)',
                    }} />
                ))}
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
                  {stockStatus === 'in_stock'     && <><CheckCircle size={15} style={{ color: 'var(--success)' }} /><span style={{ color: 'var(--success)' }}>En stock · Expédié sous 24-48 h</span></>}
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
                onClick={() => selectedVariant && addItem(selectedVariant.id)}
                className="jc-btn-primary flex-1 py-3.5 text-sm"
              >
                <ShoppingCart size={16} />
                {stockStatus === 'out_of_stock' ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
              <button disabled={!canBuy} className="jc-btn-ghost flex-1 py-3.5 text-sm">
                <Zap size={16} /> Acheter maintenant
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

        {/* ── POURQUOI RECONDITIONNÉ ── */}
        <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mb-8">
            <p className="jc-overline mb-2">Nos engagements</p>
            <h2 className="font-bold text-2xl">Pourquoi choisir le reconditionné ?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BENEFITS.map(b => (
              <div key={b.title} className="rounded-2xl p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-2xl mb-3 block">{b.emoji}</span>
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
            {FAQ.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
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
            <p className="text-sm leading-relaxed opacity-55 max-w-2xl">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
