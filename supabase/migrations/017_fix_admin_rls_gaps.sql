-- ── FIX REMAINING ADMIN RLS GAPS ─────────────────────────────────────────────
-- Same issue 003_admin_rls.sql fixed for products/variants/prices/brands
-- (auth.role() = 'authenticated' grants access to ANY logged-in user, not just
-- admins) was never applied to tables/policies added afterwards. Fixing here.

DROP POLICY IF EXISTS "admin full categories"     ON public.categories;
DROP POLICY IF EXISTS "admin full site_content"   ON public.site_content;
DROP POLICY IF EXISTS "admin full site_sections"  ON public.site_sections;

CREATE POLICY "admin full categories" ON public.categories
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin full site_content" ON public.site_content
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin full site_sections" ON public.site_sections
  FOR ALL TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Storage: product image upload/update/delete required `authenticated` only,
-- not an admin role — any logged-in account could overwrite or delete
-- product photos.
DROP POLICY IF EXISTS "admin can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "admin can update product images" ON storage.objects;
DROP POLICY IF EXISTS "admin can delete product images" ON storage.objects;

CREATE POLICY "admin can upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'products' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin can update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'products' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin can delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'products' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
