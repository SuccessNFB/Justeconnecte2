import { NextResponse } from 'next/server'

// Temporary diagnostic + migration route — remove after execution
export async function GET() {
  // List available env var names (not values) to diagnose what's set
  const envKeys = Object.keys(process.env).filter(k =>
    k.includes('SUPA') || k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('DB_')
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    ?? 'https://qyvhkpyshkvogdcsbzst.supabase.co'

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? process.env.SUPABASE_SERVICE_KEY
    ?? process.env.SUPABASE_SECRET_KEY

  if (!serviceKey) {
    return NextResponse.json({
      ok: false,
      reason: 'missing_service_role_key',
      supabaseUrlFound: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      availableSupabaseEnvKeys: envKeys,
    }, { status: 500 })
  }

  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
  const pgMetaUrl  = `https://${projectRef}.supabase.co/pg-meta/v1/query`

  async function sql(query: string): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch(pgMetaUrl, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
    if (res.ok) return { ok: true }
    const text = await res.text()
    if (text.includes('already exists')) return { ok: true }
    return { ok: false, error: text.slice(0, 300) }
  }

  const results: Record<string, { ok: boolean; error?: string }> = {}

  results.create_table = await sql(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
      session_id   text        NOT NULL,
      visitor_id   text,
      event_type   text        NOT NULL,
      page         text,
      product_slug text,
      variant_id   text,
      zone         text,
      referrer     text,
      device       text,
      metadata     jsonb       DEFAULT '{}',
      created_at   timestamptz DEFAULT now()
    )
  `)

  if (!results.create_table.ok) {
    return NextResponse.json({ ok: false, step: 'create_table', results })
  }

  results.idx_type_date = await sql(
    `CREATE INDEX IF NOT EXISTS analytics_events_type_date ON analytics_events (event_type, created_at DESC)`
  )
  results.idx_session = await sql(
    `CREATE INDEX IF NOT EXISTS analytics_events_session ON analytics_events (session_id)`
  )
  results.idx_date = await sql(
    `CREATE INDEX IF NOT EXISTS analytics_events_date ON analytics_events (created_at DESC)`
  )
  results.idx_product = await sql(
    `CREATE INDEX IF NOT EXISTS analytics_events_product ON analytics_events (product_slug) WHERE product_slug IS NOT NULL`
  )
  results.enable_rls = await sql(
    `ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY`
  )
  results.policy_insert = await sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename='analytics_events' AND policyname='anon_insert_analytics'
      ) THEN
        CREATE POLICY "anon_insert_analytics" ON analytics_events FOR INSERT WITH CHECK (true);
      END IF;
    END $$
  `)
  results.policy_select = await sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename='analytics_events' AND policyname='admin_select_analytics'
      ) THEN
        CREATE POLICY "admin_select_analytics" ON analytics_events FOR SELECT USING (
          (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        );
      END IF;
    END $$
  `)

  const allOk = Object.values(results).every(r => r.ok)
  return NextResponse.json({ ok: allOk, results })
}
