-- ── 009 SYNC PRODUITS – images + nettoyage (CSV Shopify 2026-06-25) ──────────

-- 1. Désactiver les anciens produits démo absents du CSV
UPDATE public.products SET is_active = false
WHERE slug IN ('iphone-13', 'iphone-14', 'samsung-galaxy-s22', 'google-pixel-7');

-- 2. Corriger le nom "SamsungGalaxy S26 Ultra"
UPDATE public.products SET name = 'Samsung Galaxy S26 Ultra'
WHERE slug = 'samsung-galaxy-s26-ultra';

-- 3. Définir image_url depuis le CDN Shopify pour tous les produits actifs
UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1311.jpg?v=1778781337'
WHERE slug = 'iphone-17';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/B942644E-32EC-40D0-84D7-D5F2CA2EDF3C.png?v=1778857015'
WHERE slug = 'samsung-galaxy-a37';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/FDFD729A-07D5-4F54-A1A2-303A93AD6D57.png?v=1778856783'
WHERE slug = 'samsung-galaxy-a57';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1012.webp?v=1776995420'
WHERE slug = 'xiaomi-15';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1006_9ff53951-5713-4bdd-a193-19bc71eb4991.webp?v=1776994376'
WHERE slug = 'xiaomi-15-t';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-0985.webp?v=1776926738'
WHERE slug = 'xiaomi-15-t-pro';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/2DAB7588-6AC4-4258-BCDD-2D35945E6897.png?v=1776374897'
WHERE slug = 'samsung-galaxy-s26-plus';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/D0A81291-2779-4095-B2C0-F6D0C68E306C.png?v=1776374778'
WHERE slug = 'samsung-galaxy-s26';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-0062.png?v=1776374854'
WHERE slug = 'samsung-galaxy-s26-ultra';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9343.jpg?v=1764266220'
WHERE slug = 'xiaomi-redmi-note-14-pro';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9333.jpg?v=1776375373'
WHERE slug = 'iphone-air';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9339.webp?v=1764259834'
WHERE slug = 'iphone-16-pro-max';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9394.png?v=1776375420'
WHERE slug = 'iphone-17-pro-max';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9323.jpg?v=1776375123'
WHERE slug = 'iphone-17-pro';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9399.png?v=1776375347'
WHERE slug = 'samsung-galaxy-z-fold-7';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1346.png?v=1778857696'
WHERE slug = 'samsung-galaxy-s25';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1345.png?v=1778857593'
WHERE slug = 'samsung-galaxy-s25-ultra';

UPDATE public.products SET image_url = 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-8980.jpg?v=1776375284'
WHERE slug = 'iphone-16';

-- 4. Ajouter la marque GoPro
INSERT INTO public.brands (name, slug, sort_order)
VALUES ('GoPro', 'gopro', 5)
ON CONFLICT (slug) DO NOTHING;

-- 5. GoPro HERO 13 – Neuf
INSERT INTO public.products (brand_id, name, slug, description, specs, is_active, is_new, is_bestseller, badge, image_url)
SELECT b.id,
  'GoPro HERO 13 – Neuf',
  'gopro-hero-13',
  'GoPro HERO 13 neuve, scellée. Livraison Martinique, Guadeloupe & Guyane incluse. Aucun frais caché. 🎬 Qualité vidéo ultra nette et fluide 🌊 Caméra conçue pour l''action : résistante, étanche et fiable 📸 Photos et vidéos stabilisées, même en mouvement 🔋 Autonomie optimisée pour filmer plus longtemps',
  '{"Type": "Caméra d''action", "Résolution vidéo": "5.3K60 / 4K120 / 2.7K240", "Résistance à l''eau": "10 m sans boîtier", "Stabilisation": "HyperSmooth 6.0", "Écran": "2,27 po + écran frontal 1,4 po", "Batterie": "Enduro rechargeable"}'::jsonb,
  true, true, false, NULL,
  'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9362.png?v=1764342366'
FROM public.brands b WHERE b.slug = 'gopro'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Noir', '#1c1c1e', '', 'GPRO13-BLK', 10, 1
FROM public.products p WHERE p.slug = 'gopro-hero-13'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 499.00, NULL
FROM public.product_variants v, public.zones z
WHERE v.sku = 'GPRO13-BLK'
ON CONFLICT (variant_id, zone_id) DO NOTHING;

-- 6. GoPro HERO 13 + Pack d'accessoires
INSERT INTO public.products (brand_id, name, slug, description, specs, is_active, is_new, is_bestseller, badge, image_url)
SELECT b.id,
  'GoPro HERO 13 + Pack d''accessoires',
  'gopro-hero-13-pack',
  'GoPro HERO13 + Accessoires. Livraison Martinique, Guadeloupe & Guyane incluse. Aucun frais caché. 🎥 Vidéo fluide et haute qualité 🌊 Conçue pour l''aventure 🎒 Accessoires inclus pour filmer immédiatement. Pack complet prêt à l''emploi.',
  '{"Type": "Pack caméra d''action + accessoires", "Résolution vidéo": "5.3K60 / 4K120 / 2.7K240", "Résistance à l''eau": "10 m sans boîtier", "Stabilisation": "HyperSmooth 6.0", "Garantie": "1 an constructeur"}'::jsonb,
  true, true, false, NULL,
  'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9362.png?v=1764342366'
FROM public.brands b WHERE b.slug = 'gopro'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, sku, stock, sort_order)
SELECT p.id, 'Noir', '#1c1c1e', '', 'GPRO13-PACK-BLK', 10, 1
FROM public.products p WHERE p.slug = 'gopro-hero-13-pack'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id, zone_id, price, compare_at_price)
SELECT v.id, z.id, 599.00, NULL
FROM public.product_variants v, public.zones z
WHERE v.sku = 'GPRO13-PACK-BLK'
ON CONFLICT (variant_id, zone_id) DO NOTHING;
