-- ── ZONES ─────────────────────────────────────────────────────────────────────
INSERT INTO public.zones (name, label, tax_rate, sort_order) VALUES
  ('martinique-guadeloupe', 'Martinique / Guadeloupe', 0.085, 1),
  ('guyane',                'Guyane',                  0.085, 2);

-- ── MARQUES ──────────────────────────────────────────────────────────────────
INSERT INTO public.brands (name, slug, sort_order) VALUES
  ('Apple',   'apple',   1),
  ('Samsung', 'samsung', 2),
  ('Google',  'google',  3),
  ('Xiaomi',  'xiaomi',  4);

-- ── PRODUITS ─────────────────────────────────────────────────────────────────
-- iPhone 13
INSERT INTO public.products (brand_id, name, slug, description, specs, is_active, is_new, is_bestseller, badge)
SELECT b.id,
  'iPhone 13',
  'iphone-13',
  'L''iPhone 13 reconditionné offre la puissance de la puce A15 Bionic avec un système de double caméra amélioré. Reconditionné à neuf, testé et certifié.',
  '{
    "Écran": "6,1 pouces Super Retina XDR OLED",
    "Puce": "Apple A15 Bionic",
    "Caméra principale": "Deux appareils photo 12 Mpx",
    "Caméra frontale": "12 Mpx TrueDepth",
    "Batterie": "Jusqu'à 19h de lecture vidéo",
    "OS": "iOS 16 (mise à jour disponible)",
    "5G": "Oui",
    "Face ID": "Oui",
    "Résistance à l''eau": "IP68"
  }'::jsonb,
  true, true, true, 'Bestseller'
FROM public.brands b WHERE b.slug = 'apple';

-- iPhone 14
INSERT INTO public.products (brand_id, name, slug, description, specs, is_active, is_new, is_bestseller, badge)
SELECT b.id,
  'iPhone 14',
  'iphone-14',
  'L''iPhone 14 reconditionné. Mode Accident, Urgence SOS par satellite. Puce A15 Bionic éprouvée.',
  '{
    "Écran": "6,1 pouces Super Retina XDR OLED",
    "Puce": "Apple A15 Bionic",
    "Caméra principale": "12 Mpx grand-angle + ultra grand-angle",
    "Caméra frontale": "12 Mpx TrueDepth autofocus",
    "Batterie": "Jusqu'à 20h de lecture vidéo",
    "OS": "iOS 17",
    "5G": "Oui",
    "Face ID": "Oui",
    "Résistance à l''eau": "IP68"
  }'::jsonb,
  true, true, false, 'Nouveau'
FROM public.brands b WHERE b.slug = 'apple';

-- Samsung Galaxy S22
INSERT INTO public.products (brand_id, name, slug, description, specs, is_active, is_new, is_bestseller, badge)
SELECT b.id,
  'Samsung Galaxy S22',
  'samsung-galaxy-s22',
  'Le Galaxy S22 reconditionné. Un design élégant, un écran Dynamic AMOLED 120 Hz et un triple capteur photo de qualité professionnelle.',
  '{
    "Écran": "6,1 pouces Dynamic AMOLED 2X 120 Hz",
    "Puce": "Snapdragon 8 Gen 1",
    "Caméra principale": "Triple 50+12+10 Mpx",
    "Caméra frontale": "10 Mpx",
    "Batterie": "3 700 mAh – charge 25W",
    "OS": "Android 14 (One UI 6)",
    "5G": "Oui",
    "Résistance à l''eau": "IP68"
  }'::jsonb,
  true, false, true, 'Top vendeur'
FROM public.brands b WHERE b.slug = 'samsung';

-- Google Pixel 7
INSERT INTO public.products (brand_id, name, slug, description, specs, is_active, is_new, is_bestseller, badge)
SELECT b.id,
  'Google Pixel 7',
  'google-pixel-7',
  'Le Pixel 7 reconditionné avec la puce Tensor G2 et l''IA de Google. Photo nocturne exceptionnelle.',
  '{
    "Écran": "6,3 pouces OLED FHD+ 90 Hz",
    "Puce": "Google Tensor G2",
    "Caméra principale": "50 Mpx + 12 Mpx ultra grand-angle",
    "Caméra frontale": "10,8 Mpx",
    "Batterie": "4 355 mAh",
    "OS": "Android 14",
    "5G": "Oui",
    "Résistance à l''eau": "IP68"
  }'::jsonb,
  true, true, false, 'Nouveau'
FROM public.brands b WHERE b.slug = 'google';

-- ── VARIANTES iPhone 13 ────────────────────────────────────────────────────────
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Minuit',   '#1c1c1e', '128 GB', 'IP13-MID-128', 8,  1 FROM public.products p WHERE p.slug = 'iphone-13';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Minuit',   '#1c1c1e', '256 GB', 'IP13-MID-256', 5,  2 FROM public.products p WHERE p.slug = 'iphone-13';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Lumière stellaire', '#f5e6c8', '128 GB', 'IP13-STL-128', 4, 3 FROM public.products p WHERE p.slug = 'iphone-13';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Lumière stellaire', '#f5e6c8', '256 GB', 'IP13-STL-256', 2, 4 FROM public.products p WHERE p.slug = 'iphone-13';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Bleu',     '#4a90d9', '128 GB', 'IP13-BLU-128', 0,  5 FROM public.products p WHERE p.slug = 'iphone-13';

-- ── VARIANTES iPhone 14 ────────────────────────────────────────────────────────
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Minuit',   '#1c1c1e', '128 GB', 'IP14-MID-128', 6,  1 FROM public.products p WHERE p.slug = 'iphone-14';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Minuit',   '#1c1c1e', '256 GB', 'IP14-MID-256', 3,  2 FROM public.products p WHERE p.slug = 'iphone-14';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Violet',   '#8b5cf6', '128 GB', 'IP14-VIO-128', 7,  3 FROM public.products p WHERE p.slug = 'iphone-14';

-- ── VARIANTES Samsung Galaxy S22 ──────────────────────────────────────────────
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Phantom Black', '#1a1a1a', '128 GB', 'SGS22-BLK-128', 10, 1 FROM public.products p WHERE p.slug = 'samsung-galaxy-s22';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Phantom Black', '#1a1a1a', '256 GB', 'SGS22-BLK-256', 4,  2 FROM public.products p WHERE p.slug = 'samsung-galaxy-s22';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Phantom White', '#f0ede8', '128 GB', 'SGS22-WHT-128', 5,  3 FROM public.products p WHERE p.slug = 'samsung-galaxy-s22';

-- ── VARIANTES Google Pixel 7 ──────────────────────────────────────────────────
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Obsidian',   '#1c1c1e', '128 GB', 'GP7-OBS-128', 6, 1 FROM public.products p WHERE p.slug = 'google-pixel-7';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Snow',       '#f5f5f0', '128 GB', 'GP7-SNW-128', 4, 2 FROM public.products p WHERE p.slug = 'google-pixel-7';
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Lemongrass', '#b5c99a', '256 GB', 'GP7-LEM-256', 2, 3 FROM public.products p WHERE p.slug = 'google-pixel-7';

-- ── PRIX PAR ZONE ─────────────────────────────────────────────────────────────
-- iPhone 13 / Minuit 128 GB
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id,
  CASE z.name WHEN 'guyane' THEN 539.00 ELSE 529.00 END,
  CASE z.name WHEN 'guyane' THEN 709.00 ELSE 699.00 END
FROM public.product_variants v, public.zones z
WHERE v.sku = 'IP13-MID-128';

-- iPhone 13 / Minuit 256 GB
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id,
  CASE z.name WHEN 'guyane' THEN 629.00 ELSE 619.00 END,
  CASE z.name WHEN 'guyane' THEN 809.00 ELSE 799.00 END
FROM public.product_variants v, public.zones z WHERE v.sku = 'IP13-MID-256';

-- iPhone 13 / Lumière stellaire 128 GB
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 529.00, 699.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'IP13-STL-128';

-- iPhone 13 / Lumière stellaire 256 GB
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 619.00, 799.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'IP13-STL-256';

-- iPhone 13 / Bleu 128 GB
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 519.00, 699.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'IP13-BLU-128';

-- iPhone 14 variantes
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 649.00, 859.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'IP14-MID-128';
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 749.00, 979.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'IP14-MID-256';
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 649.00, 859.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'IP14-VIO-128';

-- Samsung S22 variantes
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 419.00, 599.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'SGS22-BLK-128';
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 499.00, 699.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'SGS22-BLK-256';
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 419.00, 599.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'SGS22-WHT-128';

-- Google Pixel 7 variantes
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 379.00, 549.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'GP7-OBS-128';
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 379.00, 549.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'GP7-SNW-128';
INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 459.00, 649.00
FROM public.product_variants v, public.zones z WHERE v.sku = 'GP7-LEM-256';
