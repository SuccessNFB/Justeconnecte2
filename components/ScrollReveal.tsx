'use client'
import { useInView } from '@/hooks/useInView'

type Direction = 'up' | 'left' | 'right' | 'down' | 'none'

interface Props {
  children: React.ReactNode
  delay?: number
  direction?: Direction
  duration?: number
  className?: string
  threshold?: number
}

const HIDDEN_TRANSFORM: Record<Direction, string> = {
  up:    'translateY(32px)',
  down:  'translateY(-32px)',
  left:  'translateX(-32px)',
  right: 'translateX(32px)',
  none:  'translateY(0)',
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 680,
  className = '',
  threshold = 0.1,
}: Props) {
  const { ref, inView } = useInView(threshold)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0,0)' : HIDDEN_TRANSFORM[direction],
        transition: `opacity ${duration}ms cubic-bezier(.16,1,.3,1) ${inView ? delay : 0}ms, transform ${duration}ms cubic-bezier(.16,1,.3,1) ${inView ? delay : 0}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
