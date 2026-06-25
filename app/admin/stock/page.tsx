'use client'
import { useEffect, useState } from 'react'
import { AlertTriangle, XCircle, CheckCircle, Minus, Plus, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { ProductVariant, Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Row = ProductVariant & { products: Pick<Product, 'name'> }
type Filter = 'all' | 'low' | 'out'

export default function AdminStock() {
  const [rows, setRows]         = useState<Row[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<Filter>('all')
  const [search, setSearch]     = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
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

  async function setStock(id: string, next: number) {
    if (next < 0) return
    setUpdating(id)
    const out_of_stock = next === 0
    await supabase.from('product_variants').update({ stock: next, out_of_stock }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, stock: next, out_of_stock } : r))
    setUpdating(null)
  }

  async function toggleOutOfStock(id: string, current: boolean) {
    setUpdating(id)
    const out_of_stock = !current
    await supabase.from('product_variants').update({ out_of_stock }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, out_of_stock } : r))
    setUpdating(null)
  }

  const outOfStock = rows.filter(r => r.out_of_stock || r.stock === 0)
  const lowStock   = rows.filter(r => !r.out_of_stock && r.stock > 0 && r.stock <= 5)

  const filtered = rows.filter(r => {
    if (filter === 'out' && r.stock !== 0) return false
    if (filter === 'low' && !(r.stock > 0 && r.stock <= 5)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        r.sku.toLowerCase().includes(q) ||
        (r as any).products?.name?.toLowerCase().includes(q) ||
        r.color_name?.toLowerCase().includes(q) ||
        r.storage?.toLowerCase().includes(q)
      )
    }
    return true
  })

  function stockColor(stock: number) {
    if (stock === 0) return 'var(--destructive)'
    if (stock <= 5)  return 'var(--warning)'
    return 'var(--success)'
  }
  function stockBg(stock: number) {
    if (stock === 0) return 'oklch(0.62 0.22 27 / 0.1)'
    if (stock <= 5)  return 'oklch(0.78 0.16 60 / 0.12)'
    return 'oklch(0.72 0.18 145 / 0.1)'
  }

  function StockBadge({ row }: { row: Row }) {
    const oos = row.out_of_stock || row.stock === 0
    const low = !oos && row.stock <= 5
    const props = {
      className: 'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap',
      style: {
        background: oos ? stockBg(0) : low ? stockBg(3) : stockBg(10),
        color:      oos ? stockColor(0) : low ? stockColor(3) : stockColor(10),
      },
    }
    if (oos) return <span {...props}><XCircle size={11} /> Rupture</span>
    if (low) return <span {...props}><AlertTriangle size={11} /> Faible</span>
    return <span {...props}><CheckCircle size={11} /> {row.stock} unités</span>
  }

  function OosToggle({ row }: { row: Row }) {
    const busy = updating === row.id
    const isOos = row.out_of_stock
    return (
      <button
        onClick={() => toggleOutOfStock(row.id, isOos)}
        disabled={busy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 whitespace-nowrap"
        style={{
          background: isOos ? 'oklch(0.72 0.18 145 / 0.1)' : 'oklch(0.62 0.22 27 / 0.08)',
          color:      isOos ? 'var(--success)'               : 'var(--destructive)',
          border:     `1px solid ${isOos ? 'oklch(0.72 0.18 145 / 0.2)' : 'oklch(0.62 0.22 27 / 0.15)'}`,
        }}
      >
        {busy ? '…' : isOos ? <><CheckCircle size={11} /> Remettre en stock</> : <><XCircle size={11} /> Forcer rupture</>}
      </button>
    )
  }

  function Stepper({ row }: { row: Row }) {
    const busy = updating === row.id
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStock(row.id, row.stock - 1)}
          disabled={busy || row.stock === 0}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-30"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center font-bold tabular-nums text-sm" style={{ color: stockColor(row.stock) }}>
          {busy ? '…' : row.stock}
        </span>
        <button
          onClick={() => setStock(row.id, row.stock + 1)}
          disabled={busy}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-30"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <Plus size={14} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion du stock</h1>

      {/* Alert badges */}
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

      {/* Filtres */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {(['all', 'low', 'out'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === f ? 'var(--primary)' : 'var(--surface)',
                color: filter === f ? '#fff' : 'inherit',
                border: '1px solid ' + (filter === f ? 'var(--primary)' : 'var(--border)'),
              }}>
              {f === 'all' ? `Tous (${rows.length})` : f === 'low' ? `Stock faible (${lowStock.length})` : `Ruptures (${outOfStock.length})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
          <input
            className="jc-input pl-9 w-full sm:w-80"
            placeholder="Produit, couleur, stockage ou SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 opacity-30">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium text-sm">Aucune variante trouvée.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="jc-card overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-soft)' }}>
                  {['Produit', 'Couleur', 'Stockage', 'SKU', 'Stock', 'Statut', 'Disponibilité'].map(h => (
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
                        <span className="w-4 h-4 rounded-full border shrink-0"
                          style={{ background: row.color_hex, borderColor: 'var(--border)' }} />
                        <span>{row.color_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">{row.storage}</td>
                    <td className="px-5 py-3 font-mono text-xs opacity-40">{row.sku}</td>
                    <td className="px-5 py-3"><Stepper row={row} /></td>
                    <td className="px-5 py-3"><StockBadge row={row} /></td>
                    <td className="px-5 py-3"><OosToggle row={row} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map(row => (
              <div key={row.id} className="jc-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{(row as any).products?.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="w-3.5 h-3.5 rounded-full border shrink-0"
                        style={{ background: row.color_hex, borderColor: 'var(--border)' }} />
                      <span className="text-xs opacity-50">{row.color_name}</span>
                      <span className="text-xs opacity-30">·</span>
                      <span className="text-xs opacity-50">{row.storage}</span>
                    </div>
                    <p className="text-[10px] font-mono opacity-30 mt-0.5">{row.sku}</p>
                  </div>
                  <StockBadge row={row} />
                </div>
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-xs font-medium opacity-40">Quantité en stock</p>
                  <Stepper row={row} />
                </div>
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-xs font-medium opacity-40">Disponibilité</p>
                  <OosToggle row={row} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
