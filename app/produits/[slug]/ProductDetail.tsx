'use client'
import { useState } from 'react'
import { ShoppingCart, Zap, Truck, Award, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useZone } from '@/contexts/ZoneContext'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, getStockStatus } from '@/lib/utils'
import type { Brand, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

const PAYMENT = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Scalapay']

const DELIVERY = [
  { zone: 'Guadeloupe / Martinique', standard: 'J+3 à J+5', express: 'J+1 à J+2', free: '150 €' },
  { zone: 'Guyane',                  standard: 'J+6 à J+7', express: 'J+2 à J+3', free: '200 €' },
]

const REVIEWS = [
  { name: 'Marc S.', note: 'Livraison rapide en Guadeloupe', body: 'Reçu en 3 jours à Pointe à Pitre, emballage parfait et produit conforme.', rating: 5 },
  { name: 'Sandrine T.', note: 'Excellent service', body: 'Service client très réactif sur WhatsApp, je recommande sans hésiter.', rating: 5 },
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
      <circle cx="40" cy="60" r="7" fill="#1a1a1a" opacity="0.75"/>
      <circle cx="62" cy="60" r="11" fill="#111" opacity="0.65"/>
      <circle cx="62" cy="60" r="7" fill="#1a1a1a" opacity="0.75"/>
      <circle cx="51" cy="84" r="5" fill="#111" opacity="0.3"/>
      <rect x="80" y="328" width="40" height="6" rx="3" fill={colorHex || '#b8a888'} opacity="0.5"/>
    </svg>
  )
}

export default function ProductDetail({ product }: { product: FullProduct }) {
  const { zone } = useZone()
  const { addItem } = useCart()

  const variants = product.product_variants ?? []
  const colorMap = new Map(variants.map(v => [v.color_hex, v]))
  const colors = Array.from(colorMap.values())

  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.color_hex ?? '')
  const colorVariants = variants.filter(v => v.color_hex === selectedColor)
  const storages = colorVariants.map(v => v.storage)
  const [selectedStorage, setSelectedStorage] = useState<string>(storages[0] ?? '')

  const selectedVariant = colorVariants.find(v => v.storage === selectedStorage) ?? colorVariants[0]

  const zonePrice = selectedVariant?.product_zone_prices?.find(p =>
    zone ? p.zone_id === zone.id : false
  ) ?? selectedVariant?.product_zone_prices?.[0]

  const stockStatus = selectedVariant ? getStockStatus(selectedVariant.stock) : 'out_of_stock'
  const selectedColorName = variants.find(v => v.color_hex === selectedColor)?.color_name ?? ''

  const scalapay = zonePrice ? (zonePrice.price / 4).toFixed(2).replace('.', ',') : null
  const discount = zonePrice?.compare_at_price
    ? Math.round((1 - zonePrice.price / zonePrice.compare_at_price) * 100) : null

  function handleColorSelect(hex: string) {
    setSelectedColor(hex)
    const newStorages = variants.filter(v => v.color_hex === hex).map(v => v.storage)
    if (!newStorages.includes(selectedStorage)) setSelectedStorage(newStorages[0] ?? '')
  }

  return (
    <div className="py-10">
      <div className="jc-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          {/* ── GALERIE ── */}
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl aspect-[4/5] flex items-center justify-center p-10"
              style={{ background: 'linear-gradient(160deg,#f9f5ee 0%,#ede5d4 100%)', border: '1px solid var(--border)' }}>
              <PhoneDisplay colorHex={selectedColor} />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {colors.slice(0, 4).map(v => (
                <button
                  key={v.color_hex}
                  onClick={() => handleColorSelect(v.color_hex)}
                  className="rounded-xl p-2.5 flex-1 flex items-center justify-center"
                  style={{
                    border: `2px solid ${selectedColor === v.color_hex ? 'var(--gold)' : 'var(--border)'}`,
                    background: 'var(--surface-soft)',
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
            {/* Stars */}
            <div className="flex items-center gap-1.5">
              <span className="jc-stars">★★★★★</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>4.8</span>
              <span className="text-sm opacity-40">· 42 avis</span>
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
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-bold" style={{ fontSize: '2rem' }}>{formatPrice(zonePrice.price)}</span>
                  {zonePrice.compare_at_price && (
                    <>
                      <span className="text-base line-through opacity-30">{formatPrice(zonePrice.compare_at_price)}</span>
                      {discount && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(196,146,42,.12)', color: 'var(--gold-deep)' }}>
                          -{discount}%
                        </span>
                      )}
                    </>
                  )}
                </div>
                {zone && (
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--gold)' }}>
                    Prix pour {zone.label.replace(/\s🇲🇶|🇬🇵|🇬🇫|🇸🇽/g,'').trim()}
                  </p>
                )}
                {scalapay && (
                  <p className="text-xs opacity-45">
                    ou 4× {scalapay} € sans frais avec Scalapay
                  </p>
                )}
                {/* Payment logos */}
                <div className="flex gap-2 flex-wrap mt-2">
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
                  <button key={v.color_hex} onClick={() => handleColorSelect(v.color_hex)}
                    title={v.color_name}
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
                      color: selectedStorage === s ? '#fff' : 'inherit',
                      border: `1.5px solid ${selectedStorage === s ? 'var(--primary)' : 'var(--border-strong)'}`,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            {selectedVariant && (
              <div className="flex items-center gap-2 text-sm font-medium">
                {stockStatus === 'in_stock'     && <><CheckCircle size={15} style={{ color: 'var(--success)' }} /><span style={{ color: 'var(--success)' }}>En stock · Expédié sous 24-48 h</span></>}
                {stockStatus === 'low_stock'    && <><AlertTriangle size={15} style={{ color: 'var(--warning)' }} /><span style={{ color: 'var(--warning)' }}>Stock faible ({selectedVariant.stock} restants)</span></>}
                {stockStatus === 'out_of_stock' && <><XCircle size={15} style={{ color: 'var(--destructive)' }} /><span style={{ color: 'var(--destructive)' }}>Rupture de stock</span></>}
              </div>
            )}

            {/* SKU */}
            {selectedVariant && (
              <p className="font-mono text-[11px] opacity-30">SKU : {selectedVariant.sku}</p>
            )}

            {/* CTAs */}
            <div className="flex gap-3">
              <button
                disabled={stockStatus === 'out_of_stock' || !selectedVariant}
                onClick={() => selectedVariant && addItem(selectedVariant.id)}
                className="jc-btn-primary flex-1 py-3.5 text-sm"
              >
                <ShoppingCart size={16} />
                {stockStatus === 'out_of_stock' ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
              <button
                disabled={stockStatus === 'out_of_stock' || !selectedVariant}
                className="jc-btn-ghost flex-1 py-3.5 text-sm"
              >
                <Zap size={16} /> Acheter maintenant
              </button>
            </div>

            {/* Mini trust */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Truck, label: 'Livraison express', sub: 'Antilles J+1, Guyane J+2' },
                { icon: Award, label: 'Garantie 12 mois',  sub: 'Garantie constructeur officielle' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex gap-2.5 text-xs p-3 rounded-xl"
                  style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
                  <Icon size={16} style={{ color: 'var(--gold)' }} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5">{label}</p>
                    <p className="opacity-45">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SPECS ── */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="font-bold text-xl mb-6">Caractéristiques techniques</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {Object.entries(product.specs).map(([key, val], i) => (
                <div key={key}
                  className="flex text-sm"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div className="w-44 px-5 py-3.5 font-medium opacity-40 shrink-0"
                    style={{ background: 'var(--surface-soft)' }}>{key}</div>
                  <div className="px-5 py-3.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LIVRAISON ── */}
        <div className="mt-12 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <h2 className="font-bold text-xl mb-6">Livraison Antilles et Guyane</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="grid grid-cols-4 text-[11px] font-bold uppercase tracking-widest px-5 py-3"
              style={{ background: 'var(--surface-soft)', borderBottom: '1px solid var(--border)', opacity: 0.5 }}>
              <span>Zone</span><span>Standard</span><span>Express</span><span>Gratuite dès</span>
            </div>
            {DELIVERY.map(row => (
              <div key={row.zone} className="grid grid-cols-4 px-5 py-4 text-sm"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="font-medium">{row.zone}</span>
                <span className="opacity-55">{row.standard}</span>
                <span className="opacity-55">{row.express}</span>
                <span className="font-semibold" style={{ color: 'var(--gold)' }}>{row.free}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── AVIS ── */}
        <div className="mt-12 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-bold text-xl">Avis clients</h2>
            <span className="jc-stars text-sm">★★★★★</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>4.7</span>
            <span className="text-xs opacity-35">· 1 avis</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVIEWS.map(r => (
              <div key={r.name} className="rounded-2xl p-5"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wide opacity-40">{r.note}</span>
                  <span className="text-[10px] font-medium text-green-600">Achat vérifié</span>
                </div>
                <p className="text-sm opacity-60 mb-3">{r.body}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium opacity-40">{r.name}</span>
                  <span className="jc-stars text-xs">{'★'.repeat(r.rating)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="font-bold text-xl mb-4">Description</h2>
            <p className="text-sm leading-relaxed opacity-55 max-w-2xl">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
