-- ── ORDERS TABLE ─────────────────────────────────────────────────────────────
-- Stores pre-checkout order data collected on /commande (before Monetico redirect).
-- Status is updated to 'paid' by the Monetico server-to-server notification.

CREATE TABLE IF NOT EXISTS public.orders (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference          text        UNIQUE NOT NULL,
  status             text        NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid'
  customer_prenom    text        NOT NULL DEFAULT '',
  customer_nom       text        NOT NULL DEFAULT '',
  customer_email     text        NOT NULL DEFAULT '',
  customer_telephone text        NOT NULL DEFAULT '',
  customer_adresse   text        NOT NULL DEFAULT '',
  delivery_zone      text        NOT NULL DEFAULT '',
  items              jsonb       NOT NULL DEFAULT '[]',
  total_eur          numeric(10,2) NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  paid_at            timestamptz
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Authenticated admins can do everything
CREATE POLICY "admin full access orders" ON public.orders
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Inserts and status updates from API routes use the service role key
-- (bypasses RLS — no anon policy needed)

GRANT SELECT ON public.orders TO authenticated;
GRANT ALL    ON public.orders TO service_role;
