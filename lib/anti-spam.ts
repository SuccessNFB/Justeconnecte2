import type { SupabaseClient } from '@supabase/supabase-js'

const DUPLICATE_WINDOW_MS = 60_000

/**
 * True if an identical pending order (same email + total) was created in the
 * last minute — throttles repeated/spam checkout submissions without
 * blocking a genuine customer retrying a failed payment later.
 */
export async function isDuplicateOrder(
  supabase: SupabaseClient,
  email: string | undefined,
  totalEur: string
): Promise<boolean> {
  if (!email) return false
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString()
  const { data } = await supabase
    .from('orders')
    .select('id')
    .eq('customer_email', email)
    .eq('total_eur', totalEur)
    .eq('status', 'pending')
    .gte('created_at', since)
    .limit(1)
  return !!(data && data.length > 0)
}
