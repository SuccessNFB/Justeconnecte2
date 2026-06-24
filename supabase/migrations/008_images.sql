-- ── COLONNES IMAGES SUR LES PRODUITS ─────────────────────────────────────────
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS images    JSONB DEFAULT '[]'::jsonb;

-- ── BUCKET STORAGE PRODUITS ───────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  10485760,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ── POLICIES STORAGE ─────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "product images public read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin can upload product images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'products');
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin can update product images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'products');
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin can delete product images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'products');
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
