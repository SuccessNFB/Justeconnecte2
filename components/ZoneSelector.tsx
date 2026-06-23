'use client'
import { X } from 'lucide-react'
import { useZone } from '@/contexts/ZoneContext'
import type { Zone } from '@/lib/types'

const ZONES: Omit<Zone, 'id' | 'tax_rate' | 'sort_order'>[] = [
  { name: 'martinique',       label: 'Martinique 🇲🇶' },
  { name: 'guadeloupe',       label: 'Guadeloupe 🇬🇵' },
  { name: 'guyane',           label: 'Guyane 🇬🇫' },
  { name: 'saint-martin',     label: 'Saint-Martin 🇸🇽' },
  { name: 'saint-barthelemy', label: 'Saint-Barthélemy' },
]

export default function ZoneSelector() {
  const { showSelector, setShowSelector, setZone } = useZone()
  if (!showSelector) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowSelector(false)}
      />
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-fade-up"
        style={{ background: 'var(--surface)' }}
      >
        <button
          onClick={() => setShowSelector(false)}
          className="absolute top-4 right-4 p-1 rounded-full opacity-40 hover:opacity-100 transition-opacity"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-1">Votre zone de livraison</h2>
        <p className="text-sm mb-6" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
          Les prix s'adaptent à votre territoire.
        </p>

        <div className="flex flex-col gap-2">
          {ZONES.map(z => (
            <button
              key={z.name}
              onClick={() =>
                setZone({ id: '', name: z.name, label: z.label, tax_rate: 0, sort_order: 0 })
              }
              className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:scale-[1.01]"
              style={{
                border: '1.5px solid var(--border)',
                background: 'var(--surface-soft)',
              }}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
