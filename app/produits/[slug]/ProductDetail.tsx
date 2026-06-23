'use client'
import { useState } from 'react'
import { ShoppingCart, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useZone } from '@/contexts/ZoneContext'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, getStockStatus } from '@/lib/utils'
import type { Brand, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
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

  function handleColorSelect(hex: string) {
    setSelectedColor(hex)
    const newStorages = variants.filter(v => v.color_hex === hex).map(v => v.storage)
    if (!newStorages.includes(selectedStorage)) setSelectedStorage(newStorages[0] ?? '')
  }

  const selectedColorName = variants.find(v => v.color_hex === selectedColor)?.color_name ?? ''

  return (
    <div className="py-12">
      <div className="jc-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* ── IMAGE ── */}
          <div>
            <div
              className="rounded-3xl aspect-square flex items-center justify-center p-16"
              style={{
                background: 'radial-gradient(ellipse at 50% 40%, oklch(0.745 0.085 78 / 0.10) 0%, var(--surface) 70%)',
                border: '1px solid var(--border)',
              }}
            >
              <svg viewBox="0 0 120 200" className="w-56 h-auto" fill="none">
                <rect x="10" y="5" width="100" height="190" rx="16" fill="var(--primary)" opacity="0.08"/>
                <rect x="14" y="9" width="92" height="182" rx="13" fill="var(--primary)" opacity="0.12"/>
                <rect x="18" y="13" width="84" height="174" rx="10"
                  fill={selectedColor || 'var(--primary)'} opacity="0.85"/>
                <rect x="22" y="20" width="76" height="140" rx="6" fill="oklch(0.88 0.002 247)"/>
                <circle cx="60" cy="173" r="8" fill="oklch(0.75 0.002 247)"/>
              </svg>
            </div>
          </div>

          {/* ── INFO ── */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--gold-deep)' }}>
                {product.brands?.name}
              </p>
              <h1 className="text-4xl font-bold leading-tight mb-2">{product.name}</h1>
              {product.badge && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                  style={{ background: 'var(--gold-deep)' }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Sélecteur couleur */}
            <div>
              <p className="text-sm font-semibold mb-2">
                Couleur — <span className="font-normal opacity-60">{selectedColorName}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {colors.map(v => (
                  <button
                    key={v.color_hex}
                    onClick={() => handleColorSelect(v.color_hex)}
                    title={v.color_name}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      background: v.color_hex,
                      boxShadow: selectedColor === v.color_hex
                        ? `0 0 0 3px var(--surface), 0 0 0 5px ${v.color_hex}`
                        : '0 0 0 1.5px oklch(0.18 0.004 264 / 0.15)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sélecteur stockage */}
            <div>
              <p className="text-sm font-semibold mb-2">Stockage</p>
              <div className="flex gap-2 flex-wrap">
                {storages.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStorage(s)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: selectedStorage === s ? 'var(--primary)' : 'var(--surface)',
                      color: selectedStorage === s ? '#fff' : 'inherit',
                      border: '1.5px solid ' + (selectedStorage === s ? 'var(--primary)' : 'var(--border)'),
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Prix */}
            {zonePrice && (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">{formatPrice(zonePrice.price)}</span>
                {zonePrice.compare_at_price && (
                  <span className="text-lg line-through" style={{ color: 'oklch(0.18 0.004 264 / 0.35)' }}>
                    {formatPrice(zonePrice.compare_at_price)}
                  </span>
                )}
                {zonePrice.compare_at_price && (
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded-md"
                    style={{ background: 'oklch(0.72 0.18 145 / 0.12)', color: 'var(--success)' }}
                  >
                    -{Math.round((1 - zonePrice.price / zonePrice.compare_at_price) * 100)}%
                  </span>
                )}
              </div>
            )}

            {/* SKU */}
            {selectedVariant && (
              <p className="font-mono text-xs" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>
                SKU : {selectedVariant.sku}
              </p>
            )}

            {/* Stock */}
            {selectedVariant && (
              <div className="flex items-center gap-2 text-sm font-medium">
                {stockStatus === 'in_stock'    && <><CheckCircle size={16} style={{ color: 'var(--success)' }} /><span style={{ color: 'var(--success)' }}>En stock</span></>}
                {stockStatus === 'low_stock'   && <><AlertTriangle size={16} style={{ color: 'var(--warning)' }} /><span style={{ color: 'var(--warning)' }}>Stock faible ({selectedVariant.stock} restants)</span></>}
                {stockStatus === 'out_of_stock'&& <><XCircle size={16} style={{ color: 'var(--destructive)' }} /><span style={{ color: 'var(--destructive)' }}>Rupture de stock</span></>}
              </div>
            )}

            {/* CTA */}
            <button
              disabled={stockStatus === 'out_of_stock' || !selectedVariant}
              onClick={() => selectedVariant && addItem(selectedVariant.id)}
              className="jc-btn-primary text-base py-4 w-full sm:w-auto"
            >
              <ShoppingCart size={18} />
              {stockStatus === 'out_of_stock' ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="font-semibold text-base mb-2">Description</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h2 className="font-semibold text-base mb-3">Caractéristiques</h2>
                <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-2 pr-4 font-medium w-40 align-top" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>{key}</td>
                        <td className="py-2">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
