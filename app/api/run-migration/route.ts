import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Temporary one-shot migration route — remove after execution
// GET /api/run-migration?key=<service_role_jwt>
// GET /api/run-migration?key=<service_role_jwt>&pat=<supabase_pat>
export const dynamic = 'force-dynamic'

const PROJECT_REF    = 'qyvhkpyshkvogdcsbzst'
const REST_API_URL   = `https://${PROJECT_REF}.supabase.co/rest/v1`
const MGMT_API_URL   = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`
const ANON_KEY       = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dmhrcHlzaGt2b2dkY3NienN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTMwNDksImV4cCI6MjA5NDc4OTA0OX0.gOAeriIVthSAyb8ShldkdshdaRkh8uL18flMxKY6HVs'

// Try Supabase Management API (requires PAT: sbp_...)
async function execSQLviaManagementAPI(sql: string, pat: string) {
  const res = await fetch(MGMT_API_URL, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${pat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  const text = await res.text()
  const ok = res.ok || text.includes('already exists') || text.includes('does not exist')
  return { ok, status: res.status, text: text.slice(0, 400), error: ok ? undefined : text.slice(0, 400), method: 'mgmt-api' }
}

// Fallback: try PostgREST /sql endpoint (service role JWT — often disabled)
async function execSQL(sql: string, serviceKey: string) {
  for (const ct of ['application/sql', 'text/plain']) {
    const res = await fetch(`${REST_API_URL}/sql`, {
      method:  'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': ct },
      body: sql,
    })
    const text = await res.text()
    if (!text.includes('PGRST102')) {
      const ok = res.ok || text.includes('already exists') || text.includes('does not exist')
      return { ok, status: res.status, text: text.slice(0, 400), error: ok ? undefined : text.slice(0, 400), method: `postgrest-${ct}` }
    }
  }
  return { ok: false, status: 400, text: 'PGRST102 on all content-types', error: 'PostgREST /sql endpoint not available', method: 'postgrest' }
}

const MIGRATION_STEPS: [string, string][] = [
  ['create_table', `
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
  `],
  ['idx_type_date', `CREATE INDEX IF NOT EXISTS analytics_events_type_date ON analytics_events (event_type, created_at DESC)`],
  ['idx_session',   `CREATE INDEX IF NOT EXISTS analytics_events_session ON analytics_events (session_id)`],
  ['idx_date',      `CREATE INDEX IF NOT EXISTS analytics_events_date ON analytics_events (created_at DESC)`],
  ['idx_product',   `CREATE INDEX IF NOT EXISTS analytics_events_product ON analytics_events (product_slug) WHERE product_slug IS NOT NULL`],
  ['enable_rls',    `ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY`],
  ['policy_insert', `
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='analytics_events' AND policyname='anon_insert_analytics') THEN
        CREATE POLICY "anon_insert_analytics" ON analytics_events FOR INSERT WITH CHECK (true);
      END IF;
    END $$
  `],
  ['policy_select', `
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='analytics_events' AND policyname='admin_select_analytics') THEN
        CREATE POLICY "admin_select_analytics" ON analytics_events FOR SELECT USING (
          (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        );
      END IF;
    END $$
  `],
]

export async function GET(req: NextRequest) {
  const serviceKey = req.nextUrl.searchParams.get('key') ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  const pat        = req.nextUrl.searchParams.get('pat') ?? process.env.SUPABASE_PAT

  if (!serviceKey) {
    return NextResponse.json({
      ok: false, reason: 'missing_key',
      hint: 'Pass ?key=<service_role_jwt> and optionally &pat=<sbp_...>',
    }, { status: 400 })
  }

  // Check if table already exists via anon REST
  const checkRes = await fetch(`${REST_API_URL}/analytics_events?select=id&limit=1`, {
    headers: { apikey: ANON_KEY },
  })
  if (checkRes.ok) {
    return NextResponse.json({ ok: true, alreadyExists: true, message: 'Table analytics_events already exists' })
  }

  const results: Record<string, { ok: boolean; status: number; text?: string; error?: string; method?: string }> = {}

  // Priority: ?pat param > serviceKey (works if sb_secret_ format) > PostgREST /sql
  const mgmtToken = pat ?? serviceKey

  for (const [label, sql] of MIGRATION_STEPS) {
    // Try Management API first (PAT or serviceKey as bearer), then PostgREST /sql as last resort
    const mgmtResult = await execSQLviaManagementAPI(sql.trim(), mgmtToken)
    if (mgmtResult.ok) {
      results[label] = mgmtResult
    } else {
      // Fallback to PostgREST /sql
      results[label] = await execSQL(sql.trim(), serviceKey)
    }
    if (!results[label].ok) break
  }

  const allOk = Object.values(results).every(r => r.ok)
  if (!allOk) {
    return NextResponse.json({
      ok: false, results,
      hint: 'All methods failed. Re-run with &pat=<sbp_...> (Supabase Personal Access Token from dashboard.supabase.com/account/tokens), OR apply supabase/migrations/004_analytics.sql manually in the Supabase SQL Editor.',
    }, { status: 500 })
  }
  return NextResponse.json({ ok: allOk, results }, { status: 200 })
}
