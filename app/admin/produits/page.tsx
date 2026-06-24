'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import type { Product, Brand } from '@/lib/types'

type Row = Product & { brands: Brand; variant_count: number }

export default function AdminProduits() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase
      .from('products')
      .select(`*, brands(*), product_variants(id)`)
      .order('created_at', { ascending: false })
    setRows(
      (data ?? []).map((p: any) => ({
        ...p,
        variant_count: p.product_variants?.length ?? 0,
      }))
    )
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Link href="/admin/produits/nouveau" className="jc-btn-primary">
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      {loading ? (
        <p style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>Chargement…</p>
      ) : (
        <div className="jc-card overflow-hidden">
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
              {rows.map(row => (
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
      )}

      {/* Delete dialog */}
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
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all"
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
