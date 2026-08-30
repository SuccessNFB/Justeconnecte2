'use client'
import { useInView } from '@/hooks/useInView'

interface CheckPoint {
  x:     number
  y:     number
  label: string
  side:  'left' | 'right'
}

const POINTS: CheckPoint[] = [
  { x: 130, y: 58,  label: 'Caméra & module photo',      side: 'left'  },
  { x: 118, y: 150, label: 'Écran — pixels & tactile',    side: 'left'  },
  { x: 210, y: 230, label: 'Boutons & connectique',       side: 'right' },
  { x: 118, y: 340, label: 'Batterie — capacité réelle',  side: 'left'  },
  { x: 130, y: 430, label: 'Châssis & étanchéité',        side: 'right' },
]

/** Mockup vectoriel du contrôle qualité — pas une photo, pas une icône générique. */
export default function PhoneCheckMockup({ accent = 'var(--gold)' }: { accent?: string }) {
  const { ref, inView } = useInView(0.25)

  return (
    <div ref={ref} className="relative w-full" style={{ maxWidth: 460, margin: '0 auto' }}>
      <svg viewBox="0 0 340 480" width="100%" role="img" aria-label="Schéma des points de contrôle qualité d'un smartphone reconditionné">
        <defs>
          <linearGradient id="pcm-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="oklch(0.22 0.01 264)" />
            <stop offset="100%" stopColor="oklch(0.14 0.01 264)" />
          </linearGradient>
          <radialGradient id="pcm-glow" cx="50%" cy="35%" r="65%">
            <stop offset="0%"  stopColor={accent} stopOpacity="0.16" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo */}
        <rect x="0" y="0" width="340" height="480" fill="url(#pcm-glow)" />

        {/* corps du téléphone */}
        <rect x="105" y="10" width="130" height="460" rx="34"
          fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
        {/* écran */}
        <rect x="116" y="26" width="108" height="392" rx="22" fill="url(#pcm-screen)" />
        {/* encoche caméra */}
        <rect x="152" y="40" width="36" height="10" rx="5" fill="var(--surface)" opacity="0.9" />
        <circle cx="188" cy="45" r="3" fill="oklch(0.3 0.02 264)" />
        {/* boutons */}
        <rect x="101" y="150" width="4" height="34" rx="2" fill="var(--border-strong)" />
        <rect x="101" y="200" width="4" height="50" rx="2" fill="var(--border-strong)" />
        <rect x="235" y="170" width="4" height="46" rx="2" fill="var(--border-strong)" />
        {/* barre home */}
        <rect x="150" y="398" width="40" height="4" rx="2" fill="var(--border-strong)" opacity="0.6" />

        {/* points de contrôle */}
        {POINTS.map((p, i) => {
          const lineEndX = p.side === 'left' ? p.x - 46 : p.x + 46
          return (
            <g key={p.label}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'scale(1)' : 'scale(0.6)',
                transformOrigin: `${p.x}px ${p.y}px`,
                transition: `opacity 420ms ease ${280 + i * 160}ms, transform 420ms cubic-bezier(.34,1.56,.64,1) ${280 + i * 160}ms`,
              }}
            >
              <line x1={p.x} y1={p.y} x2={lineEndX} y2={p.y} stroke={accent} strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />
              <circle cx={p.x} cy={p.y} r="9" fill={accent} opacity="0.15" />
              <circle cx={p.x} cy={p.y} r="4" fill={accent} />
            </g>
          )
        })}
      </svg>

      {/* étiquettes — alignées avec le point réel du SVG (même repère de coordonnées) */}
      {POINTS.map((p, i) => {
        const lineEndX = p.side === 'left' ? p.x - 46 : p.x + 46
        const edgePct  = (lineEndX / 340) * 100
        return (
          <div
            key={p.label}
            className="absolute text-[11px] sm:text-xs font-semibold whitespace-nowrap"
            style={{
              top:   `${(p.y / 480) * 100}%`,
              ...(p.side === 'left'
                ? { right: `${100 - edgePct}%` }
                : { left: `${edgePct}%` }),
              transform: 'translateY(-50%)',
              color: 'oklch(0.18 0.004 264 / 0.65)',
              textAlign: p.side,
              opacity: inView ? 1 : 0,
              transition: `opacity 420ms ease ${340 + i * 160}ms`,
            }}
          >
            {p.label}
          </div>
        )
      })}
    </div>
  )
}
