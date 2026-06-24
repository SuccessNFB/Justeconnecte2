import { NextRequest, NextResponse } from 'next/server'

// Temporary one-shot migration route — remove after execution
// Usage: POST /api/run-migration with body { "key": "<service_role_key>" }
// OR set SUPABASE_SERVICE_ROLE_KEY in Vercel env vars and call GET /api/run-migration

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?? 'https://qyvhkpyshkvogdcsbzst.supabase.co'

async function runMigration(serviceKey: string) {
  const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')
  const pgMetaUrl  = `https://${projectRef}.supabase.co/pg-meta/v1/query`

  async function sql(label: string, query: string) {
    const res = await fetch(pgMetaUrl, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
    const text = await res.text()
    const ok = res.ok || text.includes('already exists') || text.includes('relation') === false
    return { label, ok, status: res.status, error: ok ? undefined : text.slice(0, 300) }
  }

  const steps = await Promise.all([
    sql('create_table', `
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
    `),
  ])

  // Only continue if table creation succeeded
  if (!steps[0].ok) return { ok: false, steps }

  const remaining = await Promise.all([
    sql('idx_type_date', `CREATE INDEX IF NOT EXISTS analytics_events_type_date ON analytics_events (event_type, created_at DESC)`),
    sql('idx_session',   `CREATE INDEX IF NOT EXISTS analytics_events_session ON analytics_events (session_id)`),
    sql('idx_date',      `CREATE INDEX IF NOT EXISTS analytics_events_date ON analytics_events (created_at DESC)`),
    sql('idx_product',   `CREATE INDEX IF NOT EXISTS analytics_events_product ON analytics_events (product_slug) WHERE product_slug IS NOT NULL`),
    sql('enable_rls',    `ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY`),
    sql('policy_insert', `
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='analytics_events' AND policyname='anon_insert_analytics') THEN
          CREATE POLICY "anon_insert_analytics" ON analytics_events FOR INSERT WITH CHECK (true);
        END IF;
      END $$
    `),
    sql('policy_select', `
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='analytics_events' AND policyname='admin_select_analytics') THEN
          CREATE POLICY "admin_select_analytics" ON analytics_events FOR SELECT USING (
            (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
          );
        END IF;
      END $$
    `),
  ])

  const all = [...steps, ...remaining]
  return { ok: all.every(s => s.ok), steps: all }
}

export async function GET() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({
      ok: false,
      reason: 'missing_key',
      hint: 'POST { "key": "<service_role_key>" } or set SUPABASE_SERVICE_ROLE_KEY in Vercel env vars',
    }, { status: 400 })
  }
  const result = await runMigration(serviceKey)
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}

export async function POST(req: NextRequest) {
  let serviceKey: string | undefined
  try {
    const body = await req.json()
    serviceKey = body?.key
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }
  if (!serviceKey) {
    serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  }
  if (!serviceKey) {
    return NextResponse.json({ ok: false, reason: 'missing_key' }, { status: 400 })
  }
  const result = await runMigration(serviceKey)
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
