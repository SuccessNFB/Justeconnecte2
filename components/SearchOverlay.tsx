'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface ProductResult {
  id: string
  name: string
  slug: string
  brands: { name: string } | null
}

interface Props {
  open: boolean
  onClose: () => void
}

const SUGGESTIONS = ['iPhone 13', 'iPhone 14', 'Samsung Galaxy S22', 'Google Pixel 7']

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<ProductResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, brands(name)')
        .ilike('name', `%${query.trim()}%`)
        .eq('is_active', true)
        .limit(6)
      setResults((data ?? []) as unknown as ProductResult[])
      setLoading(false)
    }, 260)
    return () => clearTimeout(timer)
  }, [query])

  if (!open) return null

  const hasResults = results.length > 0
  const showEmpty  = !loading && query.trim().length >= 2 && !hasResults

  return (
    <div className="fixed inset-0 z-[100] flex justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Panel — slides down */}
      <div
        className="relative w-full max-w-xl mx-4 mt-[72px] h-fit rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 28px 64px rgba(0,0,0,0.22)',
        }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: (hasResults || loading || showEmpty) ? '1px solid var(--border)' : 'none' }}>
          <Search size={17} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un produit…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm font-medium outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-black/5 transition-colors shrink-0">
              <X size={14} className="opacity-40" />
            </button>
          )}
          <button onClick={onClose}
            className="text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-black/5 transition-colors opacity-30 shrink-0">
            ESC
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="px-5 py-4 text-sm opacity-35">Recherche en cours…</p>
        )}

        {/* Results */}
        {hasResults && (
          <div className="py-1.5 max-h-80 overflow-y-auto">
            {results.map(p => (
              <Link key={p.id} href={`/boutique/${p.slug}`} onClick={onClose}
                className="flex items-center justify-between px-5 py-3 hover:bg-black/[0.04] transition-colors group">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest opacity-30 mb-0.5">
                    {p.brands?.name}
                  </p>
                  <p className="text-sm font-semibold">{p.name}</p>
                </div>
                <ArrowRight size={14}
                  className="opacity-0 group-hover:opacity-40 transition-all -translate-x-1 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {showEmpty && (
          <p className="px-5 py-6 text-sm opacity-30 text-center">
            Aucun produit pour « {query} »
          </p>
        )}

        {/* Suggestions (when input empty) */}
        {!query && (
          <div className="px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-25 mb-3">
              Recherches populaires
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:border-[rgba(196,146,42,0.5)]"
                  style={{ border: '1px solid var(--border-strong)', background: 'var(--surface-soft)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
