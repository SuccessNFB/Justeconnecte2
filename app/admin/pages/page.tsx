'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ChevronUp, ChevronDown, Plus, Trash2, Eye, EyeOff, Pencil, X, Check } from 'lucide-react'
import type { SiteSection } from '@/lib/types'

// ── Type defs ────────────────────────────────────────────────────────────────

const SECTION_TYPES = [
  { type: 'trust',                label: 'Badges de confiance', emoji: '🛡️', desc: '4 arguments de vente (authenticité, garantie, livraison, support)' },
  { type: 'products_new',        label: 'Nouveautés',           emoji: '✨', desc: 'Grille des produits marqués "Nouveau"' },
  { type: 'products_bestseller', label: 'Meilleures ventes',    emoji: '🔥', desc: 'Grille des produits marqués "Bestseller"' },
  { type: 'text_block',          label: 'Bloc texte',           emoji: '📝', desc: 'Titre + paragraphe libre' },
  { type: 'banner',              label: 'Bannière',             emoji: '📣', desc: 'Annonce ou promotion avec bouton' },
]

const DEFAULT_CONFIGS: Record<string, object> = {
  trust: {
    items: [
      { title: 'Produits 100 % authentiques',  body: 'Sélectionnés directement chez les distributeurs officiels.' },
      { title: 'Garantie constructeur',         body: 'Tous nos appareils bénéficient de la garantie officielle.' },
      { title: 'Livraison express',             body: 'Guadeloupe, Martinique, Guyane. Délai estimé à la commande.' },
      { title: 'Support réactif',               body: 'WhatsApp, email ou téléphone. Réponse sous 2 heures.' },
    ],
  },
  products_new:        { title: 'Nouveautés' },
  products_bestseller: { title: 'Meilleures ventes' },
  text_block:          { title: '', body: '' },
  banner:              { text: '', cta: 'Voir la boutique', cta_href: '/boutique' },
}

function sectionPreview(s: SiteSection): string {
  if (s.type === 'trust') return (s.config.items as any[])?.[0]?.title ?? ''
  if (s.type === 'products_new' || s.type === 'products_bestseller') return s.config.title ?? ''
  if (s.type === 'text_block') return s.config.title ?? ''
  if (s.type === 'banner') return s.config.text ?? ''
  return ''
}

function sectionLabel(type: string) {
  return SECTION_TYPES.find(t => t.type === type)?.label ?? type
}

// ── Config editors ────────────────────────────────────────────────────────────

function TrustEditor({ config, onChange }: { config: any; onChange: (c: any) => void }) {
  const items: { title: string; body: string }[] = config.items ?? []
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-bold opacity-40">Avantage {i + 1}</p>
          <input className="jc-input" placeholder="Titre" value={item.title}
            onChange={e => onChange({ ...config, items: items.map((it, j) => j === i ? { ...it, title: e.target.value } : it) })} />
          <textarea className="jc-input resize-none" rows={2} placeholder="Description" value={item.body}
            onChange={e => onChange({ ...config, items: items.map((it, j) => j === i ? { ...it, body: e.target.value } : it) })} />
        </div>
      ))}
    </div>
  )
}

function ProductsEditor({ config, onChange }: { config: any; onChange: (c: any) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1">Titre de la section</label>
      <input className="jc-input" value={config.title ?? ''} placeholder="ex: Nouveautés"
        onChange={e => onChange({ ...config, title: e.target.value })} />
    </div>
  )
}

function TextBlockEditor({ config, onChange }: { config: any; onChange: (c: any) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-semibold mb-1">Titre</label>
        <input className="jc-input" value={config.title ?? ''} onChange={e => onChange({ ...config, title: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Contenu</label>
        <textarea className="jc-input resize-none" rows={4} value={config.body ?? ''}
          onChange={e => onChange({ ...config, body: e.target.value })} />
      </div>
    </div>
  )
}

function BannerEditor({ config, onChange }: { config: any; onChange: (c: any) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-semibold mb-1">Texte de la bannière</label>
        <input className="jc-input" value={config.text ?? ''} onChange={e => onChange({ ...config, text: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Texte du bouton</label>
          <input className="jc-input" value={config.cta ?? ''} onChange={e => onChange({ ...config, cta: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Lien du bouton</label>
          <input className="jc-input font-mono text-xs" value={config.cta_href ?? ''} placeholder="/boutique"
            onChange={e => onChange({ ...config, cta_href: e.target.value })} />
        </div>
      </div>
    </div>
  )
}

function ConfigEditor({ section, onChange }: { section: SiteSection; onChange: (c: any) => void }) {
  if (section.type === 'trust') return <TrustEditor config={section.config} onChange={onChange} />
  if (section.type === 'products_new' || section.type === 'products_bestseller') return <ProductsEditor config={section.config} onChange={onChange} />
  if (section.type === 'text_block') return <TextBlockEditor config={section.config} onChange={onChange} />
  if (section.type === 'banner') return <BannerEditor config={section.config} onChange={onChange} />
  return null
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PagesAdmin() {
  const supabase = createClient()
  const [sections, setSections] = useState<SiteSection[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editConfig, setEditConfig] = useState<any>(null)
  const [addingSection, setAddingSection] = useState(false)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('site_sections').select('*').eq('page', 'accueil').order('sort_order')
      .then(({ data }) => { setSections((data ?? []) as SiteSection[]); setLoading(false) })
  }, [])

  const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order)

  async function moveUp(id: string) {
    const idx = sorted.findIndex(s => s.id === id)
    if (idx === 0) return
    const above = sorted[idx - 1]
    const curr  = sorted[idx]
    const orderAbove = curr.sort_order
    const orderCurr  = above.sort_order
    await Promise.all([
      supabase.from('site_sections').update({ sort_order: orderAbove }).eq('id', above.id),
      supabase.from('site_sections').update({ sort_order: orderCurr  }).eq('id', curr.id),
    ])
    setSections(all => all.map(s =>
      s.id === id       ? { ...s, sort_order: orderCurr  } :
      s.id === above.id ? { ...s, sort_order: orderAbove } : s
    ))
  }

  async function moveDown(id: string) {
    const idx = sorted.findIndex(s => s.id === id)
    if (idx === sorted.length - 1) return
    const below = sorted[idx + 1]
    const curr  = sorted[idx]
    const orderBelow = curr.sort_order
    const orderCurr  = below.sort_order
    await Promise.all([
      supabase.from('site_sections').update({ sort_order: orderBelow }).eq('id', below.id),
      supabase.from('site_sections').update({ sort_order: orderCurr  }).eq('id', curr.id),
    ])
    setSections(all => all.map(s =>
      s.id === id       ? { ...s, sort_order: orderCurr  } :
      s.id === below.id ? { ...s, sort_order: orderBelow } : s
    ))
  }

  async function toggleActive(id: string) {
    const s = sections.find(s => s.id === id)!
    const next = !s.is_active
    await supabase.from('site_sections').update({ is_active: next }).eq('id', id)
    setSections(all => all.map(s => s.id === id ? { ...s, is_active: next } : s))
  }

  function startEdit(s: SiteSection) {
    setEditingId(s.id)
    setEditConfig(JSON.parse(JSON.stringify(s.config)))
  }

  async function saveEdit(id: string) {
    setSavingId(id)
    await supabase.from('site_sections').update({ config: editConfig }).eq('id', id)
    setSections(all => all.map(s => s.id === id ? { ...s, config: editConfig } : s))
    setSavingId(null)
    setEditingId(null)
    setEditConfig(null)
  }

  async function deleteSection(id: string) {
    if (!confirm('Supprimer cette section ?')) return
    await supabase.from('site_sections').delete().eq('id', id)
    setSections(all => all.filter(s => s.id !== id))
    if (editingId === id) { setEditingId(null); setEditConfig(null) }
  }

  async function addSection(type: string) {
    const maxOrder = sections.length ? Math.max(...sections.map(s => s.sort_order)) : 0
    const config = JSON.parse(JSON.stringify(DEFAULT_CONFIGS[type] ?? {}))
    const { data, error } = await supabase.from('site_sections')
      .insert({ page: 'accueil', type, sort_order: maxOrder + 1, is_active: true, config })
      .select('*').single()
    if (!error && data) {
      setSections(all => [...all, data as SiteSection])
      startEdit((data as SiteSection))
    }
    setAddingSection(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl">Pages</h1>
          <p className="text-sm mt-1" style={{ opacity: 0.5 }}>
            Gérez les sections de la page d'accueil. Les modifications s'affichent immédiatement.
          </p>
        </div>
        <button onClick={() => setAddingSection(true)} className="jc-btn-primary shrink-0">
          <Plus size={14} /> Ajouter une section
        </button>
      </div>

      {/* Add section picker */}
      {addingSection && (
        <div className="jc-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm">Choisir un type de section</p>
            <button onClick={() => setAddingSection(false)} className="p-1 rounded-lg hover:bg-black/5">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTION_TYPES.map(t => (
              <button key={t.type} onClick={() => addSection(t.type)}
                className="flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span className="text-xl">{t.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{t.label}</p>
                  <p className="text-xs opacity-50 mt-0.5">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sections list */}
      {sorted.length === 0 && !addingSection && (
        <div className="text-center py-16 opacity-30">
          <p className="text-4xl mb-3">📄</p>
          <p className="font-medium">Aucune section. Ajoutez-en une ci-dessus.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sorted.map((s, idx) => {
          const isEditing = editingId === s.id
          const isSaving  = savingId === s.id
          const typeInfo  = SECTION_TYPES.find(t => t.type === s.type)
          return (
            <div key={s.id} className="jc-card overflow-hidden" style={{ opacity: s.is_active ? 1 : 0.5 }}>
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <span className="text-xl">{typeInfo?.emoji ?? '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{sectionLabel(s.type)}</p>
                  <p className="text-xs opacity-40 truncate mt-0.5">{sectionPreview(s)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Move up/down */}
                  <button onClick={() => moveUp(s.id)} disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-black/5 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ChevronUp size={15} />
                  </button>
                  <button onClick={() => moveDown(s.id)} disabled={idx === sorted.length - 1}
                    className="p-1.5 rounded-lg hover:bg-black/5 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ChevronDown size={15} />
                  </button>
                  {/* Toggle */}
                  <button onClick={() => toggleActive(s.id)}
                    className="p-1.5 rounded-lg hover:bg-black/5"
                    title={s.is_active ? 'Masquer' : 'Afficher'}>
                    {s.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  {/* Edit */}
                  <button onClick={() => isEditing ? (setEditingId(null), setEditConfig(null)) : startEdit(s)}
                    className="p-1.5 rounded-lg hover:bg-black/5"
                    style={{ color: isEditing ? 'var(--primary)' : 'inherit' }}>
                    {isEditing ? <X size={15} /> : <Pencil size={15} />}
                  </button>
                  {/* Delete */}
                  <button onClick={() => deleteSection(s.id)}
                    className="p-1.5 rounded-lg hover:bg-black/5"
                    style={{ color: 'var(--destructive)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Inline editor */}
              {isEditing && editConfig !== null && (
                <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <ConfigEditor
                    section={{ ...s, config: editConfig }}
                    onChange={setEditConfig}
                  />
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => saveEdit(s.id)} disabled={isSaving} className="jc-btn-primary text-xs">
                      {isSaving ? 'Enregistrement…' : <><Check size={13} /> Sauvegarder</>}
                    </button>
                    <button onClick={() => { setEditingId(null); setEditConfig(null) }} className="jc-btn-ghost text-xs">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
