'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { SiteContent } from '@/lib/types'

const PAGE_LABELS: Record<string, string> = {
  accueil: 'Accueil',
  produit: 'Fiche produit',
}

const SECTION_LABELS: Record<string, string> = {
  hero:  'Section Héro',
  trust: 'Badges de confiance',
  faq:   'FAQ',
}

const KEY_LABELS: Record<string, string> = {
  badge:         'Badge',
  title:         'Titre',
  subtitle:      'Sous-titre',
  cta_primary:   'Bouton principal',
  cta_secondary: 'Bouton secondaire',
  '1_title': 'Avantage 1 · Titre',
  '1_body':  'Avantage 1 · Description',
  '2_title': 'Avantage 2 · Titre',
  '2_body':  'Avantage 2 · Description',
  '3_title': 'Avantage 3 · Titre',
  '3_body':  'Avantage 3 · Description',
  '4_title': 'Avantage 4 · Titre',
  '4_body':  'Avantage 4 · Description',
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

const PAGE_ORDER = ['accueil', 'produit']
const SECTION_ORDER = ['hero', 'trust', 'faq']

export default function ContenuPage() {
  const supabase = createClient()
  const [rows, setRows] = useState<SiteContent[]>([])
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_content').select('*')
      .then(({ data }) => {
        const content = (data ?? []) as SiteContent[]
        setRows(content)
        const initial: Record<string, string> = {}
        for (const r of content) initial[r.id] = r.value
        setEdits(initial)
        setLoading(false)
      })
  }, [])

  async function saveSection(page: string, section: string) {
    const sectionKey = `${page}.${section}`
    setSaving(sectionKey)
    const sectionRows = rows.filter(r => r.page === page && r.section === section)
    await Promise.all(
      sectionRows.map(r =>
        supabase.from('site_content').update({ value: edits[r.id] ?? r.value }).eq('id', r.id)
      )
    )
    setSaving(null)
    setSaved(sectionKey)
    setTimeout(() => setSaved(null), 2000)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  const pages = PAGE_ORDER.filter(p => rows.some(r => r.page === p))

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-bold text-2xl">Contenu du site</h1>
        <p className="text-sm mt-1" style={{ opacity: 0.5 }}>
          Modifiez les textes par section. Les changements s'affichent immédiatement sur le site.
        </p>
      </div>

      {pages.map(page => {
        const sections = SECTION_ORDER.filter(s => rows.some(r => r.page === page && r.section === s))
        return (
          <div key={page}>
            <h2 className="font-bold text-base mb-4" style={{ color: 'var(--gold)' }}>
              {PAGE_LABELS[page] ?? page}
            </h2>
            <div className="flex flex-col gap-4">
              {sections.map(section => {
                const sectionRows = rows.filter(r => r.page === page && r.section === section)
                const sectionKey = `${page}.${section}`
                const isSaving = saving === sectionKey
                const isSaved = saved === sectionKey
                return (
                  <section key={section} className="jc-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm">{SECTION_LABELS[section] ?? section}</h3>
                      <button
                        type="button"
                        onClick={() => saveSection(page, section)}
                        disabled={isSaving}
                        className="jc-btn-primary py-1.5 px-4 text-xs"
                        style={isSaved ? { background: 'var(--success, #22c55e)' } : {}}
                      >
                        {isSaving ? 'Enregistrement…' : isSaved ? '✓ Sauvegardé' : 'Sauvegarder'}
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {sectionRows.map(r => (
                        <div key={r.id}>
                          <label className="block text-xs font-semibold mb-1">
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
                  </section>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
