'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useZone } from '@/contexts/ZoneContext'

interface PromoConfig {
  text:     string
  cta?:     string
  cta_href?: string
}

/** Affiche en pop-up la bannière promo/annonce gérée depuis l'admin (Pages → Bannière promo). */
export default function PromoPopup() {
  const { showSelector } = useZone()
  const [promo, setPromo]     = useState<PromoConfig | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('site_sections')
      .select('config')
      .eq('page', 'accueil')
      .eq('type', 'banner')
      .eq('is_active', true)
      .order('sort_order')
      .limit(1)
      .then(({ data }) => {
        const cfg = data?.[0]?.config as PromoConfig | undefined
        if (!cfg?.text) return
        const key = `jc-promo-seen:${cfg.text.slice(0, 60)}`
        try { if (sessionStorage.getItem(key)) return } catch {}
        setPromo(cfg)
      })
  }, [])

  useEffect(() => {
    if (!promo || showSelector) return
    const t = setTimeout(() => setVisible(true), 700)
    return () => clearTimeout(t)
  }, [promo, showSelector])

  function dismiss() {
    setVisible(false)
    if (promo) {
      try { sessionStorage.setItem(`jc-promo-seen:${promo.text.slice(0, 60)}`, '1') } catch {}
    }
  }

  if (!promo || !visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-fade-up text-center"
        style={{ background: 'var(--surface)' }}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1 rounded-full opacity-40 hover:opacity-100 transition-opacity"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        <p className="jc-overline mb-3">Annonce</p>
        <p className="font-bold text-lg mb-6">{promo.text}</p>

        {promo.cta && promo.cta_href && (
          <Link href={promo.cta_href} onClick={dismiss} className="jc-btn-primary inline-flex">
            {promo.cta}
          </Link>
        )}
      </div>
    </div>
  )
}
