import type { Brand } from '@/lib/types'

const FALLBACK_BRANDS = [
  { id: '1', name: 'Apple',   slug: 'apple'   },
  { id: '2', name: 'Samsung', slug: 'samsung' },
  { id: '3', name: 'Google',  slug: 'google'  },
  { id: '4', name: 'Xiaomi',  slug: 'xiaomi'  },
]

interface Props { brands?: Brand[] }

export default function BrandLogoStrip({ brands }: Props) {
  const list = brands?.length ? brands : FALLBACK_BRANDS
  const doubled = [...list, ...list]

  return (
    <section className="py-10 overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex animate-marquee gap-16 w-max">
        {doubled.map((b, i) => (
          <div
            key={`${b.id}-${i}`}
            className="flex items-center justify-center h-10 px-4 opacity-40 hover:opacity-80 transition-opacity"
          >
            <span className="font-bold text-xl tracking-tight">{b.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
