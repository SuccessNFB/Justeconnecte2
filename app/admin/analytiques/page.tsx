'use client'
import { useEffect, useState, useMemo } from 'react'
import {
  TrendingUp, Users, Eye, ShoppingCart, CreditCard,
  Activity, BarChart2, MapPin, Smartphone, Monitor,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────

type AEvent = {
  session_id:   string
  visitor_id:   string | null
  event_type:   string
  page:         string | null
  product_slug: string | null
  zone:         string | null
  device:       string | null
  created_at:   string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uniq = <T,>(a: T[]): T[] => a.filter((v, i) => a.indexOf(v) === i)

function relTime(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (d < 1)  return 'à l\'instant'
  if (d < 60) return `il y a ${d} min`
  const h = Math.floor(d / 60)
  if (h < 24) return `il y a ${h}h`
  return `il y a ${Math.floor(h / 24)}j`
}

function dayChart(events: AEvent[], days: number) {
  const now = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    const key   = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    const value = uniq(
      events.filter(e => e.event_type === 'page_view' && e.created_at.slice(0, 10) === key).map(e => e.session_id)
    ).length
    return { label, value }
  })
}

// ─── SVG Area Chart ───────────────────────────────────────────────────────────

function AreaChart({ data }: { data: { label: string; value: number }[] }) {
  if (!data.length || data.every(d => d.value === 0))
    return <p className="text-sm text-center py-10 opacity-25">Aucune donnée</p>

  const W = 600; const H = 90
  const max = Math.max(...data.map(d => d.value), 1)
  const pts = data.map((d, i) => ({
    x: data.length === 1 ? W / 2 : (i / (data.length - 1)) * W,
    y: H - (d.value / max) * H * 0.85 + 4,
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${W},${H} L0,${H}Z`
  const step = Math.max(1, Math.ceil(data.length / 7))

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 90 }}>
        <defs>
          <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="var(--gold)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#cg)" />
        <path d={line} fill="none" stroke="var(--gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => data[i].value > 0 && <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--gold)" />)}
      </svg>
      <div className="flex justify-between mt-1 px-0.5">
        {data.map((d, i) => i % step === 0 && (
          <span key={i} className="text-[9px]" style={{ opacity: 0.3 }}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Funnel Bar ───────────────────────────────────────────────────────────────

function FBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium opacity-70">{label}</span>
        <span className="font-bold">
          {count.toLocaleString('fr-FR')}
          <span className="ml-1 font-normal opacity-40">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ─── Event badge ──────────────────────────────────────────────────────────────

const EV: Record<string, { label: string; color: string; bg: string }> = {
  page_view:    { label: 'Page vue',      color: '#6366f1',          bg: 'rgba(99,102,241,0.1)'  },
  product_view: { label: 'Produit vu',    color: 'var(--gold-deep)', bg: 'var(--gold-bg)'        },
  add_to_cart:  { label: 'Ajout panier',  color: '#22c55e',          bg: 'rgba(34,197,94,0.1)'   },
  checkout_start:{ label: 'Checkout',     color: '#8b5cf6',          bg: 'rgba(139,92,246,0.1)'  },
}

function EvBadge({ type }: { type: string }) {
  const m = EV[type] ?? { label: type, color: 'inherit', bg: 'var(--surface-soft)' }
  return (
    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub: string; color: string
}) {
  return (
    <div className="jc-card p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium" style={{ opacity: 0.45 }}>{label}</p>
        <Icon size={14} style={{ color }} />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-[10px]" style={{ opacity: 0.35 }}>{sub}</p>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PERIODS = [
  { label: "Aujourd'hui", days: 1  },
  { label: '7 jours',     days: 7  },
  { label: '30 jours',    days: 30 },
  { label: '90 jours',    days: 90 },
]

const ZONE_LABEL: Record<string, string> = {
  'martinique-guadeloupe': '🇲🇶🇬🇵 Martinique / Guadeloupe',
  'guyane':                '🇬🇫 Guyane',
}

export default function AnalytiquesPage() {
  const [period, setPeriod] = useState(7)
  const [events, setEvents] = useState<AEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setLoading(true)
    setError(false)
    const from = new Date()
    from.setDate(from.getDate() - period)
    from.setHours(0, 0, 0, 0)

    supabase
      .from('analytics_events')
      .select('session_id, visitor_id, event_type, page, product_slug, zone, device, created_at')
      .gte('created_at', from.toISOString())
      .order('created_at', { ascending: false })
      .limit(10000)
      .then(({ data, error: err }) => {
        if (err) { setError(true); setLoading(false); return }
        setEvents((data ?? []) as AEvent[])
        setLoading(false)
      })
  }, [period])

  const stats = useMemo(() => {
    const sessions      = uniq(events.map(e => e.session_id))
    const visitors      = uniq(events.filter(e => e.visitor_id).map(e => e.visitor_id as string))
    const pageViews     = events.filter(e => e.event_type === 'page_view')
    const pvSessions    = uniq(events.filter(e => e.event_type === 'product_view').map(e => e.session_id))
    const cartSessions  = uniq(events.filter(e => e.event_type === 'add_to_cart').map(e => e.session_id))
    const ckoutSessions = uniq(events.filter(e => e.event_type === 'checkout_start').map(e => e.session_id))
    const abandoned     = cartSessions.filter(s => !ckoutSessions.includes(s))
    const abandonRate   = cartSessions.length ? Math.round((abandoned.length / cartSessions.length) * 100) : 0
    const convRate      = sessions.length ? ((ckoutSessions.length / sessions.length) * 100).toFixed(1) : '0.0'

    // Top products
    const pmap: Record<string, { views: number; cart: number }> = {}
    events.forEach(e => {
      if (!e.product_slug) return
      if (!pmap[e.product_slug]) pmap[e.product_slug] = { views: 0, cart: 0 }
      if (e.event_type === 'product_view') pmap[e.product_slug].views++
      if (e.event_type === 'add_to_cart')  pmap[e.product_slug].cart++
    })
    const topProducts = Object.entries(pmap)
      .map(([slug, v]) => ({ slug, ...v }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Zones
    const zmap: Record<string, Set<string>> = {}
    events.forEach(e => {
      if (!e.zone) return
      if (!zmap[e.zone]) zmap[e.zone] = new Set()
      zmap[e.zone].add(e.session_id)
    })
    const zones = Object.entries(zmap)
      .map(([z, s]) => ({ zone: z, count: s.size }))
      .sort((a, b) => b.count - a.count)

    // Devices (one device per session)
    const dmap: Record<string, number> = {}
    const seen = new Map<string, string>()
    events.forEach(e => {
      if (!e.device || seen.has(e.session_id)) return
      seen.set(e.session_id, e.device)
    })
    seen.forEach(d => { dmap[d] = (dmap[d] ?? 0) + 1 })

    // Top pages
    const ppmap: Record<string, number> = {}
    pageViews.forEach(e => {
      if (!e.page) return
      ppmap[e.page] = (ppmap[e.page] ?? 0) + 1
    })
    const topPages = Object.entries(ppmap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([page, views]) => ({ page, views }))

    return {
      sessions: sessions.length,
      visitors: visitors.length,
      pageViews: pageViews.length,
      pvSessions: pvSessions.length,
      cartSessions: cartSessions.length,
      ckoutSessions: ckoutSessions.length,
      abandonRate,
      convRate,
      topProducts,
      zones,
      dmap,
      topPages,
      recent: events.slice(0, 30),
    }
  }, [events])

  const chart = useMemo(() => dayChart(events, Math.min(period, 30)), [events, period])

  const totalDev = Object.values(stats.dmap).reduce((s, n) => s + n, 0)
  const devColors: Record<string, string> = { mobile: 'var(--gold)', tablet: '#6366f1', desktop: '#22c55e' }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Analytiques</h1>
          <p className="text-sm mt-0.5" style={{ opacity: 0.45 }}>
            Comportement des visiteurs sur la boutique
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {PERIODS.map(p => (
            <button
              key={p.days}
              onClick={() => setPeriod(p.days)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: period === p.days ? 'var(--primary)' : 'transparent',
                color:      period === p.days ? '#fff' : 'oklch(0.18 0.004 264 / 0.5)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="jc-card p-6 mb-6 text-center" style={{ borderColor: 'var(--destructive)' }}>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--destructive)' }}>Table analytics_events introuvable</p>
          <p className="text-xs opacity-50">Appliquez la migration <code>004_analytics.sql</code> dans Supabase → SQL Editor.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-5">

          {/* ── KPIs ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard icon={TrendingUp}  color="var(--gold-deep)" label="Sessions"          value={stats.sessions.toLocaleString('fr-FR')}  sub="visites totales" />
            <KpiCard icon={Users}       color="#6366f1"           label="Visiteurs uniques"  value={stats.visitors.toLocaleString('fr-FR')}   sub="sur la période" />
            <KpiCard icon={Eye}         color="#14b8a6"           label="Pages vues"         value={stats.pageViews.toLocaleString('fr-FR')}  sub="total pages" />
            <KpiCard icon={ShoppingCart}color="#f97316"           label="Abandon panier"     value={`${stats.abandonRate} %`}                 sub="des ajouts panier" />
            <KpiCard icon={CreditCard}  color="#22c55e"           label="Taux checkout"      value={`${stats.convRate} %`}                    sub="des sessions" />
          </div>

          {/* ── Chart + Funnel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="jc-card p-6 lg:col-span-2">
              <p className="font-semibold text-sm mb-5">Sessions par jour</p>
              {events.length === 0
                ? <p className="text-sm text-center py-10 opacity-25">Aucune donnée pour cette période</p>
                : <AreaChart data={chart} />
              }
            </div>

            <div className="jc-card p-6">
              <p className="font-semibold text-sm mb-5">Entonnoir de conversion</p>
              <div className="flex flex-col gap-4">
                <FBar label="Sessions"      count={stats.sessions}     total={stats.sessions}     color="var(--gold)" />
                <FBar label="Vues produit"  count={stats.pvSessions}   total={stats.sessions}     color="#6366f1" />
                <FBar label="Ajout panier"  count={stats.cartSessions} total={stats.sessions}     color="#22c55e" />
                <FBar label="Checkout"      count={stats.ckoutSessions}total={stats.sessions}     color="#8b5cf6" />
              </div>
              {stats.sessions === 0 && (
                <p className="text-xs text-center mt-4 opacity-30">Aucune session enregistrée</p>
              )}
            </div>
          </div>

          {/* ── Zones + Devices ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="jc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={14} style={{ color: 'var(--gold)' }} />
                <p className="font-semibold text-sm">Zones géographiques</p>
              </div>
              {stats.zones.length === 0 ? (
                <p className="text-sm opacity-30">Aucune zone détectée</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {stats.zones.map((z, i) => (
                    <div key={z.zone}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium">{ZONE_LABEL[z.zone] ?? z.zone}</span>
                        <span className="font-bold">{z.count} sess.</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${Math.round((z.count / stats.sessions) * 100)}%`, background: i === 0 ? 'var(--gold)' : '#6366f1' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="jc-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Smartphone size={14} style={{ color: 'var(--gold)' }} />
                <p className="font-semibold text-sm">Appareils</p>
              </div>
              {totalDev === 0 ? (
                <p className="text-sm opacity-30">Aucune donnée</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(stats.dmap).sort((a, b) => b[1] - a[1]).map(([dev, n]) => {
                    const pct = Math.round((n / totalDev) * 100)
                    const DevIcon = dev === 'desktop' ? Monitor : Smartphone
                    return (
                      <div key={dev}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="flex items-center gap-1.5 font-medium capitalize">
                            <DevIcon size={12} /> {dev}
                          </span>
                          <span className="font-bold">{n} <span className="opacity-40">({pct}%)</span></span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: devColors[dev] ?? 'var(--gold)' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Top pages + Top produits ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top pages */}
            {stats.topPages.length > 0 && (
              <div className="jc-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye size={14} style={{ color: 'var(--gold)' }} />
                  <p className="font-semibold text-sm">Pages les plus visitées</p>
                </div>
                <div className="flex flex-col">
                  {stats.topPages.map((p, i) => (
                    <div key={p.page} className="flex items-center justify-between py-2.5 text-xs"
                      style={{ borderBottom: i < stats.topPages.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span className="font-medium truncate flex-1 mr-4">{p.page}</span>
                      <span className="font-bold shrink-0">{p.views} vues</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top produits */}
            {stats.topProducts.length > 0 && (
              <div className="jc-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={14} style={{ color: 'var(--gold)' }} />
                  <p className="font-semibold text-sm">Top produits</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Produit', 'Vues', 'Panier', 'Taux'].map(h => (
                          <th key={h} className="pb-2 text-left font-semibold" style={{ opacity: 0.4 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topProducts.map((p, i) => (
                        <tr key={p.slug} style={{ borderBottom: i < stats.topProducts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <td className="py-2.5 font-medium truncate max-w-[140px]">
                            <span className="font-mono opacity-25 mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                            {p.slug}
                          </td>
                          <td className="py-2.5 font-bold">{p.views}</td>
                          <td className="py-2.5 font-bold">{p.cart}</td>
                          <td className="py-2.5">
                            <span className="font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'var(--gold-bg)', color: 'var(--gold-deep)' }}>
                              {p.views > 0 ? Math.round((p.cart / p.views) * 100) : 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── Activité récente ── */}
          <div className="jc-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} style={{ color: 'var(--gold)' }} />
              <p className="font-semibold text-sm">Activité récente</p>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                ● Live
              </span>
            </div>
            {stats.recent.length === 0 ? (
              <p className="text-sm opacity-30 text-center py-6">Aucun événement enregistré</p>
            ) : (
              <div className="flex flex-col">
                {stats.recent.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5"
                    style={{ borderBottom: i < stats.recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <EvBadge type={e.event_type} />
                    <span className="text-xs font-medium flex-1 min-w-0 truncate opacity-70">
                      {e.product_slug ?? e.page ?? '—'}
                    </span>
                    {e.zone && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: 'var(--surface-soft)', opacity: 0.6 }}>
                        {e.zone === 'martinique-guadeloupe' ? 'MQ/GP' : 'GF'}
                      </span>
                    )}
                    <span className="text-[10px] shrink-0" style={{ opacity: 0.35 }}>
                      {relTime(e.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
