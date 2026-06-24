-- ── NOUVEAUX PRODUITS (import CSV Shopify 2026-06-24) ───────────────────────

-- iPhone 17
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'iPhone 17','iphone-17','Pourquoi choisir l’iPhone 17  💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir l’iPhone 17  📸 Appareil photo avancé pour des photos et vidéos nettes au quotidien ⚡ Puce ultra fluide idéale pour les réseaux sociaux, le multitâche et le gaming ✨ Design premium avec écran immersif et finitions élégantes 🔋 Excellente autonomie avec recharge rapide et efficace Un smartphone moderne et performant pensé pour offrir une expér','{"Ecran": "6,1 po OLED Super Retina XDR", "Puce": "Apple A18", "Camera": "48 Mpx + 12 Mpx", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='apple' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','256 Go','IP17-BLK-256',10,1
FROM public.products p WHERE p.slug='iphone-17' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','256 Go','IP17-VIO-256',10,2
FROM public.products p WHERE p.slug='iphone-17' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','256 Go','IP17-WHT-256',10,3
FROM public.products p WHERE p.slug='iphone-17' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','256 Go','IP17-BLU-256',10,4
FROM public.products p WHERE p.slug='iphone-17' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert','#22c55e','256 Go','IP17-GRN-256',10,5
FROM public.products p WHERE p.slug='iphone-17' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1079.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17-BLK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1079.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17-VIO-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1079.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17-WHT-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1079.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17-BLU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1079.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17-GRN-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Samsung Galaxy A37
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Samsung Galaxy A37','samsung-galaxy-a37','Samsung Galaxy A37 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir le Samsung Galaxy A37 ? 📸 Appareil photo polyvalent pour capturer chaque moment ⚡ Performance fluide pour le quotidien, streaming & réseaux sociaux✨ Écran immersif avec design moderne et élégant🔋 Batterie longue durée avec charge rapide   Un smartphone fiable et équilibré conçu pour offrir confort et simplicité au quotidien. ━━━━━━━━━━━━━━ ✔️ Smartphon','{"Ecran": "6,5 po FHD+ AMOLED 90 Hz", "Puce": "Exynos 1280", "Camera": "50 Mpx", "Camera frontale": "13 Mpx", "5G": "Oui", "Resistance": "IP54"}'::jsonb,true,false,false,NULL
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','128 Go','SGA37-BLK-128',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','128 Go','SGA37-WHT-128',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','128 Go','SGA37-VIO-128',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert','#22c55e','128 Go','SGA37-GRN-128',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','256 Go','SGA37-BLK-256',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','256 Go','SGA37-WHT-256',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','256 Go','SGA37-VIO-256',10,7
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert','#22c55e','256 Go','SGA37-GRN-256',10,8
FROM public.products p WHERE p.slug='samsung-galaxy-a37' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,439.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-BLK-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,439.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-WHT-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,439.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-VIO-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,439.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-GRN-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,479.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-BLK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,479.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-WHT-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,479.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-VIO-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,479.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA37-GRN-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Samsung Galaxy A57
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Samsung Galaxy A57','samsung-galaxy-a57','Samsung Galaxy A57 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir le Samsung Galaxy A57 ? 📸 Photos nettes et lumineuses au quotidien ⚡ Performance fluide pour le multitâche, jeux & réseaux sociaux ✨ Grand écran Super AMOLED 120 Hz ultra immersif 🔋 Excellente autonomie avec charge rapide 45 W 🛡️ Design premium résistant à l’eau et à la poussière (IP68) Un smartphone moderne conçu pour offrir confort, fluidité et fiab','{"Ecran": "6,7 po FHD+ AMOLED 120 Hz", "Puce": "Exynos 1380", "Camera": "64 Mpx", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP67"}'::jsonb,true,false,false,NULL
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','128 Go','SGA57-BLU-128',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','128 Go','SGA57-GRY-128',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu clair','#93c5fd','128 Go','SGA57-BCL-128',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Lavande','#c3aed6','128 Go','SGA57-LAV-128',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','256 Go','SGA57-BLU-256',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','256 Go','SGA57-GRY-256',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu clair','#93c5fd','256 Go','SGA57-BCL-256',10,7
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Lavande','#c3aed6','256 Go','SGA57-LAV-256',10,8
FROM public.products p WHERE p.slug='samsung-galaxy-a57' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-BLU-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-GRY-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-BCL-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-LAV-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,549.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-BLU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,549.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-GRY-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,549.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-BCL-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,549.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGA57-LAV-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Xiaomi 15
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Xiaomi 15','xiaomi-15','Xiaomi 15 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Xiaomi 15 ? 📸 Expérience photo premium avec technologie Leica ⚡ Puissance ultra fluide au quotidien ✨ Design moderne, compact et haut de gamme 🔋 Excellente autonomie pensée pour durer Un smartphone premium conçu pour allier élégance et performance.   ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois  🔒 Paiement sécurisé 💬 Conseil avant ach','{"Ecran": "6,36 po AMOLED 120 Hz", "Puce": "Snapdragon 8 Elite", "Camera": "50 Mpx Leica + 50 Mpx ultra + 50 Mpx tele", "Camera frontale": "32 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,false,'Populaire'
FROM public.brands b WHERE b.slug='xiaomi' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','512 Go','XM15-BLK-512',10,1
FROM public.products p WHERE p.slug='xiaomi-15' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert','#22c55e','512 Go','XM15-GRN-512',10,2
FROM public.products p WHERE p.slug='xiaomi-15' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','512 Go','XM15-WHT-512',10,3
FROM public.products p WHERE p.slug='xiaomi-15' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent','#c0c0c0','512 Go','XM15-SLV-512',10,4
FROM public.products p WHERE p.slug='xiaomi-15' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,799.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15-BLK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,799.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15-GRN-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,799.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15-WHT-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,799.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15-SLV-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Xiaomi 15 T
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Xiaomi 15 T','xiaomi-15-t','Xiaomi 15T 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Xiaomi 15T ? 📸 Très belle qualité photo ⚡ Utilisation fluide au quotidien 🔋 Autonomie fiable et durable 🚀 Excellent rapport performance / prix Un smartphone moderne conçu pour tous les usages. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 24 à 48 h 🚚 Livraison : 7 à','{"Ecran": "6,67 po AMOLED 144 Hz", "Puce": "Dimensity 8400 Ultra", "Camera": "50 Mpx Leica + 50 Mpx tele", "Camera frontale": "32 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,false,NULL
FROM public.brands b WHERE b.slug='xiaomi' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','256 Go','XM15T-GRY-256',10,1
FROM public.products p WHERE p.slug='xiaomi-15-t' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','256 Go','XM15T-BLK-256',10,2
FROM public.products p WHERE p.slug='xiaomi-15-t' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Rose Gold','#c9a2a7','256 Go','XM15T-RGD-256',10,3
FROM public.products p WHERE p.slug='xiaomi-15-t' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','512 Go','XM15T-GRY-512',10,4
FROM public.products p WHERE p.slug='xiaomi-15-t' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','512 Go','XM15T-BLK-512',10,5
FROM public.products p WHERE p.slug='xiaomi-15-t' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Rose Gold','#c9a2a7','512 Go','XM15T-RGD-512',10,6
FROM public.products p WHERE p.slug='xiaomi-15-t' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,529.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15T-GRY-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,529.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15T-BLK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,529.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15T-RGD-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,579.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15T-GRY-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,579.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15T-BLK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,579.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15T-RGD-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Xiaomi 15 T pro
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Xiaomi 15 T pro','xiaomi-15-t-pro','Xiaomi 15T Pro 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Xiaomi 15T Pro ? 📸 Photo & vidéo haute qualité ⚡ Performances rapides et fluides 🔋 Grande autonomie au quotidien 🚀 Smartphone puissant et moderne Un smartphone premium pensé pour durer. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 24 à 48 h 🚚 Livraison : 7 à 10','{"Ecran": "6,67 po AMOLED 144 Hz", "Puce": "Snapdragon 8 Elite", "Camera": "50 Mpx Leica + 50 Mpx ultra + 50 Mpx tele", "Camera frontale": "32 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,false,NULL
FROM public.brands b WHERE b.slug='xiaomi' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','512 Go','XM15TP-BLK-512',10,1
FROM public.products p WHERE p.slug='xiaomi-15-t-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','512 Go','XM15TP-GRY-512',10,2
FROM public.products p WHERE p.slug='xiaomi-15-t-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Moka','#795548','512 Go','XM15TP-MOK-512',10,3
FROM public.products p WHERE p.slug='xiaomi-15-t-pro' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,820.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15TP-BLK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,820.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15TP-GRY-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,820.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XM15TP-MOK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Samsung Galaxy S26+
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Samsung Galaxy S26+','samsung-galaxy-s26-plus','Samsung Galaxy S26+ 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S26+ ? 📱 Grand écran confortable et immersif ⚡ Expérience Samsung fluide et agréable 🔋 Autonomie pensée pour suivre vos journées ✨ Design premium fin et élégant Le parfait équilibre entre confort, puissance et élégance. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp','{"Ecran": "6,7 po QHD+ Dynamic AMOLED 120 Hz", "Puce": "Snapdragon 8 Elite", "Camera": "50 Mpx + 12 Mpx + 10 Mpx", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','256 Go','SGS26P-VIO-256',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','256 Go','SGS26P-WHT-256',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','256 Go','SGS26P-BLK-256',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','512 Go','SGS26P-VIO-512',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','512 Go','SGS26P-WHT-512',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','512 Go','SGS26P-BLK-512',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','256 Go','SGS26P-BLU-256',10,7
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','512 Go','SGS26P-BLU-512',10,8
FROM public.products p WHERE p.slug='samsung-galaxy-s26-plus' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-VIO-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-WHT-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-BLK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-VIO-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-WHT-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-BLK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-BLU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26P-BLU-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Samsung Galaxy S26
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Samsung Galaxy S26','samsung-galaxy-s26','Samsung Galaxy S26 💡 Prix final affiché📦 Livraison Martinique, Guadeloupe & Guyane incluse❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S26 ? ⚡ Smartphone rapide et agréable au quotidien📸 Très belles photos de jour comme de nuit📱 Format pratique et confortable en main🔋 Autonomie fiable pour tous les usages Un Galaxy moderne, fluide et équilibré. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé💬 Conseil avant achat via WhatsApp ⏳ Expédition','{"Ecran": "6,2 po FHD+ Dynamic AMOLED 120 Hz", "Puce": "Snapdragon 8 Elite", "Camera": "50 Mpx + 12 Mpx + 10 Mpx", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','256 Go','SGS26-WHT-256',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','256 Go','SGS26-BLK-256',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','256 Go','SGS26-BLU-256',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','256 Go','SGS26-VIO-256',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','512 Go','SGS26-WHT-512',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','512 Go','SGS26-BLK-512',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','512 Go','SGS26-BLU-512',10,7
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','512 Go','SGS26-VIO-512',10,8
FROM public.products p WHERE p.slug='samsung-galaxy-s26' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-WHT-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-BLK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-BLU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-VIO-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,999.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-WHT-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,999.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-BLK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,999.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-BLU-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,999.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26-VIO-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- SamsungGalaxy S26 Ultra
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'SamsungGalaxy S26 Ultra','samsung-galaxy-s26-ultra','Samsung Galaxy S26 Ultra 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S26 Ultra ? 📸 Expérience photo et vidéo haut de gamme 🚀 Puissance conçue pour les usages les plus exigeants 🖊️ S Pen intégré pour plus de productivité 📱 Grand écran premium ultra immersif Le meilleur de Samsung dans un seul smartphone. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois  🔒 Paiement sécurisé 💬 Conseil av','{"Ecran": "6,9 po QHD+ Dynamic AMOLED 120 Hz", "Puce": "Snapdragon 8 Elite", "Camera": "200 Mpx + 50 Mpx + 10 Mpx", "S Pen": "Integre", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','256 Go','SGS26U-BLK-256',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','512 Go','SGS26U-BLK-512',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','256 Go','SGS26U-VIO-256',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','256 Go','SGS26U-BLU-256',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','512 Go','SGS26U-VIO-512',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','512 Go','SGS26U-BLU-512',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','256 Go','SGS26U-WHT-256',10,7
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','512 Go','SGS26U-WHT-512',10,8
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','1 To','SGS26U-BLK-1T',10,9
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','1 To','SGS26U-VIO-1T',10,10
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','1 To','SGS26U-BLU-1T',10,11
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','1 To','SGS26U-WHT-1T',10,12
FROM public.products p WHERE p.slug='samsung-galaxy-s26-ultra' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1299.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-BLK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-BLK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1299.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-VIO-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1299.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-BLU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-VIO-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-BLU-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1299.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-WHT-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1499.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-WHT-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1649.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-BLK-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1649.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-VIO-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1649.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-BLU-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1649.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS26U-WHT-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Xiaomi Redmi Note 14 Pro 5G
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Xiaomi Redmi Note 14 Pro 5G','xiaomi-redmi-note-14-pro','Référence : XRN14P5G-8/256_BLU Etat : NEUF Ecran de 6.67'''''''' Double Sim Android 14 Processeur Mediatek Dimensity 7300 Ultra  Mémoire Interne de 256 Go Mémoire RAM de 8 Go Appareil Photo Principal : 200 + 8 + 2 Mpx Appareil Photo Secondaire : 20 Mpx Wifi / Bluetooth / GPS / NFC Capteur d''''empreintes digitales Batterie de 5 110 mAh Charge rapide 45W','{"Ecran": "6,67 po AMOLED 120 Hz", "Puce": "Dimensity 7300 Ultra", "Camera": "200 Mpx", "Camera frontale": "20 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,false,NULL
FROM public.brands b WHERE b.slug='xiaomi' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','','XMRN14P-BLK-',10,1
FROM public.products p WHERE p.slug='xiaomi-redmi-note-14-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Violet','#9333ea','','XMRN14P-VIO-',10,2
FROM public.products p WHERE p.slug='xiaomi-redmi-note-14-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert','#22c55e','','XMRN14P-GRN-',10,3
FROM public.products p WHERE p.slug='xiaomi-redmi-note-14-pro' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,389.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XMRN14P-BLK-' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,389.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XMRN14P-VIO-' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,389.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='XMRN14P-GRN-' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- iPhone Air
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'iPhone Air','iphone-air','iPhone Air 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone Air ? ✨ Design fin, léger et élégant ⚡ Expérience Apple rapide et fluide 📸 Très belle qualité photo au quotidien 🔋 Autonomie pensée pour tous les usages Un iPhone moderne conçu pour allier simplicité et performance. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 1 an 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 2','{"Ecran": "6,5 po OLED Super Retina XDR", "Puce": "Apple A18", "Camera": "48 Mpx", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='apple' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Or','#d4af37','256 Go','IPAIR-GLD-256',10,1
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','256 Go','IPAIR-BLU-256',10,2
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','256 Go','IPAIR-BLK-256',10,3
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Or','#d4af37','512 Go','IPAIR-GLD-512',10,4
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','512 Go','IPAIR-BLU-512',10,5
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','512 Go','IPAIR-BLK-512',10,6
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Or','#d4af37','1 To','IPAIR-GLD-1T',10,7
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','1 To','IPAIR-BLU-1T',10,8
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','1 To','IPAIR-BLK-1T',10,9
FROM public.products p WHERE p.slug='iphone-air' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,1300.00
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-GLD-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,1300.00
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-BLU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,1300.00
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-BLK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1299.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-GLD-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1299.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-BLU-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1299.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-BLK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1399.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-GLD-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1399.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-BLU-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1399.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IPAIR-BLK-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- iPhone 16 Pro Max
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'iPhone 16 Pro Max','iphone-16-pro-max','iPhone 16 Pro Max 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone 16 Pro Max ? 📸 Photo & vidéo premium 🚀 Puissance ultra fluide 🔋 Excellente autonomie 🛡️ Fiabilité Apple reconnue Un iPhone pensé pour durer. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 1 an 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 24 à 48 h 🚚 Livraison : 7 à 10 jours','{"Ecran": "6,9 po OLED ProMotion 120 Hz", "Puce": "Apple A18 Pro", "Camera": "48 Mpx Fusion + 12 Mpx + 12 Mpx 5x", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,true,'Populaire'
FROM public.brands b WHERE b.slug='apple' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Titane sable','#d4c5a9','256 Go','IP16PM-TSB-256',10,1
FROM public.products p WHERE p.slug='iphone-16-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Titane noir','#888888','256 Go','IP16PM-UNK-256',10,2
FROM public.products p WHERE p.slug='iphone-16-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Titane blanc','#f0f0f0','256 Go','IP16PM-TWH-256',10,3
FROM public.products p WHERE p.slug='iphone-16-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Titane naturel','#c8b8a2','256 Go','IP16PM-TNT-256',10,4
FROM public.products p WHERE p.slug='iphone-16-pro-max' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1399.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16PM-TSB-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1399.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16PM-UNK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1399.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16PM-TWH-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1399.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16PM-TNT-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- iPhone 17 Pro Max
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'iPhone 17 Pro Max','iphone-17-pro-max','iPhone 17 Pro Max 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone 17 Pro Max ? 📸 L’une des meilleures expériences photo sur smartphone 🚀 Puissance Apple conçue pour les usages les plus exigeants 🔋 Autonomie premium pensée pour durer toute la journée ✨ Finitions haut de gamme et écran ultra immersif Le meilleur d’Apple réuni dans un seul iPhone. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie 12 mois 🔒 Paiemen','{"Ecran": "6,9 po OLED ProMotion 120 Hz", "Puce": "Apple A19 Pro", "Camera": "48 Mpx Fusion + 48 Mpx ultra + 12 Mpx 5x", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='apple' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Orange cosmique','#ff6b35','256 Go','IP17PM-OCO-256',10,1
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Orange cosmique','#ff6b35','512 Go','IP17PM-OCO-512',10,2
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Orange cosmique','#ff6b35','1 To','IP17PM-OCO-1T',10,3
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu intense','#1d4ed8','256 Go','IP17PM-BIN-256',10,4
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu intense','#1d4ed8','512 Go','IP17PM-BIN-512',10,5
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu intense','#1d4ed8','1 To','IP17PM-BIN-1T',10,6
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent','#c0c0c0','256 Go','IP17PM-SLV-256',10,7
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent','#c0c0c0','512 Go','IP17PM-SLV-512',10,8
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent','#c0c0c0','1 To','IP17PM-SLV-1T',10,9
FROM public.products p WHERE p.slug='iphone-17-pro-max' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1599.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-OCO-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-OCO-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,2199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-OCO-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1599.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-BIN-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-BIN-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,2199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-BIN-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1599.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-SLV-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-SLV-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,2199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17PM-SLV-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- iPhone 17 Pro
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'iPhone 17 Pro','iphone-17-pro','iPhone 17 Pro 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone 17 Pro ? 📸 Photo et vidéo pensées pour un niveau professionnel ⚡ Puissance Apple ultra fluide et réactive ✨ Design premium avec finitions haut de gamme 🔋 Excellente autonomie pour un usage intensif Un iPhone conçu pour ceux qui veulent performance et élégance au quotidien. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie 12 mois 🔒 Paiement sécurisé ','{"Ecran": "6,3 po OLED ProMotion 120 Hz", "Puce": "Apple A19 Pro", "Camera": "48 Mpx Fusion + 48 Mpx ultra + 12 Mpx 5x", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='apple' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Orange cosmique','#ff6b35','256 Go','IP17P-OCO-256',10,1
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Orange cosmique','#ff6b35','512 Go','IP17P-OCO-512',10,2
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent','#c0c0c0','256 Go','IP17P-SLV-256',10,3
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent','#c0c0c0','512 Go','IP17P-SLV-512',10,4
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu intense','#1d4ed8','256 Go','IP17P-BIN-256',10,5
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu intense','#1d4ed8','512 Go','IP17P-BIN-512',10,6
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Orange cosmique','#ff6b35','1 To','IP17P-OCO-1T',10,7
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent','#c0c0c0','1 To','IP17P-SLV-1T',10,8
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu intense','#1d4ed8','1 To','IP17P-BIN-1T',10,9
FROM public.products p WHERE p.slug='iphone-17-pro' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1469.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-OCO-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1699.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-OCO-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1469.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-SLV-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1699.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-SLV-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1469.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-BIN-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1699.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-BIN-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1929.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-OCO-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1929.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-SLV-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1929.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP17P-BIN-1T' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Samsung Galaxy Z Fold 7
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Samsung Galaxy Z Fold 7','samsung-galaxy-z-fold-7','Samsung Galaxy Z Fold7 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy Z Fold7 ? 📱 Expérience pliable premium ultra immersive 🚀 Puissance conçue pour le multitâche et la productivité ✨ Design Samsung haut de gamme et innovant ⚡ Grand écran pensé pour travailler, créer et se divertir Le smartphone Samsung le plus avancé et impressionnant de la gamme Galaxy. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie cons','{"Ecran": "7,9 po AMOLED pliable + 6,5 po couverture", "Puce": "Snapdragon 8 Elite", "Camera": "200 Mpx + 10 Mpx + 10 Mpx", "Camera frontale": "10 Mpx", "5G": "Oui", "Resistance": "IPX8"}'::jsonb,true,true,false,'Nouveau'
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu nuit','#1e3799','256 Go','SGZF7-BNU-256',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-z-fold-7' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu nuit','#1e3799','512 Go','SGZF7-BNU-512',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-z-fold-7' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir absolu','#0a0a0a','256 Go','SGZF7-NBL-256',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-z-fold-7' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir absolu','#0a0a0a','512 Go','SGZF7-NBL-512',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-z-fold-7' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','256 Go','SGZF7-GRY-256',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-z-fold-7' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','512 Go','SGZF7-GRY-512',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-z-fold-7' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1599.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGZF7-BNU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1699.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGZF7-BNU-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1599.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGZF7-NBL-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1699.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGZF7-NBL-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1599.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGZF7-GRY-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1699.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGZF7-GRY-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Samsung S25
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Samsung S25','samsung-galaxy-s25','Samsung Galaxy S25 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S25 ? ⚡ Expérience Samsung rapide et fluide 📸 Très belles photos au quotidien 📱 Format compact et agréable en main 🔋 Autonomie fiable pour tous les usages Un Galaxy premium pensé pour être efficace au quotidien.   ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expé','{"Ecran": "6,2 po FHD+ Dynamic AMOLED 120 Hz", "Puce": "Snapdragon 8 Elite", "Camera": "50 Mpx + 12 Mpx + 10 Mpx", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,true,'Populaire'
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu nuit','#1e3799','128 Go','SGS25-BNU-128',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','128 Go','SGS25-GRY-128',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir absolu','#0a0a0a','128 Go','SGS25-NBL-128',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu clair','#93c5fd','128 Go','SGS25-BCL-128',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert d’eau','#888888','128 Go','SGS25-UNK-128',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu nuit','#1e3799','256 Go','SGS25-BNU-256',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu nuit','#1e3799','512 Go','SGS25-BNU-512',10,7
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','256 Go','SGS25-GRY-256',10,8
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris','#8e8e93','512 Go','SGS25-GRY-512',10,9
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir absolu','#0a0a0a','256 Go','SGS25-NBL-256',10,10
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir absolu','#0a0a0a','512 Go','SGS25-NBL-512',10,11
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu clair','#93c5fd','256 Go','SGS25-BCL-256',10,12
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu clair','#93c5fd','512 Go','SGS25-BCL-512',10,13
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert d’eau','#888888','256 Go','SGS25-UNK-256',10,14
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert d’eau','#888888','512 Go','SGS25-UNK-512',10,15
FROM public.products p WHERE p.slug='samsung-galaxy-s25' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,779.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-BNU-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,779.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-GRY-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,779.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-NBL-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,779.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-BCL-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,779.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-UNK-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,849.00,920.00
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-BNU-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-BNU-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,849.00,920.00
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-GRY-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-GRY-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,849.00,920.00
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-NBL-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-NBL-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,849.00,920.00
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-BCL-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-BCL-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,849.00,920.00
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-UNK-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25-UNK-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- Samsung S25 Ultra
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'Samsung S25 Ultra','samsung-galaxy-s25-ultra','Samsung Galaxy S25 Ultra 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S25 Ultra ? 📸 Expérience photo et vidéo parmi les meilleures du marché 🚀 Puissance Samsung ultra haut de gamme 🖊️ S Pen intégré pour travailler, créer et gagner en productivité 📱 Écran premium ultra immersif conçu pour une utilisation intensive Le Galaxy Ultra pensé pour ceux qui veulent le meilleur sans compromis. ━━━━━━━━━━ ✔️ Smartphone','{"Ecran": "6,9 po QHD+ Dynamic AMOLED 120 Hz", "Puce": "Snapdragon 8 Elite", "Camera": "200 Mpx + 50 Mpx + 10 Mpx", "S Pen": "Integre", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,true,'Bestseller'
FROM public.brands b WHERE b.slug='samsung' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris titane','#6b7280','256 Go','SGS25U-GTI-256',10,1
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir titane','#1c1c1e','256 Go','SGS25U-NTI-256',10,2
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent titane','#c0c0c0','256 Go','SGS25U-ATI-256',10,3
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu titane','#3b5bdb','256 Go','SGS25U-BTI-256',10,4
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Gris titane','#6b7280','512 Go','SGS25U-GTI-512',10,5
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir titane','#1c1c1e','512 Go','SGS25U-NTI-512',10,6
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Argent titane','#c0c0c0','512 Go','SGS25U-ATI-512',10,7
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu titane','#3b5bdb','512 Go','SGS25U-BTI-512',10,8
FROM public.products p WHERE p.slug='samsung-galaxy-s25-ultra' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-GTI-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-NTI-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-ATI-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1099.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-BTI-256' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-GTI-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-NTI-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-ATI-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,1199.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='SGS25U-BTI-512' ON CONFLICT (variant_id,zone_id) DO NOTHING;

-- iPhone 16
INSERT INTO public.products (brand_id,name,slug,description,specs,is_active,is_new,is_bestseller,badge)
SELECT b.id,'iPhone 16','iphone-16','Pourquoi choisir l’iPhone 16  💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir l’iPhone 16  📸 Appareil photo performant pour capturer vos moments avec précision et naturel ⚡ Puce rapide et fluide idéale pour les applications, réseaux sociaux et multitâche ✨ Design élégant avec écran immersif et finitions premium 🔋 Très bonne autonomie avec recharge rapide et utilisation confortable au quotidien Un smartphone moderne e','{"Ecran": "6,1 po OLED Super Retina XDR", "Puce": "Apple A18", "Camera": "48 Mpx + 12 Mpx", "Camera frontale": "12 Mpx", "5G": "Oui", "Resistance": "IP68"}'::jsonb,true,false,false,NULL
FROM public.brands b WHERE b.slug='apple' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Rose','#f9a8d4','128 Go','IP16-PNK-128',10,1
FROM public.products p WHERE p.slug='iphone-16' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Noir','#1c1c1e','128 Go','IP16-BLK-128',10,2
FROM public.products p WHERE p.slug='iphone-16' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Bleu','#4a90d9','128 Go','IP16-BLU-128',10,3
FROM public.products p WHERE p.slug='iphone-16' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Vert','#22c55e','128 Go','IP16-GRN-128',10,4
FROM public.products p WHERE p.slug='iphone-16' ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id,color_name,color_hex,storage,sku,stock,sort_order)
SELECT p.id,'Blanc','#f5f5f5','128 Go','IP16-WHT-128',10,5
FROM public.products p WHERE p.slug='iphone-16' ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16-PNK-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16-BLK-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16-BLU-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16-GRN-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;
INSERT INTO public.product_zone_prices (variant_id,zone_id,price,compare_at_price)
SELECT v.id,z.id,899.00,NULL
FROM public.product_variants v,public.zones z WHERE v.sku='IP16-WHT-128' ON CONFLICT (variant_id,zone_id) DO NOTHING;

