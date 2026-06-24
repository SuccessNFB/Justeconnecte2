import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://qyvhkpyshkvogdcsbzst.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dmhrcHlzaGt2b2dkY3NienN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTMwNDksImV4cCI6MjA5NDc4OTA0OX0.gOAeriIVthSAyb8ShldkdshdaRkh8uL18flMxKY6HVs'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}
