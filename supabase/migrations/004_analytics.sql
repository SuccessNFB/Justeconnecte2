-- Analytics events table
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
);

CREATE INDEX IF NOT EXISTS analytics_events_type_date  ON analytics_events (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_session     ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS analytics_events_date        ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_product     ON analytics_events (product_slug) WHERE product_slug IS NOT NULL;

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Anonymous visitors can INSERT events
CREATE POLICY "anon_insert_analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Only admins can SELECT
CREATE POLICY "admin_select_analytics" ON analytics_events
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
