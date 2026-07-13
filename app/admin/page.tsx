'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Package, Boxes, AlertTriangle, XCircle, ShoppingBag, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ProductStats {
  activeProducts: number
  totalVariants:  number
  outOfStock:     number
  lowStock:       number
}

interface OrderStats {
  total:   number
  paid:    number
  pending: number
  ca:      number
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductStats | null>(null)
  const [orders,   setOrders]   = useState<OrderStats | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Product stats
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('product_variants').select('id', { count: 'exact', head: true }),
      supabase.from('product_variants').select('id', { count: 'exact', head: true }).eq('stock', 0),
      supabase.from('product_variants').select('id', { count: 'exact', head: true }).gt('stock', 0).lte('stock', 5),
    ]).then(([p, v, oos, ls]) => {
      setProducts({
        activeProducts: p.count  ?? 0,
        totalVariants:  v.count  ?? 0,
        outOfStock:     oos.count ?? 0,
        lowStock:       ls.count  ?? 0,
      })
    })

    // Order stats
    supabase
      .from('orders')
      .select('status, total_eur')
      .then(({ data }) => {
        if (!data) return
        const paid    = data.filter(o => o.status === 'paid')
        const pending = data.filter(o => o.status !== 'paid')
        const ca      = paid.reduce((s, o) => s + Number(o.total_eur), 0)
        setOrders({ total: data.length, paid: paid.length, pending: pending.length, ca })
      })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* ── Commandes ── */}
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ opacity: 0.35 }}>Commandes</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total commandes', value: orders?.total,   icon: ShoppingBag,   color: 'var(--gold-deep)' },
          { label: 'Payées',          value: orders?.paid,    icon: CheckCircle,   color: '#16a34a'          },
          { label: 'En attente',      value: orders?.pending, icon: Clock,         color: '#ca8a04'          },
          { label: 'CA confirmé',
            value: orders?.ca !== undefined ? formatPrice(orders.ca) : undefined,
            icon: TrendingUp, color: '#16a34a' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="jc-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ opacity: 0.45 }}>{label}</p>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-2xl font-bold">{value !== undefined ? value : '—'}</p>
          </div>
        ))}
      </div>

      {/* ── Catalogue ── */}
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ opacity: 0.35 }}>Catalogue</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Produits actifs',   value: products?.activeProducts, icon: Package,       color: 'var(--gold-deep)'   },
          { label: 'Total variantes',   value: products?.totalVariants,  icon: Boxes,         color: 'var(--gold)'        },
          { label: 'Stock faible',      value: products?.lowStock,       icon: AlertTriangle, color: 'var(--warning)'     },
          { label: 'Ruptures de stock', value: products?.outOfStock,     icon: XCircle,       color: 'var(--destructive)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="jc-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ opacity: 0.45 }}>{label}</p>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-2xl font-bold">{value !== undefined ? value : '—'}</p>
          </div>
        ))}
      </div>

      {/* ── Raccourcis ── */}
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ opacity: 0.35 }}>Accès rapides</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/commandes',   icon: ShoppingBag, label: 'Commandes',        sub: 'Voir toutes les commandes'    },
          { href: '/admin/produits',    icon: Package,     label: 'Produits',          sub: 'Créer, éditer, désactiver'    },
          { href: '/admin/stock',       icon: Boxes,       label: 'Stock',             sub: 'Niveaux et alertes'           },
        ].map(({ href, icon: Icon, label, sub }) => (
          <Link key={href} href={href} className="jc-card p-5 flex items-center gap-4 hover:no-underline transition-opacity hover:opacity-80">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'oklch(0.745 0.085 78 / 0.12)' }}>
              <Icon size={20} style={{ color: 'var(--gold-deep)' }} />
            </div>
            <div>
              <p className="font-semibold">{label}</p>
              <p className="text-xs mt-0.5" style={{ opacity: 0.5 }}>{sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
