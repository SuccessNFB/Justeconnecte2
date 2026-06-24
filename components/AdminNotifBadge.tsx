'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AdminNotifBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    createClient()
      .from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'checkout_start')
      .gte('created_at', today.toISOString())
      .then(({ count: c }) => setCount(c ?? 0))
  }, [])

  if (!count) return null

  return (
    <span
      className="ml-auto flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-bold"
      style={{ background: '#22c55e' }}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
