'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product, Brand } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Row = Product & { brands: Brand; variant_count: number }

export default function AdminProduits() {
  const [rows, setRows]             = useState<Row[]>([])
  const [brands, setBrands]         = useState<Brand[]>([])
  const [loading, setLoading]       = useState(true)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [search, setSearch]         = useState('')
  const supabase = createClient()

  async function load() {
    const [{ data: products }, { data: brandsData }] = await Promise.all([
      supabase.from('products').select(`*, brands(*), product_variants(id)`).order('created_at', { ascending: false }),
      supabase.from('brands').select('*').order('sort_order'),
    ])
    setRows((products ?? []).map((p: any) => ({ ...p, variant_count: p.product_variants?.length ?? 0 })))
    setBrands((brandsData ?? []) as Brand[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r))
  }

  async function handleDelete(id: string) {
    await supabase.from('products').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
    setDeleteId(null)
  }

  const filtered = rows.filter(r => {
    if (brandFilter !== 'all' && r.brands?.id !== brandFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return r.name.toLowerCase().includes(q) || r.brands?.name?.toLowerCase().includes(q)
    }
    return true
  })

  const activeBrands = brands.filter(b => rows.some(r => r.brands?.id === b.id))

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Link href="/admin/produits/nouveau" className="jc-btn-primary shrink-0">
          <Plus size={16} />
          <span className="hidden sm:inline">Nouveau produit</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>

      {/* Brand tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setBrandFilter('all')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: brandFilter === 'all' ? 'var(--primary)' : 'var(--surface)',
            color: brandFilter === 'all' ? '#fff' : 'inherit',
            border: '1px solid ' + (brandFilter === 'all' ? 'var(--primary)' : 'var(--border)'),
          }}
        >
          Toutes ({rows.length})
        </button>
        {activeBrands.map(b => {
          const count = rows.filter(r => r.brands?.id === b.id).length
          const active = brandFilter === b.id
          return (
            <button key={b.id} onClick={() => setBrandFilter(b.id)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'var(--primary)' : 'var(--surface)',
                color: active ? '#fff' : 'inherit',
                border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border)'),
              }}
            >
              {b.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
        <input
          className="jc-input pl-9 w-full sm:w-72"
          placeholder="Rechercher un produit…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 opacity-30">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium text-sm">Aucun produit trouvé.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="jc-card overflow-hidden hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-soft)' }}>
                  {['Produit', 'Marque', 'Variantes', 'Statut', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide"
                      style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-5 py-4 font-medium">{row.name}</td>
                    <td className="px-5 py-4" style={{ color: 'oklch(0.18 0.004 264 / 0.55)' }}>{row.brands?.name}</td>
                    <td className="px-5 py-4">{row.variant_count}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(row.id, row.is_active)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          background: row.is_active ? 'oklch(0.72 0.18 145 / 0.12)' : 'oklch(0.62 0.22 27 / 0.10)',
                          color: row.is_active ? 'var(--success)' : 'var(--destructive)',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                        {row.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/produits/${row.id}`}
                          className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                          style={{ color: 'var(--destructive)' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map(row => (
              <div key={row.id} className="jc-card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{row.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'var(--surface-soft)', color: 'oklch(0.18 0.004 264 / 0.55)' }}>
                        {row.brands?.name}
                      </span>
                      <span className="text-xs opacity-40">{row.variant_count} var.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActive(row.id, row.is_active)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
                    style={{
                      background: row.is_active ? 'oklch(0.72 0.18 145 / 0.12)' : 'oklch(0.62 0.22 27 / 0.10)',
                      color: row.is_active ? 'var(--success)' : 'var(--destructive)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                    {row.is_active ? 'Actif' : 'Inactif'}
                  </button>
                </div>
                <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link href={`/admin/produits/${row.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <Edit size={14} /> Modifier
                  </Link>
                  <button
                    onClick={() => setDeleteId(row.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: 'oklch(0.62 0.22 27 / 0.08)', color: 'var(--destructive)', border: '1px solid oklch(0.62 0.22 27 / 0.15)' }}>
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative jc-card p-8 max-w-sm w-full text-center">
            <p className="font-bold text-lg mb-2">Supprimer ce produit ?</p>
            <p className="text-sm mb-6" style={{ color: 'oklch(0.18 0.004 264 / 0.55)' }}>
              Cette action est irréversible. Toutes les variantes et prix seront supprimés.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="jc-btn-ghost px-6">Annuler</button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white"
                style={{ background: 'var(--destructive)' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
