-- ── 010 POPULATE images[] FROM image_url ──────────────────────────────────────
-- For every product that has image_url set but an empty/null images array,
-- seed images[0] with image_url so the product-detail carousel always has data.
-- Additional angles can be added via /admin/images (they accumulate in images[]).

UPDATE public.products
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND (images IS NULL OR images = '{}');
