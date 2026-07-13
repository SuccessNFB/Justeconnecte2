'use client'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, MapPin, Clock, CheckCircle, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type OrderItem = {
  name:        string
  price:       number
  quantity:    number
  image?:      string
  color_name?: string
  color_hex?:  string
  storage?:    string
}

type Order = {
  id:                 string
  reference:          string
  status:             string
  customer_prenom:    string
  customer_nom:       string
  customer_email:     string
  customer_telephone: string
  customer_adresse:   string
  delivery_zone:      string
  items:              OrderItem[]
  total_eur:          number
  created_at:         string
  paid_at:            string | null
}

const ZONE_LABEL: Record<string, string> = {
  martinique: 'Martinique',
  guadeloupe: 'Guadeloupe',
  guyane:     'Guyane',
}

function relTime(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (d < 1)  return 'à l\'instant'
  if (d < 60) return `il y a ${d} min`
  const h = Math.floor(d / 60)
  if (h < 24) return `il y a ${h}h`
  const days = Math.floor(h / 24)
  if (days < 30) return `il y a ${days}j`
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === 'paid'
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        background: isPaid ? 'rgba(22,163,74,0.1)' : 'rgba(234,179,8,0.1)',
        color:      isPaid ? '#16a34a'              : '#ca8a04',
      }}
    >
      {isPaid ? <CheckCircle size={11} /> : <Clock size={11} />}
      {isPaid ? 'Payé' : 'En attente'}
    </span>
  )
}

export default function CommandesPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function fetchOrders() {
    setLoading(true)
    setError(false)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    if (err) { setError(true); setLoading(false); return }
    setOrders((data ?? []) as Order[])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const paid    = orders.filter(o => o.status === 'paid')
  const pending = orders.filter(o => o.status !== 'paid')
  const totalCA = paid.reduce((s, o) => s + Number(o.total_eur), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Commandes</h1>
          <p className="text-sm mt-0.5" style={{ opacity: 0.45 }}>
            Toutes les commandes clients avec leurs coordonnées
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-black/5"
          style={{ border: '1.5px solid var(--border)' }}
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total commandes', value: orders.length, color: 'var(--gold-deep)' },
          { label: 'Payées',          value: paid.length,   color: '#16a34a' },
          { label: 'CA confirmé',
            value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalCA),
            color: '#16a34a' },
        ].map(k => (
          <div key={k.label} className="jc-card p-4">
            <p className="text-xs font-medium mb-1" style={{ opacity: 0.45 }}>{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="jc-card p-6 mb-6 text-center" style={{ borderColor: 'var(--destructive)' }}>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--destructive)' }}>
            Table orders introuvable
          </p>
          <p className="text-xs opacity-50">
            Appliquez la migration <code>014_orders.sql</code> dans Supabase → SQL Editor.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="jc-card p-12 text-center">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-15" />
          <p className="font-medium opacity-40">Aucune commande pour l'instant</p>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map(order => {
            const isOpen = expanded === order.id
            return (
              <div
                key={order.id}
                className="jc-card overflow-hidden"
                style={{ borderLeft: order.status === 'paid' ? '3px solid #16a34a' : '3px solid #ca8a04' }}
              >
                {/* Header row — always visible */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full p-5 flex items-center gap-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{order.customer_prenom} {order.customer_nom}</span>
                      <StatusBadge status={order.status} />
                      {order.delivery_zone && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-soft)', color: 'oklch(0.18 0.004 264 / 0.6)' }}>
                          {ZONE_LABEL[order.delivery_zone] ?? order.delivery_zone}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
                      <span>{order.customer_email}</span>
                      <span>·</span>
                      <span>{order.customer_telephone}</span>
                      <span>·</span>
                      <span>{relTime(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold text-lg">{formatPrice(Number(order.total_eur))}</p>
                    <p className="text-xs font-mono" style={{ opacity: 0.3 }}>{order.reference}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ opacity: 0.3 }}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0" style={{ borderBottom: '1px solid var(--border)' }}>

                      {/* Customer info */}
                      <div className="p-5" style={{ borderRight: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-1.5 mb-3">
                          <User size={13} style={{ color: 'var(--gold-deep)' }} />
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ opacity: 0.4 }}>Client</span>
                        </div>
                        <div className="flex flex-col gap-1.5 text-sm">
                          <p><span className="font-semibold">{order.customer_prenom} {order.customer_nom}</span></p>
                          <p style={{ opacity: 0.6 }}>{order.customer_email}</p>
                          <p style={{ opacity: 0.6 }}>{order.customer_telephone}</p>
                          {order.customer_adresse && <p style={{ opacity: 0.6 }}>{order.customer_adresse}</p>}
                        </div>
                      </div>

                      {/* Delivery + dates */}
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 mb-3">
                          <MapPin size={13} style={{ color: 'var(--gold-deep)' }} />
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ opacity: 0.4 }}>Livraison</span>
                        </div>
                        <p className="font-semibold text-sm mb-3">{ZONE_LABEL[order.delivery_zone] ?? order.delivery_zone}</p>
                        <div className="text-xs flex flex-col gap-1" style={{ opacity: 0.5 }}>
                          <p>Créée : {new Date(order.created_at).toLocaleString('fr-FR', { timeZone: 'America/Martinique' })}</p>
                          {order.paid_at && (
                            <p>Payée : {new Date(order.paid_at).toLocaleString('fr-FR', { timeZone: 'America/Martinique' })}</p>
                          )}
                          <p className="font-mono">Réf. : {order.reference}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ opacity: 0.4 }}>Articles</p>
                      <div className="flex flex-col gap-2">
                        {(order.items ?? []).map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {item.image ? (
                              <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden" style={{ background: 'var(--surface-soft)' }}>
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-soft)' }}>
                                <svg viewBox="0 0 60 100" className="w-7 h-auto" fill="none">
                                  <rect x="5" y="2" width="50" height="96" rx="8" fill={item.color_hex ?? '#ccc'} opacity="0.9"/>
                                  <rect x="9" y="8" width="42" height="72" rx="4" fill="oklch(0.88 0.002 247)"/>
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-sm">
                              <p className="font-medium truncate">
                                {/* Product name without color/storage suffix */}
                                {item.name.split(' · ')[0]}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.color_hex && (
                                  <span
                                    className="inline-block w-3 h-3 rounded-full border"
                                    style={{ background: item.color_hex, borderColor: 'var(--border)' }}
                                  />
                                )}
                                {item.color_name && (
                                  <span className="text-xs" style={{ opacity: 0.6 }}>{item.color_name}</span>
                                )}
                                {item.storage && (
                                  <>
                                    <span className="text-xs" style={{ opacity: 0.3 }}>·</span>
                                    <span
                                      className="text-xs font-semibold px-1.5 py-0.5 rounded"
                                      style={{ background: 'var(--surface-soft)', opacity: 0.8 }}
                                    >
                                      {item.storage}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 text-right text-sm">
                              <p className="font-bold">{formatPrice((item.price * item.quantity) / 100)}</p>
                              {item.quantity > 1 && (
                                <p className="text-xs" style={{ opacity: 0.4 }}>×{item.quantity}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className="flex justify-between items-center pt-3 mt-3 font-bold"
                        style={{ borderTop: '1px solid var(--border)' }}
                      >
                        <span>Total</span>
                        <span>{formatPrice(Number(order.total_eur))}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
