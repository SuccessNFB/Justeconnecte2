import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://qyvhkpyshkvogdcsbzst.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export async function GET(_req: NextRequest) {
  // Verify admin session — this route writes to the DB with the service role key
  const cookieStore = await cookies()
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL      ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { session } } = await authClient.auth.getSession()
  const role = (session?.user?.app_metadata as Record<string, string> | undefined)?.role
  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!SERVICE_KEY) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 })

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

  // Fetch products that have image_url but an empty images array
  const { data: products, error } = await supabase
    .from('products')
    .select('id, image_url, images')
    .not('image_url', 'is', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let updated = 0
  for (const p of products ?? []) {
    if (!p.images || (p.images as string[]).length === 0) {
      await supabase
        .from('products')
        .update({ images: [p.image_url] })
        .eq('id', p.id)
      updated++
    }
  }

  return NextResponse.json({ ok: true, updated, total: (products ?? []).length })
}
