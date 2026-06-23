'use client'
import { useEffect, useState } from 'react'
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { ProductVariant, Product } from '@/lib/types'

type Row = ProductVariant & { products: Pick<Product, 'name'> }

type Filter = 'all' | 'low' | 'out'

export default function AdminStock() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<{ id: string; val: string } | null>(null)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase
      .from('product_variants')
      .select(`*, products(name)`)
      .order('stock', { ascending: true })
    setRows((data ?? []) as Row[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function saveStock(id: string, val: string) {
    const stock = parseInt(val)
    if (isNaN(stock) || stock < 0) return
    await supabase.from('product_variants').update({ stock }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, stock } : r))
    setEditing(null)
  }

  const outOfStock = rows.filter(r => r.stock === 0)
  const lowStock    = rows.filter(r => r.stock > 0 && r.stock <= 5)

  const filtered = rows.filter(r => {
    if (filter === 'out' && r.stock !== 0) return false
    if (filter === 'low' && !(r.stock > 0 && r.stock <= 5)) return false
    if (search) {
      const q = search.toLowerCase()
      return r.sku.toLowerCase().includes(q) || (r as any).products?.name?.toLowerCase().includes(q)
    }
    return true
  })

  function StockBadge({ stock }: { stock: number }) {
    if (stock === 0) return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'oklch(0.62 0.22 27 / 0.1)', color: 'var(--destructive)' }}>
        <XCircle size={11} /> Rupture
      </span>
    )
    if (stock <= 5) return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'oklch(0.78 0.16 60 / 0.12)', color: 'var(--warning)' }}>
        <AlertTriangle size={11} /> Faible ({stock})
      </span>
    )
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'oklch(0.72 0.18 145 / 0.1)', color: 'var(--success)' }}>
        <CheckCircle size={11} /> OK
      </span>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion du stock</h1>

      {/* Alertes */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'oklch(0.62 0.22 27 / 0.08)', color: 'var(--destructive)', border: '1px solid oklch(0.62 0.22 27 / 0.15)' }}>
              <XCircle size={15} /> {outOfStock.length} rupture{outOfStock.length > 1 ? 's' : ''}
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'oklch(0.78 0.16 60 / 0.08)', color: 'var(--warning)', border: '1px solid oklch(0.78 0.16 60 / 0.15)' }}>
              <AlertTriangle size={15} /> {lowStock.length} stock{lowStock.length > 1 ? 's' : ''} faible{lowStock.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Filtres + recherche */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {(['all', 'low', 'out'] as Filter[]).map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filter === f ? 'var(--primary)' : 'var(--surface)',
              color: filter === f ? '#fff' : 'inherit',
              border: '1px solid ' + (filter === f ? 'var(--primary)' : 'var(--border)'),
            }}
          >
            {f === 'all' ? 'Tous' : f === 'low' ? 'Stock faible' : 'Ruptures'}
          </button>
        ))}
        <input className="jc-input w-56" placeholder="Rechercher produit ou SKU…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <p style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>Chargement…</p>
      ) : (
        <div className="jc-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-soft)' }}>
                {['Produit', 'Couleur', 'Stockage', 'SKU', 'Stock', 'Statut'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide"
                    style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3 font-medium">{(row as any).products?.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border" style={{ background: row.color_hex, borderColor: 'var(--border)' }} />
                      {row.color_name}
                    </div>
                  </td>
                  <td className="px-5 py-3">{row.storage}</td>
                  <td className="px-5 py-3 font-mono text-xs">{row.sku}</td>
                  <td className="px-5 py-3">
                    {editing?.id === row.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0}
                          className="jc-input w-20 text-sm"
                          value={editing.val}
                          onChange={e => setEditing({ id: row.id, val: e.target.value })}
                          onBlur={() => saveStock(row.id, editing.val)}
                          onKeyDown={e => { if (e.key === 'Enter') saveStock(row.id, editing.val); if (e.key === 'Escape') setEditing(null) }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditing({ id: row.id, val: String(row.stock) })}
                        className="font-semibold hover:opacity-60 transition-opacity"
                      >
                        {row.stock}
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3"><StockBadge stock={row.stock} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
