-- ── FIX ADMIN RLS POLICIES ────────────────────────────────────────────────────
-- The original policies used auth.role() = 'authenticated' which grants admin
-- access to ANY authenticated Supabase user, not just site administrators.
-- This migration replaces them with a check on app_metadata.role = 'admin'.
--
-- To grant a user admin access, set their app_metadata in the Supabase dashboard:
-- Authentication → Users → select user → Edit → app_metadata: {"role": "admin"}
-- (Requires service_role key — cannot be done by the user themselves)

DROP POLICY IF EXISTS "admin full access products"     ON public.products;
DROP POLICY IF EXISTS "admin full access variants"     ON public.product_variants;
DROP POLICY IF EXISTS "admin full access zone prices"  ON public.product_zone_prices;
DROP POLICY IF EXISTS "admin full access brands"       ON public.brands;

CREATE POLICY "admin full access products" ON public.products
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin full access variants" ON public.product_variants
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin full access zone prices" ON public.product_zone_prices
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin full access brands" ON public.brands
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

GRANT INSERT, UPDATE, DELETE ON public.zones TO authenticated;
CREATE POLICY "admin full access zones" ON public.zones
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
