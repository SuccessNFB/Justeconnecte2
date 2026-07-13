'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const prev     = useRef<string | null>(null)

  useEffect(() => {
    if (pathname === prev.current) return
    prev.current = pathname
    if (pathname.startsWith('/admin')) return
    trackEvent('page_view')
  }, [pathname])

  return null
}
