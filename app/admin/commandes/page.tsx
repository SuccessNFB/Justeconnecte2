'use client'
import { useEffect, useState, useMemo } from 'react'
import { ShoppingBag, User, MapPin, Clock, CheckCircle, RefreshCw, Archive, ArchiveRestore, Search, SlidersHorizontal, X, BadgeCheck } from 'lucide-react'
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
  archived:           boolean
  customer_prenom:    string
  customer_nom:       string
  customer_email:     string
  customer_telephone: string
  customer_adresse:   string
  delivery_zone:      string
  payment_method:     string
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
  if (d < 1)  return "à l'instant"
  if (d < 60) return `il y a ${d} min`
  const h = Math.floor(d / 60)
  if (h < 24) return `il y a ${h}h`
  const days = Math.floor(h / 24)
  if (days < 30) return `il y a ${days}j`
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status, archived }: { status: string; archived: boolean }) {
  if (status === 'validated') return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
      <BadgeCheck size={11} /> Validée
    </span>
  )
  if (archived) return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(100,100,100,0.1)', color: '#888' }}>
      <Archive size={11} /> Archivé
    </span>
  )
  const isPaid = status === 'paid'
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        background: isPaid ? 'rgba(22,163,74,0.1)' : 'rgba(234,179,8,0.1)',
        color:      isPaid ? '#16a34a'              : '#ca8a04',
      }}>
      {isPaid ? <CheckCircle size={11} /> : <Clock size={11} />}
      {isPaid ? 'Payé' : 'En attente'}
    </span>
  )
}

const selectStyle: React.CSSProperties = {
  border:       '1.5px solid var(--border)',
  background:   'var(--surface-soft)',
  borderRadius: 10,
  padding:      '6px 10px',
  fontSize:     '0.8rem',
  fontWeight:   600,
  outline:      'none',
  cursor:       'pointer',
}

export default function CommandesPage() {
  const [orders,       setOrders]       = useState<Order[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(false)
  const [expanded,     setExpanded]     = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const [searchNom,     setSearchNom]     = useState('')
  const [searchProduit, setSearchProduit] = useState('')
  const [filterZone,    setFilterZone]    = useState('all')
  const [filterStatut,  setFilterStatut]  = useState('all')
  const [filterDate,    setFilterDate]    = useState('all')

  const supabase = createClient()

  async function fetchOrders() {
    setLoading(true); setError(false)
    const { data, error: err } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false }).limit(500)
    if (err) { setError(true); setLoading(false); return }
    setOrders((data ?? []) as Order[])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  async function toggleArchive(order: Order) {
    await supabase.from('orders').update({ archived: !order.archived }).eq('id', order.id)
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, archived: !o.archived } : o))
    if (expanded === order.id) setExpanded(null)
  }

  async function validateOrder(order: Order) {
    await supabase.from('orders').update({ status: 'validated', archived: true }).eq('id', order.id)
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'validated', archived: true } : o))
    setExpanded(null)
  }

  const hasFilters = !!(searchNom || searchProduit || filterZone !== 'all' || filterStatut !== 'all' || filterDate !== 'all')

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (showArchived ? !o.archived : o.archived) return false

      if (searchNom) {
        const full = `${o.customer_prenom} ${o.customer_nom}`.toLowerCase()
        if (!full.includes(searchNom.toLowerCase())) return false
      }
      if (searchProduit) {
        if (!o.items.some(i => i.name.toLowerCase().includes(searchProduit.toLowerCase()))) return false
      }
      if (filterZone !== 'all' && o.delivery_zone !== filterZone) return false
      if (filterStatut !== 'all' && o.status !== filterStatut) return false
      if (filterDate !== 'all') {
        const c = new Date(o.created_at), now = new Date()
        if (filterDate === 'today' && c.toDateString() !== now.toDateString()) return false
        if (filterDate === 'week' && c < new Date(now.getTime() - 7 * 86400000)) return false
        if (filterDate === 'month' && (c.getMonth() !== now.getMonth() || c.getFullYear() !== now.getFullYear())) return false
      }
      return true
    })
  }, [orders, showArchived, searchNom, searchProduit, filterZone, filterStatut, filterDate])

  const active     = orders.filter(o => !o.archived)
  const paid       = active.filter(o => o.status === 'paid')
  const archived   = orders.filter(o => o.archived)
  const totalCA    = paid.reduce((s, o) => s + Number(o.total_eur), 0)
  const fmtCA      = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalCA)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Commandes</h1>
          <p className="text-sm mt-0.5" style={{ opacity: 0.45 }}>
            {showArchived ? `${archived.length} commande${archived.length !== 1 ? 's' : ''} archivée${archived.length !== 1 ? 's' : ''}` : 'Commandes actives'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowArchived(v => !v); setExpanded(null) }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-black/5"
            style={{ border: '1.5px solid var(--border)', color: showArchived ? 'var(--gold-deep)' : undefined }}
          >
            {showArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            {showArchived ? 'Voir actives' : `Archives${archived.length > 0 ? ` (${archived.length})` : ''}`}
          </button>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-black/5"
            style={{ border: '1.5px solid var(--border)' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* KPIs — actives seulement */}
      {!showArchived && (
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Total actives', value: active.length, color: 'var(--gold-deep)' },
            { label: 'Payées',        value: paid.length,   color: '#16a34a' },
            { label: 'CA confirmé',   value: fmtCA,         color: '#16a34a' },
          ].map(k => (
            <div key={k.label} className="jc-card p-4">
              <p className="text-xs font-medium mb-1" style={{ opacity: 0.45 }}>{k.label}</p>
              <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div className="jc-card p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <SlidersHorizontal size={14} style={{ opacity: 0.4, flexShrink: 0 }} />

          <div className="relative flex-1 min-w-[130px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.35 }} />
            <input type="text" placeholder="Nom client…" value={searchNom}
              onChange={e => setSearchNom(e.target.value)}
              style={{ ...selectStyle, paddingLeft: 28, width: '100%' }} />
          </div>

          <div className="relative flex-1 min-w-[130px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.35 }} />
            <input type="text" placeholder="Produit…" value={searchProduit}
              onChange={e => setSearchProduit(e.target.value)}
              style={{ ...selectStyle, paddingLeft: 28, width: '100%' }} />
          </div>

          <select value={filterZone} onChange={e => setFilterZone(e.target.value)} style={selectStyle}>
            <option value="all">Toutes zones</option>
            <option value="martinique">Martinique</option>
            <option value="guadeloupe">Guadeloupe</option>
            <option value="guyane">Guyane</option>
          </select>

          <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={selectStyle}>
            <option value="all">Tous statuts</option>
            <option value="paid">Payé</option>
            <option value="pending">En attente</option>
            <option value="validated">Validée</option>
          </select>

          <select value={filterDate} onChange={e => setFilterDate(e.target.value)} style={selectStyle}>
            <option value="all">Toutes dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => { setSearchNom(''); setSearchProduit(''); setFilterZone('all'); setFilterStatut('all'); setFilterDate('all') }}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
              style={{ color: 'var(--destructive)', background: 'rgba(239,68,68,0.08)' }}
            >
              <X size={12} /> Effacer
            </button>
          )}
        </div>
        {hasFilters && !loading && (
          <p className="text-xs mt-2 ml-1" style={{ opacity: 0.45 }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="jc-card p-6 mb-4 text-center" style={{ borderColor: 'var(--destructive)' }}>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--destructive)' }}>Table orders introuvable</p>
          <p className="text-xs opacity-50">Appliquez <code>014_orders.sql</code> + <code>015_orders_archive.sql</code> dans Supabase → SQL Editor.</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="jc-card p-12 text-center">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-15" />
          <p className="font-medium opacity-40">
            {hasFilters ? 'Aucun résultat pour ces filtres' : showArchived ? 'Aucune commande archivée' : "Aucune commande pour l'instant"}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map(order => {
            const isOpen      = expanded === order.id
            const borderColor = order.status === 'validated' ? '#6366f1' : order.archived ? '#aaa' : order.status === 'paid' ? '#16a34a' : '#ca8a04'
            return (
              <div key={order.id} className="jc-card overflow-hidden"
                style={{ borderLeft: `3px solid ${borderColor}`, opacity: order.archived ? 0.65 : 1 }}>

                {/* Header */}
                <button onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full p-5 flex items-center gap-4 text-left">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{order.customer_prenom} {order.customer_nom}</span>
                      <StatusBadge status={order.status} archived={order.archived} />
                      {order.delivery_zone && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--surface-soft)', color: 'oklch(0.18 0.004 264 / 0.6)' }}>
                          {ZONE_LABEL[order.delivery_zone] ?? order.delivery_zone}
                        </span>
                      )}
                      {order.payment_method === 'scalapay' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(255,74,141,0.12)', color: '#FF4A8D' }}>
                          Scalapay 4×
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

                {/* Detail */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="p-5" style={{ borderRight: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-1.5 mb-3">
                          <User size={13} style={{ color: 'var(--gold-deep)' }} />
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ opacity: 0.4 }}>Client</span>
                        </div>
                        <div className="flex flex-col gap-1.5 text-sm">
                          <p className="font-semibold">{order.customer_prenom} {order.customer_nom}</p>
                          <p style={{ opacity: 0.6 }}>{order.customer_email}</p>
                          <p style={{ opacity: 0.6 }}>{order.customer_telephone}</p>
                          {order.customer_adresse && <p style={{ opacity: 0.6 }}>{order.customer_adresse}</p>}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 mb-3">
                          <MapPin size={13} style={{ color: 'var(--gold-deep)' }} />
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ opacity: 0.4 }}>Livraison</span>
                        </div>
                        <p className="font-semibold text-sm mb-3">{ZONE_LABEL[order.delivery_zone] ?? order.delivery_zone}</p>
                        <div className="text-xs flex flex-col gap-1" style={{ opacity: 0.5 }}>
                          <p>Créée : {new Date(order.created_at).toLocaleString('fr-FR', { timeZone: 'America/Martinique' })}</p>
                          {order.paid_at && <p>Payée : {new Date(order.paid_at).toLocaleString('fr-FR', { timeZone: 'America/Martinique' })}</p>}
                          <p className="font-mono">Réf. : {order.reference}</p>
                        </div>
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ opacity: 0.4 }}>Articles</p>
                      <div className="flex flex-col gap-3">
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
                              <p className="font-medium truncate">{item.name.split(' · ')[0]}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.color_hex && <span className="inline-block w-3 h-3 rounded-full border" style={{ background: item.color_hex, borderColor: 'var(--border)' }} />}
                                {item.color_name && <span className="text-xs" style={{ opacity: 0.6 }}>{item.color_name}</span>}
                                {item.storage && <>
                                  <span className="text-xs" style={{ opacity: 0.3 }}>·</span>
                                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-soft)' }}>{item.storage}</span>
                                </>}
                              </div>
                            </div>
                            <div className="shrink-0 text-right text-sm">
                              <p className="font-bold">{formatPrice((item.price * item.quantity) / 100)}</p>
                              {item.quantity > 1 && <p className="text-xs" style={{ opacity: 0.4 }}>×{item.quantity}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold pt-3 mt-3" style={{ borderTop: '1px solid var(--border)' }}>
                        <span>Total</span>
                        <span>{formatPrice(Number(order.total_eur))}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
                      {order.status !== 'validated' && (
                        <button
                          onClick={() => validateOrder(order)}
                          className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1', border: '1.5px solid rgba(99,102,241,0.25)' }}
                        >
                          <BadgeCheck size={13} /> Valider la commande
                        </button>
                      )}
                      <button
                        onClick={() => toggleArchive(order)}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-black/5"
                        style={{ border: '1.5px solid var(--border)', color: 'oklch(0.18 0.004 264 / 0.5)' }}
                      >
                        {order.archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                        {order.archived ? 'Désarchiver' : 'Archiver'}
                      </button>
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
