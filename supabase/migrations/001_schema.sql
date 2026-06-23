-- ── ZONES GÉOGRAPHIQUES ──────────────────────────────────────────────────────
CREATE TABLE public.zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  label text NOT NULL,
  tax_rate numeric(5,4) NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.zones TO anon, authenticated;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "zones public read" ON public.zones FOR SELECT USING (true);

-- ── MARQUES ──────────────────────────────────────────────────────────────────
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.brands TO anon, authenticated;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands public read" ON public.brands FOR SELECT USING (true);

-- ── PRODUITS ─────────────────────────────────────────────────────────────────
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  specs jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  is_new boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  badge text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (is_active = true);

-- ── VARIANTES (couleur × stockage) ───────────────────────────────────────────
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color_name text NOT NULL,
  color_hex text NOT NULL,
  storage text NOT NULL,
  sku text UNIQUE NOT NULL,
  stock int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.product_variants TO anon, authenticated;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants public read" ON public.product_variants FOR SELECT USING (is_active = true);

-- ── PRIX PAR ZONE ─────────────────────────────────────────────────────────────
CREATE TABLE public.product_zone_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  zone_id uuid NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  UNIQUE(variant_id, zone_id)
);
GRANT SELECT ON public.product_zone_prices TO anon, authenticated;
ALTER TABLE public.product_zone_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prices public read" ON public.product_zone_prices FOR SELECT USING (true);

-- ── DROITS ADMIN ──────────────────────────────────────────────────────────────
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_zone_prices TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.brands TO authenticated;

CREATE POLICY "admin full access products" ON public.products
  FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin full access variants" ON public.product_variants
  FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin full access zone prices" ON public.product_zone_prices
  FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin full access brands" ON public.brands
  FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
