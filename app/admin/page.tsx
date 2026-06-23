'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Package, Boxes, AlertTriangle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Stats {
  activeProducts: number
  totalVariants: number
  outOfStock: number
  lowStock: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('product_variants').select('id', { count: 'exact', head: true }),
      supabase.from('product_variants').select('id', { count: 'exact', head: true }).eq('stock', 0),
      supabase.from('product_variants').select('id', { count: 'exact', head: true }).gt('stock', 0).lte('stock', 5),
    ]).then(([p, v, oos, ls]) => {
      setStats({
        activeProducts: p.count ?? 0,
        totalVariants: v.count ?? 0,
        outOfStock: oos.count ?? 0,
        lowStock: ls.count ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Produits actifs',     value: stats?.activeProducts, icon: Package,       color: 'var(--gold-deep)'    },
    { label: 'Total variantes',     value: stats?.totalVariants,  icon: Boxes,         color: 'var(--gold)'         },
    { label: 'Stock faible',        value: stats?.lowStock,       icon: AlertTriangle, color: 'var(--warning)'      },
    { label: 'Ruptures de stock',   value: stats?.outOfStock,     icon: XCircle,       color: 'var(--destructive)'  },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="jc-card p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.18 0.004 264 / 0.55)' }}>{label}</p>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-3xl font-bold">
              {value !== undefined ? value : '—'}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link href="/admin/produits" className="jc-card p-6 flex items-center gap-4 hover:no-underline">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.745 0.085 78 / 0.12)' }}>
            <Package size={22} style={{ color: 'var(--gold-deep)' }} />
          </div>
          <div>
            <p className="font-semibold">Gérer les produits</p>
            <p className="text-sm" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>Créer, éditer, désactiver</p>
          </div>
        </Link>
        <Link href="/admin/stock" className="jc-card p-6 flex items-center gap-4 hover:no-underline">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.745 0.085 78 / 0.12)' }}>
            <Boxes size={22} style={{ color: 'var(--gold-deep)' }} />
          </div>
          <div>
            <p className="font-semibold">Gérer le stock</p>
            <p className="text-sm" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>Niveaux et alertes</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
