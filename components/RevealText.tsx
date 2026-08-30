'use client'
import { useInView } from '@/hooks/useInView'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

interface Props {
  text:      string
  as?:       Tag
  className?: string
  style?:    React.CSSProperties
  delay?:    number
  stagger?:  number
}

/** Titre qui se révèle mot par mot au scroll (masque + glissement), pas un simple fade de bloc. */
export default function RevealText({ text, as = 'span', className = '', style, delay = 0, stagger = 45 }: Props) {
  const { ref, inView } = useInView(0.35)
  const words = text.split(' ')
  const Tag = as as any

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em' }}
        >
          <span
            style={{
              display:    'inline-block',
              transform:  inView ? 'translateY(0%)' : 'translateY(115%)',
              opacity:    inView ? 1 : 0,
              transition: `transform 640ms cubic-bezier(.16,1,.3,1) ${delay + i * stagger}ms, opacity 520ms ease ${delay + i * stagger}ms`,
            }}
          >
            {word}{i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
