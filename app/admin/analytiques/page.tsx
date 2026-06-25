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
  metadata:     { amount?: number; items?: number; currency?: string } | null
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

/**
 * Builds daily chart data.
 * - type 'visitors': counts unique visitor_id per day (localStorage-based, ignores repeat sessions)
 * - type 'revenue':  sums purchase amounts per day
 * - period 0 = All Time (no date cap, range derived from data)
 */
function buildChartData(
  events: AEvent[],
  period: number,
  type: 'visitors' | 'revenue',
): { label: string; value: number }[] {
  if (events.length === 0) return []

  const now = new Date()
  now.setHours(23, 59, 59, 999)

  let startDate: Date
  if (period === 0) {
    const oldest = events.reduce(
      (min, e) => (e.created_at < min ? e.created_at : min),
      events[0].created_at,
    )
    startDate = new Date(oldest)
    startDate.setHours(0, 0, 0, 0)
  } else {
    startDate = new Date()
    startDate.setDate(startDate.getDate() - (period - 1))
    startDate.setHours(0, 0, 0, 0)
  }

  const totalDays = Math.ceil((now.getTime() - startDate.getTime()) / 86400000) + 1

  // Group events by ISO date key
  const byDay: Record<string, AEvent[]> = {}
  events.forEach(e => {
    const key = e.created_at.slice(0, 10)
    if (!byDay[key]) byDay[key] = []
    byDay[key].push(e)
  })

  return Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const key      = d.toISOString().slice(0, 10)
    const label    = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    const dayEvts  = byDay[key] ?? []

    const value = type === 'visitors'
      ? uniq(dayEvts.filter(e => e.visitor_id).map(e => e.visitor_id as string)).length
      : dayEvts.filter(e => e.event_type === 'purchase').reduce((s, e) => s + (e.metadata?.amount ?? 0), 0)

    return { label, value }
  })
}

const fmtEur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

// ─── SVG Area Chart ───────────────────────────────────────────────────────────

function AreaChart({ data, color = 'var(--gold)', fmt }: {
  data: { label: string; value: number }[]
  color?: string
  fmt?: (v: number) => string
}) {
  if (!data.length || data.every(d => d.value === 0))
    return <p className="text-sm text-center py-10 opacity-25">Aucune donnée</p>

  const W = 600; const H = 100
  const max  = Math.max(...data.map(d => d.value), 1)
  const mid  = Math.round(max / 2)
  const pts  = data.map((d, i) => ({
    x: data.length === 1 ? W / 2 : (i / (data.length - 1)) * W,
    y: H - (d.value / max) * H * 0.82 + 4,
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${W},${H} L0,${H}Z`
  const step = Math.max(1, Math.ceil(data.length / 6))
  const gradId = `cg-${color.replace(/[^a-z0-9]/gi, 'x')}`
  const fmtV  = fmt ?? ((v: number) => v.toLocaleString('fr-FR'))

  // Grid Y positions for max, mid, 0
  const gridY = [
    H - (1)   * H * 0.82 + 4,  // max
    H - (0.5) * H * 0.82 + 4,  // mid
    H - (0)   * H * 0.82 + 4,  // 0 (bottom)
  ]

  return (
    <div className="flex gap-2 items-start">
      {/* Y-axis labels aligned with grid lines */}
      <div className="relative shrink-0 text-right" style={{ width: 46, height: 100 }}>
        {[fmtV(max), fmtV(mid), '0'].map((label, i) => (
          <span
            key={i}
            className="absolute right-0 text-[9px] leading-none"
            style={{
              top: gridY[i],
              transform: 'translateY(-50%)',
              opacity: 0.35,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Chart + X-axis */}
      <div className="flex-1 min-w-0">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 100 }}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0"    />
            </linearGradient>
          </defs>
          {/* Horizontal grid lines */}
          {gridY.map((y, i) => (
            <line key={i} x1="0" y1={y.toFixed(1)} x2={W} y2={y.toFixed(1)}
              stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
          ))}
          <path d={area} fill={`url(#${gradId})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {data.length <= 60 && pts.map((p, i) =>
            data[i].value > 0 && <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
          )}
        </svg>
        {/* X-axis labels */}
        <div className="flex justify-between mt-1 px-0.5">
          {data.map((d, i) => i % step === 0 && (
            <span key={i} className="text-[9px]" style={{ opacity: 0.3 }}>{d.label}</span>
          ))}
        </div>
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
  page_view:     { label: 'Page vue',      color: '#6366f1',          bg: 'rgba(99,102,241,0.1)'  },
  product_view:  { label: 'Produit vu',    color: 'var(--gold-deep)', bg: 'var(--gold-bg)'        },
  add_to_cart:   { label: 'Ajout panier',  color: '#22c55e',          bg: 'rgba(34,197,94,0.1)'   },
  checkout_start:{ label: 'Checkout',      color: '#8b5cf6',          bg: 'rgba(139,92,246,0.1)'  },
  purchase:      { label: 'Vente ✓',       color: '#16a34a',          bg: 'rgba(22,163,74,0.12)'  },
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
  { label: '7 jours',  days: 7  },
  { label: '30 jours', days: 30 },
  { label: '90 jours', days: 90 },
  { label: 'All Time', days: 0  },
]

const ZONE_LABEL: Record<string, string> = {
  'martinique-guadeloupe': '🇲🇶🇬🇵 Martinique / Guadeloupe',
  'guyane':                '🇬🇫 Guyane',
}

export default function AnalytiquesPage() {
  const [period, setPeriod]   = useState(7)
  const [events, setEvents]   = useState<AEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setLoading(true)
    setError(false)

    let query = supabase
      .from('analytics_events')
      .select('session_id, visitor_id, event_type, page, product_slug, zone, device, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(10000)

    if (period > 0) {
      const from = new Date()
      from.setDate(from.getDate() - period)
      from.setHours(0, 0, 0, 0)
      query = query.gte('created_at', from.toISOString())
    }

    query.then(({ data, error: err }) => {
      if (err) { setError(true); setLoading(false); return }
      setEvents((data ?? []) as AEvent[])
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const stats = useMemo(() => {
    const sessions      = uniq(events.map(e => e.session_id))
    // Unique visitors by localStorage visitor_id — does not count the same person twice
    const visitors      = uniq(events.filter(e => e.visitor_id).map(e => e.visitor_id as string))
    const pageViews     = events.filter(e => e.event_type === 'page_view')
    const pvSessions    = uniq(events.filter(e => e.event_type === 'product_view').map(e => e.session_id))
    const cartSessions  = uniq(events.filter(e => e.event_type === 'add_to_cart').map(e => e.session_id))
    const ckoutSessions = uniq(events.filter(e => e.event_type === 'checkout_start').map(e => e.session_id))
    const abandoned     = cartSessions.filter(s => !ckoutSessions.includes(s))
    const abandonRate   = cartSessions.length ? Math.round((abandoned.length / cartSessions.length) * 100) : 0
    const convRate      = sessions.length ? ((ckoutSessions.length / sessions.length) * 100).toFixed(1) : '0.0'

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

    const zmap: Record<string, Set<string>> = {}
    events.forEach(e => {
      if (!e.zone) return
      if (!zmap[e.zone]) zmap[e.zone] = new Set()
      zmap[e.zone].add(e.session_id)
    })
    const zones = Object.entries(zmap)
      .map(([z, s]) => ({ zone: z, count: s.size }))
      .sort((a, b) => b.count - a.count)

    const dmap: Record<string, number> = {}
    const seen = new Map<string, string>()
    events.forEach(e => {
      if (!e.device || seen.has(e.session_id)) return
      seen.set(e.session_id, e.device)
    })
    seen.forEach(d => { dmap[d] = (dmap[d] ?? 0) + 1 })

    const ppmap: Record<string, number> = {}
    pageViews.forEach(e => {
      if (!e.page) return
      ppmap[e.page] = (ppmap[e.page] ?? 0) + 1
    })
    const topPages = Object.entries(ppmap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([page, views]) => ({ page, views }))

    const purchases  = events.filter(e => e.event_type === 'purchase')
    const revenue    = purchases.reduce((s, e) => s + (e.metadata?.amount ?? 0), 0)
    const salesCount = purchases.length

    return {
      sessions: sessions.length,
      visitors: visitors.length,
      pageViews: pageViews.length,
      pvSessions: pvSessions.length,
      cartSessions: cartSessions.length,
      ckoutSessions: ckoutSessions.length,
      abandonRate,
      convRate,
      revenue,
      salesCount,
      topProducts,
      zones,
      dmap,
      topPages,
      recent: events.slice(0, 30),
    }
  }, [events])

  // Charts use buildChartData with the full period (no 30-day cap)
  const chartVisitors = useMemo(() => buildChartData(events, period, 'visitors'), [events, period])
  const chartRevenue  = useMemo(() => buildChartData(events, period, 'revenue'),  [events, period])

  const totalDev = Object.values(stats.dmap).reduce((s, n) => s + n, 0)
  const devColors: Record<string, string> = { mobile: 'var(--gold)', tablet: '#6366f1', desktop: '#22c55e' }

  const periodLabel = PERIODS.find(p => p.days === period)?.label ?? ''

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={TrendingUp}  color="var(--gold-deep)" label="Sessions"           value={stats.sessions.toLocaleString('fr-FR')}  sub={`visites — ${periodLabel}`} />
            <KpiCard icon={Users}       color="#6366f1"           label="Visiteurs uniques"  value={stats.visitors.toLocaleString('fr-FR')}   sub="sans doublons (cookie)" />
            <KpiCard icon={ShoppingCart}color="#22c55e"           label="Ventes confirmées"  value={stats.salesCount.toLocaleString('fr-FR')} sub="paiements Stripe" />
            <KpiCard icon={CreditCard}  color="var(--gold)"       label="Chiffre d'affaires" value={fmtEur(stats.revenue)}                    sub={`revenus — ${periodLabel}`} />
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="jc-card p-6">
              <p className="font-semibold text-sm mb-5">Visiteurs uniques par jour</p>
              {events.length === 0
                ? <p className="text-sm text-center py-10 opacity-25">Aucune donnée pour cette période</p>
                : <AreaChart data={chartVisitors} color="var(--gold)" />
              }
            </div>
            <div className="jc-card p-6">
              <p className="font-semibold text-sm mb-5">Chiffre d'affaires par jour</p>
              {events.length === 0
                ? <p className="text-sm text-center py-10 opacity-25">Aucune donnée pour cette période</p>
                : <AreaChart data={chartRevenue} color="#22c55e" fmt={fmtEur} />
              }
            </div>
          </div>

          {/* ── Funnel ── */}
          <div className="jc-card p-6">
            <p className="font-semibold text-sm mb-5">Entonnoir de conversion</p>
            <div className="flex flex-col gap-4">
              <FBar label="Sessions"      count={stats.sessions}      total={stats.sessions} color="var(--gold)" />
              <FBar label="Vues produit"  count={stats.pvSessions}    total={stats.sessions} color="#6366f1" />
              <FBar label="Ajout panier"  count={stats.cartSessions}  total={stats.sessions} color="#22c55e" />
              <FBar label="Checkout"      count={stats.ckoutSessions} total={stats.sessions} color="#8b5cf6" />
              <FBar label="Ventes"        count={stats.salesCount}    total={stats.sessions} color="#16a34a" />
            </div>
            {stats.sessions === 0 && (
              <p className="text-xs text-center mt-4 opacity-30">Aucune session enregistrée</p>
            )}
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
