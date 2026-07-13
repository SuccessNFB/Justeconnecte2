import { createClient } from '@/lib/supabase'

export type EventType =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'purchase'

function getOrCreate(storage: Storage, key: string): string {
  let id = storage.getItem(key)
  if (!id) { id = crypto.randomUUID(); storage.setItem(key, id) }
  return id
}

function device(): string {
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export async function trackEvent(
  type: EventType,
  extra: {
    productSlug?: string
    variantId?: string
    zone?: string
    metadata?: Record<string, unknown>
  } = {}
) {
  if (typeof window === 'undefined') return
  if (window.location.pathname.startsWith('/admin')) return
  try {
    await createClient().from('analytics_events').insert({
      session_id:   getOrCreate(sessionStorage, 'jc_sid'),
      visitor_id:   getOrCreate(localStorage,   'jc_vid'),
      event_type:   type,
      page:         window.location.pathname,
      product_slug: extra.productSlug ?? null,
      variant_id:   extra.variantId   ?? null,
      zone:         extra.zone        ?? null,
      referrer:     document.referrer || null,
      device:       device(),
      metadata:     extra.metadata    ?? {},
    })
  } catch {
    // Analytics must never break the app
  }
}
