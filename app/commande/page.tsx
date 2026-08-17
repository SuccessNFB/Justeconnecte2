'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, MapPin, User, Package } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useZone } from '@/contexts/ZoneContext'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { ProductVariant, Product, Brand, ProductZonePrice } from '@/lib/types'

type EnrichedItem = {
  variantId: string
  quantity: number
  variant: ProductVariant & { product_zone_prices: ProductZonePrice[]; products: Product & { brands: Brand } }
}

type CustomerInfo = {
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
}

const DELIVERY_ZONES = [
  { id: 'martinique', label: 'Martinique' },
  { id: 'guadeloupe', label: 'Guadeloupe' },
  { id: 'guyane', label: 'Guyane' },
]

const inputStyle = {
  border: '1.5px solid var(--border)',
  background: 'var(--surface-soft)',
  outline: 'none',
  width: '100%',
  padding: '10px 12px',
  borderRadius: '12px',
  fontSize: '0.875rem',
}

export default function CommandePage() {
  const router = useRouter()
  const { items } = useCart()
  const { zone } = useZone()
  const [step, setStep] = useState(1)
  const [customer, setCustomer] = useState<CustomerInfo>({ nom: '', prenom: '', email: '', telephone: '', adresse: '' })
  const [deliveryZone, setDeliveryZone] = useState('')
  const [enriched, setEnriched] = useState<EnrichedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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
          items.filter(i => map.has(i.variantId)).map(i => ({ ...i, variant: map.get(i.variantId)! }))
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

  const step1Valid = !!(customer.nom.trim() && customer.prenom.trim() && customer.email.trim() && customer.telephone.trim() && customer.adresse.trim())

  async function handlePayment(method: 'monetico' | 'stripe') {
    setSubmitting(true)

    // Contenu affiché dans l'email de notification (informatif uniquement —
    // le montant réellement facturé est recalculé côté serveur, voir plus bas).
    const lineItems = enriched.map(item => ({
      name:       `${(item.variant as any).products?.name ?? 'Produit'} · ${item.variant.color_name} · ${item.variant.storage}`,
      price:      Math.round((getPrice(item.variant) ?? 0) * 100),
      quantity:   item.quantity,
      image:      (item.variant.images ?? [])[0] ?? (item.variant as any).products?.image_url ?? undefined,
      color_name: item.variant.color_name,
      color_hex:  item.variant.color_hex,
      storage:    item.variant.storage,
    }))

    // Ce qui part au paiement : juste variantId + quantité. Le serveur revient
    // chercher le vrai prix en base — jamais celui envoyé par le navigateur.
    const checkoutItems = enriched.map(item => ({
      variantId: item.variantId,
      quantity:  item.quantity,
    }))

    await fetch('/api/notify-commande', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ customer, deliveryZone, items: lineItems, total: subtotal }),
    }).catch(() => {})

    try {
      const endpoint = method === 'stripe' ? '/api/checkout-stripe' : '/api/checkout'
      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items: checkoutItems, zone: deliveryZone, pricingZoneId: zone?.id, customer }),
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? 'Une erreur est survenue.')
        setSubmitting(false)
        return
      }

      if (data.reference) {
        try { sessionStorage.setItem('jc_ref', data.reference) } catch {}
        try { sessionStorage.setItem('jc_amount', subtotal.toFixed(2)) } catch {}
      }

      // Stripe (Scalapay) — page hébergée par Stripe, simple redirection
      if (method === 'stripe' && data.url) {
        window.location.href = data.url
        return
      }

      // Monetico — soumission d'un formulaire caché vers la page de paiement
      if (data.action && data.fields) {
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
        setSubmitting(false)
      }
    } catch {
      alert('Impossible de joindre le serveur. Réessayez.')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="py-24 text-center" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>Chargement…</div>
  )

  if (!items.length) {
    router.replace('/panier')
    return null
  }

  const stepLabels = ['Coordonnées', 'Zone de livraison', 'Récapitulatif']

  return (
    <div className="py-12">
      <div className="jc-container" style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: step >= s ? 'var(--gold-deep)' : 'var(--surface-soft)',
                    color: step >= s ? '#fff' : 'oklch(0.18 0.004 264 / 0.35)',
                  }}
                >
                  {s}
                </div>
                <span
                  className="text-xs font-semibold hidden sm:block"
                  style={{ color: step === s ? 'var(--gold-deep)' : 'oklch(0.18 0.004 264 / 0.4)' }}
                >
                  {stepLabels[s - 1]}
                </span>
              </div>
              {s < 3 && (
                <div
                  className="flex-1 h-0.5 ml-2"
                  style={{ background: step > s ? 'var(--gold-deep)' : 'var(--border)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1 — Personal info ── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Vos coordonnées</h1>
            <div className="jc-card p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>Prénom *</label>
                  <input
                    type="text"
                    value={customer.prenom}
                    onChange={e => setCustomer(c => ({ ...c, prenom: e.target.value }))}
                    style={inputStyle}
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>Nom *</label>
                  <input
                    type="text"
                    value={customer.nom}
                    onChange={e => setCustomer(c => ({ ...c, nom: e.target.value }))}
                    style={inputStyle}
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>Email *</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))}
                  style={inputStyle}
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>Téléphone *</label>
                <input
                  type="tel"
                  value={customer.telephone}
                  onChange={e => setCustomer(c => ({ ...c, telephone: e.target.value }))}
                  style={inputStyle}
                  placeholder="+596 696 00 00 00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>Adresse *</label>
                <input
                  type="text"
                  value={customer.adresse}
                  onChange={e => setCustomer(c => ({ ...c, adresse: e.target.value }))}
                  style={inputStyle}
                  placeholder="12 rue des Flamboyants"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.push('/panier')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-black/5"
                style={{ border: '1.5px solid var(--border)' }}
              >
                <ChevronLeft size={15} /> Panier
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!step1Valid}
                className="jc-btn-primary flex-1"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Delivery zone ── */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Secteur de livraison</h1>
            <div className="flex flex-col gap-3">
              {DELIVERY_ZONES.map(z => (
                <button
                  key={z.id}
                  onClick={() => setDeliveryZone(z.id)}
                  className="jc-card p-5 flex items-center gap-4 text-left transition-all w-full"
                  style={{
                    border: deliveryZone === z.id ? '2px solid var(--gold-deep)' : '1.5px solid var(--border)',
                    background: deliveryZone === z.id ? 'oklch(0.96 0.025 80 / 0.4)' : undefined,
                  }}
                >
                  <div
                    className="shrink-0 rounded-full"
                    style={{
                      width: 20, height: 20,
                      border: deliveryZone === z.id ? '6px solid var(--gold-deep)' : '2px solid var(--border)',
                    }}
                  />
                  <div>
                    <p className="font-semibold">{z.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
                      Livraison gratuite · Taxes et octroi de mer inclus
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-black/5"
                style={{ border: '1.5px solid var(--border)' }}
              >
                <ChevronLeft size={15} /> Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!deliveryZone}
                className="jc-btn-primary flex-1"
              >
                Voir le récapitulatif →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Recap ── */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Récapitulatif</h1>

            {/* Customer info */}
            <div className="jc-card p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <User size={14} style={{ color: 'var(--gold-deep)' }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'oklch(0.18 0.004 264 / 0.45)' }}>
                  Vos coordonnées
                </span>
              </div>
              <p className="font-semibold">{customer.prenom} {customer.nom}</p>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>{customer.email}</p>
              <p className="text-sm" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>{customer.telephone}</p>
              {customer.adresse && (
                <p className="text-sm" style={{ color: 'oklch(0.18 0.004 264 / 0.6)' }}>{customer.adresse}</p>
              )}
            </div>

            {/* Delivery zone */}
            <div className="jc-card p-5 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} style={{ color: 'var(--gold-deep)' }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'oklch(0.18 0.004 264 / 0.45)' }}>
                  Zone de livraison
                </span>
              </div>
              <p className="font-semibold">{DELIVERY_ZONES.find(z => z.id === deliveryZone)?.label}</p>
            </div>

            {/* Products */}
            <div className="jc-card p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Package size={14} style={{ color: 'var(--gold-deep)' }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'oklch(0.18 0.004 264 / 0.45)' }}>
                  Articles ({enriched.reduce((s, i) => s + i.quantity, 0)})
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {enriched.map(item => {
                  const price = getPrice(item.variant)
                  const img = (item.variant.images ?? []).find(Boolean) ?? (item.variant as any).products?.image_url
                  return (
                    <div key={item.variantId} className="flex gap-3 items-center">
                      {img ? (
                        <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden" style={{ background: 'var(--surface-soft)' }}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className="shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                          style={{ background: 'var(--surface-soft)' }}
                        >
                          <svg viewBox="0 0 60 100" className="w-9 h-auto" fill="none">
                            <rect x="5" y="2" width="50" height="96" rx="8" fill={item.variant.color_hex} opacity="0.9"/>
                            <rect x="9" y="8" width="42" height="72" rx="4" fill="oklch(0.88 0.002 247)"/>
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold" style={{ color: 'var(--gold-deep)' }}>
                          {(item.variant as any).products?.brands?.name}
                        </p>
                        <p className="font-medium text-sm truncate">{(item.variant as any).products?.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
                          {item.variant.color_name} · {item.variant.storage}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm">{price !== null ? formatPrice(price * item.quantity) : '—'}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>×{item.quantity}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div
                className="flex justify-between items-center pt-4 mt-4 font-bold text-base"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>
                Livraison gratuite · Taxes et octroi de mer inclus
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-black/5"
                style={{ border: '1.5px solid var(--border)' }}
              >
                <ChevronLeft size={15} /> Retour
              </button>
              <button
                onClick={() => handlePayment('monetico')}
                disabled={submitting}
                className="jc-btn-primary flex-1"
              >
                {submitting ? 'Redirection…' : 'Payer en 1 fois →'}
              </button>
            </div>
            <button
              onClick={() => handlePayment('stripe')}
              disabled={submitting}
              className="jc-btn-ghost w-full mt-2.5"
            >
              Payer en 4× sans frais avec Scalapay
            </button>
            <p className="text-xs text-center mt-3" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>
              🔒 Paiement sécurisé — SSL
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
