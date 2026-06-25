'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Check, ExternalLink, Save } from 'lucide-react'

const PAGES = [
  { key: 'contact',          label: 'Fiche contact',        emoji: '📬', href: '/contact',          placeholder: 'Adresse, téléphone, email, horaires, lien WhatsApp…' },
  { key: 'retours-garantie', label: 'Retours et garantie',  emoji: '↩️', href: '/retours-garantie', placeholder: 'Conditions de retour, délais, procédure à suivre…' },
  { key: 'mentions-legales', label: 'Mentions légales',     emoji: '⚖️', href: '/mentions-legales', placeholder: 'Éditeur, hébergeur, propriété intellectuelle…' },
  { key: 'cgv',              label: 'CGV',                  emoji: '📋', href: '/cgv',              placeholder: 'Conditions générales de vente…' },
  { key: 'confidentialite',  label: 'Confidentialité',      emoji: '🔒', href: '/confidentialite',  placeholder: 'Politique de confidentialité, cookies, RGPD…' },
]

export default function PagesLegalesAdmin() {
  const supabase = createClient()
  const [active, setActive]   = useState(PAGES[0].key)
  const [contents, setContents] = useState<Record<string, string>>({})
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('site_content')
      .select('*')
      .in('page', PAGES.map(p => p.key))
      .eq('section', 'main')
      .eq('key', 'content')
      .then(({ data }) => {
        const map: Record<string, string> = {}
        for (const row of data ?? []) map[row.page] = row.value
        setContents(map)
        setLoading(false)
      })
  }, [])

  const page = PAGES.find(p => p.key === active)!

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const value = contents[active] ?? ''
    const existing = await supabase
      .from('site_content')
      .select('id')
      .eq('page', active)
      .eq('section', 'main')
      .eq('key', 'content')
      .maybeSingle()

    if (existing.data?.id) {
      await supabase.from('site_content').update({ value }).eq('id', existing.data.id)
    } else {
      await supabase.from('site_content').insert({ page: active, section: 'main', key: 'content', value, type: 'text' })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-bold text-2xl">Pages légales & contact</h1>
        <p className="text-sm mt-1" style={{ opacity: 0.5 }}>
          Rédigez le contenu de chaque page. Les modifications sont visibles immédiatement sur le site.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {PAGES.map(p => (
          <button
            key={p.key}
            onClick={() => { setActive(p.key); setSaved(false) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: active === p.key ? 'var(--primary)' : 'var(--surface)',
              color: active === p.key ? 'white' : 'inherit',
              border: '1px solid var(--border)',
            }}
          >
            <span>{p.emoji}</span> {p.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="jc-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{page.emoji} {page.label}</h2>
          <a
            href={page.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs opacity-50 hover:opacity-100 transition-opacity"
          >
            <ExternalLink size={12} /> Voir la page
          </a>
        </div>

        <textarea
          className="jc-input resize-none w-full font-mono text-sm leading-relaxed"
          rows={20}
          placeholder={page.placeholder}
          value={contents[active] ?? ''}
          onChange={e => setContents(prev => ({ ...prev, [active]: e.target.value }))}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="jc-btn-primary flex items-center gap-2"
          >
            {saved
              ? <><Check size={14} /> Enregistré</>
              : saving
              ? 'Enregistrement…'
              : <><Save size={14} /> Enregistrer</>
            }
          </button>
          <p className="text-xs" style={{ opacity: 0.4 }}>
            Les sauts de ligne sont conservés à l'affichage.
          </p>
        </div>
      </div>
    </div>
  )
}
