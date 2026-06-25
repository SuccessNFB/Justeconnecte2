'use client'
import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { SiteContent } from '@/lib/types'

const PAGE_LABELS: Record<string, string> = {
  global:  'Paramètres globaux',
  accueil: "Page d'accueil",
  produit: 'Fiche produit',
}

const SECTION_META: Record<string, { label: string; emoji: string; hint?: string }> = {
  contact:      { label: 'Contact & WhatsApp',        emoji: '📱', hint: 'Le numéro WhatsApp est utilisé sur tout le site (CTA accueil, bouton produit…).' },
  hero:         { label: 'Section Héro',               emoji: '🎯' },
  social_proof: { label: 'Barre de statistiques',      emoji: '📊', hint: 'Les 4 chiffres-clés affichés juste sous le héro.' },
  whatsapp_cta: { label: 'Section WhatsApp',           emoji: '💬' },
  trust:        { label: 'Badges de confiance',        emoji: '🛡️' },
  faq:          { label: 'FAQ',                        emoji: '❓' },
}

const KEY_LABELS: Record<string, string> = {
  // Contact
  whatsapp_number: 'Numéro WhatsApp (sans +, ex: 596123456)',
  whatsapp_label:  'Texte du bouton WhatsApp',
  response_time:   'Mention temps de réponse',
  // Hero
  badge:           'Accroche / Badge',
  title:           'Titre principal',
  subtitle:        'Sous-titre',
  cta_primary:     'Bouton principal',
  cta_secondary:   'Bouton secondaire',
  // Social proof
  stat1_value:     'Stat 1 · Chiffre',
  stat1_label:     'Stat 1 · Libellé',
  stat2_value:     'Stat 2 · Chiffre',
  stat2_label:     'Stat 2 · Libellé',
  stat3_value:     'Stat 3 · Chiffre',
  stat3_label:     'Stat 3 · Libellé',
  stat4_value:     'Stat 4 · Chiffre',
  stat4_label:     'Stat 4 · Libellé',
  // WhatsApp CTA
  btn_label:       'Texte du bouton',
  // Trust
  '1_title':       'Argument 1 · Titre',
  '1_body':        'Argument 1 · Description',
  '2_title':       'Argument 2 · Titre',
  '2_body':        'Argument 2 · Description',
  '3_title':       'Argument 3 · Titre',
  '3_body':        'Argument 3 · Description',
  '4_title':       'Argument 4 · Titre',
  '4_body':        'Argument 4 · Description',
  // FAQ
  '1_q': 'Question 1',
  '1_a': 'Réponse 1',
  '2_q': 'Question 2',
  '2_a': 'Réponse 2',
  '3_q': 'Question 3',
  '3_a': 'Réponse 3',
  '4_q': 'Question 4',
  '4_a': 'Réponse 4',
  '5_q': 'Question 5',
  '5_a': 'Réponse 5',
}

const PAGE_ORDER    = ['global', 'accueil', 'produit']
const SECTION_ORDER = ['contact', 'hero', 'social_proof', 'whatsapp_cta', 'trust', 'faq']

export default function ContenuPage() {
  const supabase = createClient()
  const [rows, setRows]       = useState<SiteContent[]>([])
  const [edits, setEdits]     = useState<Record<string, string>>({})
  const [saving, setSaving]   = useState<string | null>(null)
  const [saved, setSaved]     = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_content').select('*')
      .then(({ data }) => {
        const content = (data ?? []) as SiteContent[]
        setRows(content)
        const init: Record<string, string> = {}
        for (const r of content) init[r.id] = r.value
        setEdits(init)
        setLoading(false)
      })
  }, [])

  async function saveSection(page: string, section: string) {
    const k = `${page}.${section}`
    setSaving(k)
    const sect = rows.filter(r => r.page === page && r.section === section)
    await Promise.all(sect.map(r =>
      supabase.from('site_content').update({ value: edits[r.id] ?? r.value }).eq('id', r.id)
    ))
    setSaving(null)
    setSaved(k)
    setTimeout(() => setSaved(null), 2500)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  const pages = PAGE_ORDER.filter(p => rows.some(r => r.page === p))

  if (pages.length === 0) return (
    <div>
      <h1 className="font-bold text-2xl mb-2">Contenu du site</h1>
      <p className="text-sm mb-8" style={{ opacity: 0.5 }}>
        Modifiez les textes par section. Les changements s'affichent immédiatement.
      </p>
      <div className="jc-card p-10 text-center" style={{ opacity: 0.3 }}>
        <p className="text-4xl mb-3">📭</p>
        <p className="font-semibold text-sm">Aucune entrée dans site_content.</p>
        <p className="text-xs mt-1">Appliquez la migration 011 dans Supabase pour débloquer l'édition.</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-bold text-2xl">Contenu du site</h1>
          <p className="text-sm mt-1" style={{ opacity: 0.5 }}>
            Modifiez les textes par section. Les changements s'affichent immédiatement.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="jc-btn-ghost flex items-center gap-2 text-sm shrink-0">
          <ExternalLink size={14} /> Voir le site
        </a>
      </div>

      <div className="space-y-10">
        {pages.map(page => {
          const sections = SECTION_ORDER.filter(s => rows.some(r => r.page === page && r.section === s))
          if (!sections.length) return null
          return (
            <div key={page}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
                {PAGE_LABELS[page] ?? page}
              </p>
              <div className="flex flex-col gap-4">
                {sections.map(section => {
                  const meta = SECTION_META[section]
                  const sectRows = rows.filter(r => r.page === page && r.section === section)
                  const sk = `${page}.${section}`
                  const isSaving = saving === sk
                  const isSaved  = saved  === sk
                  return (
                    <div key={section} className="jc-card overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center gap-3 p-5 pb-4">
                        <span className="text-xl">{meta?.emoji ?? '📝'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{meta?.label ?? section}</p>
                          {meta?.hint && (
                            <p className="text-xs mt-0.5 opacity-40 leading-tight">{meta.hint}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => saveSection(page, section)}
                          disabled={isSaving}
                          className="jc-btn-primary py-1.5 px-4 text-xs shrink-0"
                          style={isSaved ? { background: 'var(--success, #22c55e)' } : {}}
                        >
                          {isSaving ? 'Enregistrement…' : isSaved ? '✓ Sauvegardé' : 'Sauvegarder'}
                        </button>
                      </div>
                      {/* Fields */}
                      <div className="px-5 pb-5 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="pt-3" />
                        {sectRows.map(r => (
                          <div key={r.id}>
                            <label className="block text-xs font-semibold mb-1.5" style={{ opacity: 0.45 }}>
                              {KEY_LABELS[r.key] ?? r.key}
                            </label>
                            {r.type === 'textarea' ? (
                              <textarea
                                className="jc-input resize-none"
                                rows={3}
                                value={edits[r.id] ?? r.value}
                                onChange={e => setEdits(prev => ({ ...prev, [r.id]: e.target.value }))}
                              />
                            ) : (
                              <input
                                className="jc-input"
                                value={edits[r.id] ?? r.value}
                                onChange={e => setEdits(prev => ({ ...prev, [r.id]: e.target.value }))}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
