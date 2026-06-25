'use client'

import { useRouter } from 'next/navigation'
import type { Brand, Category } from '@/lib/types'

interface Props {
  brands: Brand[]
  categories: Category[]
  activeMarque?: string
  activeCategorie?: string
  activeTri?: string
}

const SORT_OPTIONS = [
  { value: '',           label: 'Nouveautés'      },
  { value: 'prix-asc',  label: 'Prix croissant'   },
  { value: 'prix-desc', label: 'Prix décroissant'  },
]

function buildUrl(p: { marque?: string; categorie?: string; tri?: string }) {
  const sp = new URLSearchParams()
  if (p.marque)    sp.set('marque',    p.marque)
  if (p.categorie) sp.set('categorie', p.categorie)
  if (p.tri)       sp.set('tri',       p.tri)
  const qs = sp.toString()
  return `/boutique${qs ? '?' + qs : ''}`
}

const SELECT_STYLE: React.CSSProperties = {
  background: 'var(--background)',
  color: 'var(--foreground)',
  border: '1px solid var(--border-strong)',
  borderRadius: 999,
  padding: '7px 30px 7px 13px',
  fontSize: 13,
  fontWeight: 500,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 11px center',
  cursor: 'pointer',
}

function SidebarLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block px-3 py-2 rounded-lg text-sm transition-all"
      style={{
        fontWeight: active ? 600 : 400,
        background: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--foreground)' : 'inherit',
        opacity: active ? 1 : 0.5,
        border: active ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      {children}
    </a>
  )
}

export default function BoutiqueFilters({
  brands, categories, activeMarque, activeCategorie, activeTri,
}: Props) {
  const router = useRouter()

  function handleSort(val: string) {
    router.push(buildUrl({ marque: activeMarque, categorie: activeCategorie, tri: val || undefined }))
  }

  function handleCategorie(val: string) {
    router.push(buildUrl({ marque: activeMarque, categorie: val || undefined, tri: activeTri }))
  }

  const pillStyle = (active: boolean): React.CSSProperties => ({
    flexShrink: 0,
    padding: '7px 15px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: active ? 600 : 500,
    border: `1px solid ${active ? 'var(--foreground)' : 'var(--border-strong)'}`,
    background: active ? 'var(--foreground)' : 'transparent',
    color: active ? 'var(--background)' : 'var(--foreground)',
    opacity: active ? 1 : 0.6,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'all .15s',
  })

  return (
    <>
      {/* ── MOBILE: barre compacte ── */}
      <div className="lg:hidden mb-5 flex flex-col gap-2.5">
        {/* Chips marques — scroll horizontal */}
        <div
          className="flex gap-2 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          <a href={buildUrl({ categorie: activeCategorie, tri: activeTri })} style={pillStyle(!activeMarque)}>
            Tout
          </a>
          {brands.map(b => (
            <a
              key={b.id}
              href={buildUrl({ marque: b.slug, categorie: activeCategorie, tri: activeTri })}
              style={pillStyle(activeMarque === b.slug)}
            >
              {b.name}
            </a>
          ))}
        </div>

        {/* Selects trier + catégorie */}
        <div className="flex gap-2 flex-wrap">
          <select style={SELECT_STYLE} value={activeTri || ''} onChange={e => handleSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {categories.length > 0 && (
            <select style={SELECT_STYLE} value={activeCategorie || ''} onChange={e => handleCategorie(e.target.value)}>
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* ── DESKTOP: sidebar ── */}
      <aside className="hidden lg:block lg:w-48 shrink-0">
        <div className="sticky top-20 flex flex-col gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-40">Trier par</p>
            <select
              style={{ ...SELECT_STYLE, borderRadius: 8, width: '100%', padding: '7px 30px 7px 10px' }}
              value={activeTri || ''}
              onChange={e => handleSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {categories.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Catégorie</p>
              <div className="flex flex-col gap-0.5">
                <SidebarLink href={buildUrl({ marque: activeMarque, tri: activeTri })} active={!activeCategorie}>
                  Tout
                </SidebarLink>
                {categories.map(c => (
                  <SidebarLink
                    key={c.id}
                    href={buildUrl({ marque: activeMarque, categorie: c.slug, tri: activeTri })}
                    active={activeCategorie === c.slug}
                  >
                    {c.name}
                  </SidebarLink>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Marque</p>
            <div className="flex flex-col gap-0.5">
              <SidebarLink href={buildUrl({ categorie: activeCategorie, tri: activeTri })} active={!activeMarque}>
                Toutes les marques
              </SidebarLink>
              {brands.map(b => (
                <SidebarLink
                  key={b.id}
                  href={buildUrl({ marque: b.slug, categorie: activeCategorie, tri: activeTri })}
                  active={activeMarque === b.slug}
                >
                  {b.name}
                </SidebarLink>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
