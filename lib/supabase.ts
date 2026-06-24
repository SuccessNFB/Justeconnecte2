import { createBrowserClient } from '@supabase/ssr'

// Fallbacks prevent crash during build/SSR when env vars aren't in Vercel yet.
// All requests will fail gracefully with empty data until real credentials are set.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}
