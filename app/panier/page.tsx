'use client'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useZone } from '@/contexts/ZoneContext'
import { createClient } from '@/lib/supabase'
import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import type { ProductVariant, Product, Brand, ProductZonePrice } from '@/lib/types'

export const dynamic = 'force-dynamic'

type EnrichedItem = {
  variantId: string
  quantity: number
  variant: ProductVariant & { product_zone_prices: ProductZonePrice[]; products: Product & { brands: Brand } }
}

export default function PanierPage() {
  const { items, updateQuantity, removeItem } = useCart()
  const { zone } = useZone()
  const [enriched,      setEnriched]      = useState<EnrichedItem[]>([])
  const [loading,       setLoading]       = useState(true)
  const [checkingOut,   setCheckingOut]   = useState(false)
  const [installments,  setInstallments]  = useState<1 | 2 | 3 | 4>(1)
  const tracked = useRef(false)

  // Track checkout_start + email notification once per page load (when cart is non-empty)
  useEffect(() => {
    if (tracked.current || !items.length) return
    tracked.current = true
    trackEvent('checkout_start', { zone: zone?.name })
    fetch('/api/notify-sale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone: zone?.name, items: items.length }),
    }).catch(() => {})
  }, [items.length])

  useEffect(() => {
    if (!items.length) { setLoading(false); return }
    const supabase = createClient()
    const ids = items.map(i => i.variantId)
    supabase
      .from('product_variants')
      .select(`*, product_zone_prices(*), products(*, brands(*))`)
      .in('id', ids)
      .then(({ data }) => {
        if (!data) { setLoading(false); return }
        const map = new Map(data.map((v: any) => [v.id, v]))
        setEnriched(
          items
            .filter(i => map.has(i.variantId))
            .map(i => ({ ...i, variant: map.get(i.variantId)! }))
        )
        setLoading(false)
      })
  }, [items])

  function getPrice(v: EnrichedItem['variant']): number | null {
    const p = zone
      ? (v.product_zone_prices.find(p => p.zone_id === zone.id) ?? v.product_zone_prices[0])
      : v.product_zone_prices[0]
    return p?.price ?? null
  }

  const subtotal = enriched.reduce((s, i) => s + (getPrice(i.variant) ?? 0) * i.quantity, 0)
  const shipping = 0

  async function handleCheckout() {
    setCheckingOut(true)
    const lineItems = enriched.map(item => ({
      name:     `${(item.variant as any).products?.name ?? 'Produit'} · ${item.variant.color_name} · ${item.variant.storage}`,
      price:    Math.round((getPrice(item.variant) ?? 0) * 100),
      quantity: item.quantity,
      image:    (item.variant as any).products?.image_url ?? undefined,
    }))
    try {
      const res  = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items: lineItems, zone: zone?.name, installments }),
      })
      const data = await res.json()

      if (data.action && data.fields) {
        // Monetico — stocker le montant pour la page merci
        if (data.reference) {
          try { sessionStorage.setItem('jc_ref', data.reference) } catch {}
          try { sessionStorage.setItem('jc_amount', (subtotal).toFixed(2)) } catch {}
        }
        // Soumettre le formulaire Monetico (POST requis)
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.action
        form.style.display = 'none'
        Object.entries(data.fields as Record<string, string>).forEach(([name, value]) => {
          const input = document.createElement('input')
          input.type  = 'hidden'
          input.name  = name
          input.value = value
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
      } else {
        alert(data.error ?? 'Une erreur est survenue.')
        setCheckingOut(false)
      }
    } catch {
      alert('Impossible de joindre le serveur. Réessayez.')
      setCheckingOut(false)
    }
  }

  if (loading) return (
    <div className="py-24 text-center" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>Chargement…</div>
  )

  if (!items.length) return (
    <div className="py-32 text-center">
      <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
      <p className="text-xl font-medium mb-2">Votre panier est vide</p>
      <p className="text-sm mb-8" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
        Ajoutez des produits depuis notre boutique.
      </p>
      <Link href="/boutique" className="jc-btn-primary">Voir la boutique</Link>
    </div>
  )

  return (
    <div className="py-12">
      <div className="jc-container">
        <h1 className="text-3xl font-bold mb-10">Votre panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── ARTICLES ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {enriched.map(item => {
              const price = getPrice(item.variant)
              const priceStr = price !== null ? formatPrice(price * item.quantity) : '—'
              return (
                <div key={item.variantId} className="jc-card p-5 flex gap-5">
                  {/* Product image */}
                  {(() => {
                    const img = (item.variant.images ?? []).find(Boolean)
                      ?? (item.variant as any).products?.image_url
                    return img ? (
                      <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden" style={{ background: 'var(--surface-soft)' }}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className="shrink-0 w-20 h-20 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--surface-soft)' }}
                      >
                        <svg viewBox="0 0 60 100" className="w-10 h-auto" fill="none">
                          <rect x="5" y="2" width="50" height="96" rx="8" fill={item.variant.color_hex} opacity="0.9"/>
                          <rect x="9" y="8" width="42" height="72" rx="4" fill="oklch(0.88 0.002 247)"/>
                        </svg>
                      </div>
                    )
                  })()}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--gold-deep)' }}>
                      {(item.variant as any).products?.brands?.name}
                    </p>
                    <p className="font-semibold truncate">{(item.variant as any).products?.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
                      {item.variant.color_name} · {item.variant.storage}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5"
                          style={{ border: '1px solid var(--border)' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5"
                          style={{ border: '1px solid var(--border)' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold">{priceStr}</span>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1.5 rounded-lg opacity-30 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── RÉCAPITULATIF ── */}
          <div className="lg:col-span-1">
            <div className="jc-card p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-5">Récapitulatif</h2>

              <div className="flex flex-col gap-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>Sous-total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>Livraison · Taxes et octroi de mer inclus</span>
                  <span className="font-medium" style={{ color: 'var(--success)' }}>Gratuit</span>
                </div>
                <div
                  className="flex justify-between pt-3 font-bold text-base"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span>Total</span>
                  <span>{formatPrice(subtotal + shipping)}</span>
                </div>
              </div>

              {/* Installment selector */}
              <div className="mb-5">
                <p className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>
                  Mode de paiement
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {([1, 2] as const).map(n => {
                    const perMonth = n === 1 ? null : formatPrice((subtotal + shipping) / n)
                    const isActive = installments === n
                    return (
                      <button
                        key={n}
                        onClick={() => setInstallments(n)}
                        className="py-2 rounded-xl text-center transition-all"
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          border: isActive ? '2px solid var(--gold-deep)' : '1.5px solid var(--border)',
                          background: isActive ? 'var(--gold-deep)' : 'transparent',
                          color: isActive ? '#fff' : 'inherit',
                        }}
                      >
                        <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>
                          {n === 1 ? '1×' : `${n}×`}
                        </span>
                        {perMonth && (
                          <span style={{ display: 'block', opacity: 0.85, marginTop: '1px' }}>
                            {perMonth}
                          </span>
                        )}
                        {n === 1 && (
                          <span style={{ display: 'block', opacity: 0.7, marginTop: '1px' }}>
                            Comptant
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut || !enriched.length}
                className="jc-btn-primary w-full"
              >
                {checkingOut ? 'Redirection…' : installments === 1 ? 'Passer la commande →' : `Payer en ${installments}× →`}
              </button>

              <p className="text-xs text-center mt-3" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>
                🔒 Paiement sécurisé — SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
