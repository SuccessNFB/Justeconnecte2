-- ── 013 ENRICH PRODUCT SPECS ──────────────────────────────────────────────────
-- 15 caractéristiques officielles par produit.
-- Sources : apple.com, samsung.com, mi.com, gsmarena.com, gopro.com

-- ══════════════════════════════════════════════════════════════════════════════
-- APPLE
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE public.products SET specs = '{
  "Écran": "6,3 po Super Retina XDR OLED",
  "Résolution": "2556 × 1179 px — 460 ppp",
  "Rafraîchissement": "120 Hz ProMotion adaptatif (1-120 Hz)",
  "Luminosité": "3 000 nits (pic extérieur)",
  "Puce": "Apple A19 — CPU 6 cœurs, GPU 5 cœurs",
  "RAM": "8 Go LPDDR5",
  "Stockage": "256 Go / 512 Go",
  "Capteur principal": "48 Mpx, f/1.6, OIS, mise au point par phase",
  "Ultra-grand angle": "48 Mpx, f/2.2 — 4× plus de résolution qu iPhone 16",
  "Téléobjectif": "2× qualité optique (fusion numérique)",
  "Caméra frontale": "18 Mpx, autofocus, Center Stage",
  "Autonomie": "30 h lecture vidéo — +8 h vs iPhone 16",
  "Charge rapide": "40 W câble (50 % en 20 min) · MagSafe 25 W",
  "Résistance": "IP68 — 6 m pendant 30 min",
  "Système": "iOS 18 · 5G (puce N1 Apple) · Wi-Fi 7 · Bluetooth 5.3"
}'::jsonb
WHERE slug = 'iphone-17';

UPDATE public.products SET specs = '{
  "Écran": "6,5 po Super Retina XDR OLED",
  "Résolution": "2736 × 1260 px — 460 ppp",
  "Rafraîchissement": "120 Hz ProMotion adaptatif (1-120 Hz)",
  "Luminosité": "3 000 nits (pic extérieur)",
  "Puce": "Apple A19 Pro — CPU 6 cœurs, GPU 5 cœurs",
  "RAM": "8 Go LPDDR5",
  "Stockage": "256 Go / 512 Go",
  "Capteur principal": "48 Mpx, f/1.6, OIS, mise au point par phase",
  "Caméra frontale": "18 Mpx, autofocus, Center Stage",
  "Batterie": "3 149 mAh — 27 h lecture vidéo",
  "Charge rapide": "40 W câble · MagSafe 25 W",
  "Épaisseur": "5,6 mm — le plus fin iPhone jamais conçu",
  "Châssis": "Titane, bords plats arrondis, Ceramic Shield 2",
  "Résistance": "IP68 — 6 m pendant 30 min",
  "Système": "iOS 18 · 5G (puce C1X Apple) · Wi-Fi 7 · Bluetooth 5.3"
}'::jsonb
WHERE slug = 'iphone-air';

UPDATE public.products SET specs = '{
  "Écran": "6,1 po Super Retina XDR OLED",
  "Résolution": "2556 × 1179 px — 460 ppp",
  "Rafraîchissement": "60 Hz",
  "Luminosité": "2 000 nits (pic) · 800 nits typique",
  "Puce": "Apple A18 — CPU 6 cœurs, GPU 5 cœurs",
  "RAM": "8 Go LPDDR5",
  "Stockage": "128 Go / 256 Go / 512 Go",
  "Capteur principal": "48 Mpx, f/1.6, OIS, mise au point par phase",
  "Ultra-grand angle": "12 Mpx, f/2.2 (100 % photos)",
  "Téléobjectif": "2× qualité optique (fusion numérique)",
  "Caméra frontale": "12 Mpx, autofocus",
  "Autonomie": "22 h lecture vidéo",
  "Charge rapide": "30 W câble · MagSafe 25 W · Qi",
  "Résistance": "IP68 — 6 m pendant 30 min",
  "Système": "iOS 18 · 5G · Wi-Fi 7 · Bouton Action · USB-C 3.0"
}'::jsonb
WHERE slug = 'iphone-16';

UPDATE public.products SET specs = '{
  "Écran": "6,9 po Super Retina XDR ProMotion OLED",
  "Résolution": "2868 × 1320 px — 460 ppp",
  "Rafraîchissement": "120 Hz ProMotion adaptatif (1-120 Hz)",
  "Luminosité": "2 000 nits (pic HDR) · 1 000 nits typique",
  "Puce": "Apple A18 Pro — CPU 6 cœurs, GPU 6 cœurs",
  "RAM": "8 Go LPDDR5",
  "Stockage": "256 Go / 512 Go / 1 To",
  "Capteur principal": "48 Mpx, f/1.78, OIS, mise au point par phase",
  "Ultra-grand angle": "48 Mpx, f/2.2, macro (focalisation à 2 cm)",
  "Téléobjectif": "12 Mpx, 5× optique, OIS, f/2.8",
  "Caméra frontale": "12 Mpx, autofocus",
  "Autonomie": "33 h lecture vidéo · 4 685 mAh",
  "Charge rapide": "MagSafe 25 W · 30 W câble",
  "Résistance": "IP68 — 6 m pendant 30 min · Châssis titane grade 5",
  "Système": "iOS 18 · 5G · Wi-Fi 7 · Bouton Action · USB-C 3.2"
}'::jsonb
WHERE slug = 'iphone-16-pro-max';

UPDATE public.products SET specs = '{
  "Écran": "6,3 po Super Retina XDR ProMotion OLED",
  "Résolution": "2622 × 1206 px — 460 ppp",
  "Rafraîchissement": "120 Hz ProMotion adaptatif (1-120 Hz)",
  "Luminosité": "3 000 nits (pic extérieur)",
  "Puce": "Apple A19 Pro — CPU 6 cœurs, GPU 6 cœurs",
  "RAM": "12 Go LPDDR5",
  "Stockage": "256 Go / 512 Go / 1 To",
  "Capteur principal": "48 Mpx, f/1.78, OIS, mise au point par phase",
  "Ultra-grand angle": "48 Mpx, f/2.2, macro (focalisation à 2 cm)",
  "Téléobjectif": "48 Mpx, 5× optique, OIS — triple 48 Mpx inédit",
  "Caméra frontale": "18 Mpx, autofocus, Center Stage",
  "Autonomie": "34 h lecture vidéo",
  "Charge rapide": "40 W câble (50 % en 20 min) · MagSafe 25 W",
  "Résistance": "IP68 — 6 m pendant 30 min · Châssis aluminium",
  "Système": "iOS 18 · 5G (puce N1 Apple) · Wi-Fi 7 · USB-C 4"
}'::jsonb
WHERE slug = 'iphone-17-pro';

UPDATE public.products SET specs = '{
  "Écran": "6,86 po Super Retina XDR ProMotion OLED",
  "Résolution": "3024 × 1320 px — 460 ppp",
  "Rafraîchissement": "120 Hz ProMotion adaptatif (1-120 Hz)",
  "Luminosité": "3 000 nits (pic) · 1 600 nits HDR",
  "Puce": "Apple A19 Pro — CPU 6 cœurs, GPU 6 cœurs + accélérateurs GPU neuronaux",
  "RAM": "12 Go LPDDR5",
  "Stockage": "256 Go / 512 Go / 1 To / 2 To",
  "Capteur principal": "48 Mpx, f/1.78, OIS, mise au point par phase",
  "Ultra-grand angle": "48 Mpx, f/2.2, macro (focalisation à 2 cm)",
  "Téléobjectif": "48 Mpx, 5× optique, OIS — triple 48 Mpx inédit",
  "Caméra frontale": "18 Mpx, autofocus, Center Stage",
  "Autonomie": "39 h lecture vidéo — record absolu iPhone",
  "Charge rapide": "40 W câble (50 % en 20 min) · MagSafe 25 W",
  "Résistance": "IP68 — 6 m pendant 30 min · Châssis aluminium",
  "Système": "iOS 18 · 5G (puce N1 Apple) · Wi-Fi 7 · USB-C 4"
}'::jsonb
WHERE slug = 'iphone-17-pro-max';


-- ══════════════════════════════════════════════════════════════════════════════
-- SAMSUNG
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE public.products SET specs = '{
  "Écran": "6,5 po Super AMOLED FHD+",
  "Résolution": "2340 × 1080 px — 397 ppp",
  "Rafraîchissement": "90 Hz adaptatif",
  "Luminosité": "800 nits (pic)",
  "Puce": "Samsung Exynos 1280 — octa-core 5G",
  "RAM": "6 Go / 8 Go",
  "Stockage": "128 Go / 256 Go (extensible microSD 1 To)",
  "Capteur principal": "50 Mpx, f/1.8, OIS",
  "Ultra-grand angle": "8 Mpx, f/2.2, angle 120°",
  "Macro": "2 Mpx, f/2.4",
  "Caméra frontale": "13 Mpx, f/2.2",
  "Batterie": "5 000 mAh",
  "Charge rapide": "25 W câble",
  "Résistance": "IP54 — résistant aux éclaboussures",
  "Système": "Android 14 · One UI 6 · 5G · Wi-Fi 6"
}'::jsonb
WHERE slug = 'samsung-galaxy-a37';

UPDATE public.products SET specs = '{
  "Écran": "6,6 po Super AMOLED FHD+",
  "Résolution": "2340 × 1080 px — 393 ppp",
  "Rafraîchissement": "120 Hz adaptatif",
  "Luminosité": "1 000 nits (pic)",
  "Puce": "Samsung Exynos 1480 — octa-core 5G",
  "RAM": "8 Go / 12 Go LPDDR4X",
  "Stockage": "256 Go / 512 Go (extensible microSD 1 To)",
  "Capteur principal": "64 Mpx, f/1.8, OIS, Dual Pixel",
  "Ultra-grand angle": "12 Mpx, f/2.2, angle 120°",
  "Macro": "5 Mpx, f/2.4",
  "Caméra frontale": "32 Mpx, f/2.2",
  "Batterie": "5 000 mAh",
  "Charge rapide": "45 W câble",
  "Résistance": "IP67 — 1 m pendant 30 min",
  "Système": "Android 14 · One UI 6 · 5G · Wi-Fi 6E · NFC"
}'::jsonb
WHERE slug = 'samsung-galaxy-a57';

UPDATE public.products SET specs = '{
  "Écran": "6,2 po Dynamic AMOLED 2X",
  "Résolution": "2340 × 1080 px — 416 ppp",
  "Rafraîchissement": "120 Hz LTPO (1-120 Hz)",
  "Luminosité": "2 600 nits (pic)",
  "Puce": "Snapdragon 8 Elite (3 nm) — Oryon CPU 4,47 GHz",
  "RAM": "12 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go UFS 4.0",
  "Capteur principal": "50 Mpx, f/1.8, OIS, Dual Pixel AF",
  "Ultra-grand angle": "12 Mpx, f/2.2, angle 120°",
  "Téléobjectif": "10 Mpx, 3× optique, OIS",
  "Caméra frontale": "12 Mpx, f/2.2",
  "Batterie": "4 000 mAh · 25 W câble · 15 W sans fil",
  "Résistance": "IP68 — 1,5 m pendant 30 min",
  "Cadre": "Armor Aluminium · Gorilla Glass Victus 2",
  "Système": "Android 15 · One UI 7 · 5G · Wi-Fi 7 · 7 ans de mises à jour"
}'::jsonb
WHERE slug = 'samsung-galaxy-s25';

UPDATE public.products SET specs = '{
  "Écran": "6,9 po Dynamic AMOLED 2X QHD+",
  "Résolution": "3088 × 1440 px — 505 ppp",
  "Rafraîchissement": "120 Hz LTPO (1-120 Hz)",
  "Luminosité": "2 600 nits (pic) · Gorilla Armor 2",
  "Puce": "Snapdragon 8 Elite (3 nm) — Oryon CPU 4,47 GHz",
  "RAM": "12 Go / 16 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go / 1 To UFS 4.0",
  "Capteur principal": "200 Mpx, f/1.7, OIS, Dual Pixel AF",
  "Ultra-grand angle": "12 Mpx, f/2.2, angle 120°",
  "Téléobjectif 3×": "10 Mpx, 3× optique, OIS",
  "Téléobjectif 5×": "50 Mpx, 5× périscope optique, OIS",
  "Caméra frontale": "12 Mpx, f/2.2",
  "Batterie": "5 000 mAh · 45 W câble · 15 W sans fil",
  "S Pen": "Intégré — commandes gestuelles Air Actions",
  "Résistance": "IP68 · Châssis titane grade 5 · 7 ans de MAJ"
}'::jsonb
WHERE slug = 'samsung-galaxy-s25-ultra';

UPDATE public.products SET specs = '{
  "Écran": "6,3 po Dynamic LTPO AMOLED 2X",
  "Résolution": "2340 × 1080 px — 409 ppp",
  "Rafraîchissement": "120 Hz LTPO (1-120 Hz)",
  "Luminosité": "2 600 nits (pic)",
  "Puce": "Snapdragon 8 Elite Gen 5 (3 nm)",
  "RAM": "12 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go UFS 4.0",
  "Capteur principal": "50 Mpx, f/1.8, OIS, Dual Pixel AF",
  "Ultra-grand angle": "12 Mpx, f/2.2, angle 120°",
  "Téléobjectif": "10 Mpx, 3× optique, OIS",
  "Caméra frontale": "12 Mpx, f/2.2",
  "Batterie": "4 300 mAh · 25 W câble · 15 W sans fil",
  "Résistance": "IP68 — 1,5 m pendant 30 min",
  "Cadre": "Armor Aluminium · Gorilla Glass Victus 2",
  "Système": "Android 16 · One UI 8 · 5G · Wi-Fi 7 · 7 ans de MAJ"
}'::jsonb
WHERE slug = 'samsung-galaxy-s26';

UPDATE public.products SET specs = '{
  "Écran": "6,7 po Dynamic LTPO AMOLED 2X",
  "Résolution": "2340 × 1080 px — 388 ppp",
  "Rafraîchissement": "120 Hz LTPO (1-120 Hz)",
  "Luminosité": "2 600 nits (pic)",
  "Puce": "Snapdragon 8 Elite Gen 5 (3 nm)",
  "RAM": "12 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go UFS 4.0",
  "Capteur principal": "50 Mpx, f/1.8, OIS, Dual Pixel AF",
  "Ultra-grand angle": "12 Mpx, f/2.2, angle 120°",
  "Téléobjectif": "10 Mpx, 3× optique, OIS",
  "Caméra frontale": "12 Mpx, f/2.2",
  "Batterie": "4 900 mAh · 45 W câble · 15 W sans fil",
  "Résistance": "IP68 — 1,5 m pendant 30 min · Gorilla Glass Victus 2",
  "Cadre": "Armor Aluminium",
  "Système": "Android 16 · One UI 8 · 5G · Wi-Fi 7 · 7 ans de MAJ"
}'::jsonb
WHERE slug = 'samsung-galaxy-s26-plus';

UPDATE public.products SET specs = '{
  "Écran": "6,9 po Dynamic LTPO AMOLED 2X QHD+ · Privacy Display",
  "Résolution": "3120 × 1440 px — 505 ppp",
  "Rafraîchissement": "120 Hz LTPO (1-120 Hz)",
  "Luminosité": "2 600 nits (pic)",
  "Puce": "Snapdragon 8 Elite Gen 5 (3 nm) · NPU +39 %",
  "RAM": "12 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go / 1 To UFS 4.0",
  "Capteur principal": "200 Mpx, f/1.4, OIS — ouverture record Galaxy",
  "Ultra-grand angle": "50 Mpx, f/2.0, angle 120°",
  "Téléobjectif 3×": "10 Mpx, 3× optique, OIS",
  "Téléobjectif 5×": "50 Mpx, 5× périscope optique, OIS",
  "Caméra frontale": "12 Mpx, f/2.2",
  "Batterie": "5 000 mAh · 60 W câble (record Galaxy) · 15 W sans fil",
  "S Pen": "Intégré — commandes gestuelles Air Actions",
  "Résistance": "IP68 · Cadre Armor Aluminium · 7 ans de MAJ"
}'::jsonb
WHERE slug = 'samsung-galaxy-s26-ultra';

UPDATE public.products SET specs = '{
  "Écran intérieur": "8,0 po AMOLED pliable — 2184 × 1968 px · 120 Hz",
  "Écran extérieur": "6,5 po AMOLED — 2520 × 1080 px · 120 Hz (21:9)",
  "Luminosité": "2 600 nits (pic) · HDR10+",
  "Puce": "Snapdragon 8 Elite (3 nm) — Oryon CPU 4,47 GHz",
  "RAM": "12 Go / 16 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go / 1 To UFS 4.0",
  "Capteur principal": "200 Mpx, f/1.7, OIS, Dual Pixel AF",
  "Ultra-grand angle": "12 Mpx, f/2.2, angle 123°",
  "Téléobjectif": "10 Mpx, 3× optique, OIS",
  "Caméra frontale ext.": "10 Mpx, f/2.2",
  "Caméra frontale int.": "10 Mpx, sous-écran",
  "Batterie": "4 400 mAh · 25 W câble · 15 W sans fil",
  "Poids": "215 g — le plus léger Galaxy Z Fold",
  "Résistance": "IPX8 · charnière en fibres aramides",
  "Système": "Android 15 · One UI 7 · 5G · Wi-Fi 7 · 7 ans de MAJ"
}'::jsonb
WHERE slug = 'samsung-galaxy-z-fold-7';


-- ══════════════════════════════════════════════════════════════════════════════
-- XIAOMI
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE public.products SET specs = '{
  "Écran": "6,36 po OLED 1,5K",
  "Résolution": "2960 × 1280 px — 510 ppp",
  "Rafraîchissement": "120 Hz LTPO (1-120 Hz)",
  "Luminosité": "3 200 nits (pic) · Dolby Vision · HDR10+",
  "Puce": "Snapdragon 8 Elite (4 nm) — 4,32 GHz",
  "RAM": "12 Go / 16 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go / 1 To UFS 4.0",
  "Capteur principal": "50 Mpx Leica, Light Hunter 900, f/1.6, OIS",
  "Ultra-grand angle": "50 Mpx Leica, f/2.2, angle 115°",
  "Téléobjectif": "50 Mpx Leica, flottant, OIS, 3,2× optique",
  "Caméra frontale": "32 Mpx, f/2.0",
  "Batterie": "5 400 mAh · 90 W câble (pleine charge en 36 min)",
  "Charge sans fil": "50 W Qi2 · charge inversée 10 W",
  "Résistance": "IP68 — 6 m pendant 30 min",
  "Système": "Android 15 · HyperOS 2 · 5G · Wi-Fi 7 · Bluetooth 5.4 · NFC"
}'::jsonb
WHERE slug = 'xiaomi-15';

UPDATE public.products SET specs = '{
  "Écran": "6,83 po AMOLED 1,5K",
  "Résolution": "2772 × 1280 px — 447 ppp",
  "Rafraîchissement": "120 Hz adaptatif · Dolby Vision · HDR10+",
  "Luminosité": "3 200 nits (pic) · Corning Gorilla Glass 7i",
  "Puce": "Dimensity 8400 Ultra (4 nm) — Cortex-A725 octa-core",
  "RAM": "12 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go UFS 4.0",
  "Capteur principal": "50 Mpx Leica, Light Hunter 800 (OV50), f/1.7, OIS",
  "Ultra-grand angle": "12 Mpx, f/2.2, angle 120°",
  "Téléobjectif": "50 Mpx, 3,2× optique, OIS",
  "Caméra frontale": "32 Mpx, f/2.2",
  "Batterie": "5 500 mAh · 67 W câble (pleine charge en ~50 min)",
  "Charge sans fil": "Non",
  "Résistance": "IP68 — 6 m pendant 30 min",
  "Système": "Android 15 · HyperOS 2 · 5G · Wi-Fi 6E · Bluetooth 5.4 · NFC"
}'::jsonb
WHERE slug = 'xiaomi-15-t';

UPDATE public.products SET specs = '{
  "Écran": "6,83 po AMOLED 1,5K",
  "Résolution": "2772 × 1280 px — 447 ppp",
  "Rafraîchissement": "144 Hz LTPO adaptatif · Dolby Vision · HDR10+",
  "Luminosité": "3 200 nits (pic) · Corning Gorilla Glass 7i",
  "Puce": "Dimensity 9400+ (3 nm) — Cortex-X925 3,73 GHz",
  "RAM": "12 Go LPDDR5X",
  "Stockage": "256 Go / 512 Go / 1 To UFS 4.1",
  "Capteur principal": "50 Mpx Leica, Light Fusion, f/1.6, OIS",
  "Ultra-grand angle": "12 Mpx Leica, f/2.2, angle 120°",
  "Téléobjectif": "50 Mpx Leica, 5× périscope (115 mm), OIS",
  "Caméra frontale": "32 Mpx, f/2.2",
  "Batterie": "5 500 mAh · 90 W câble (pleine charge en 38 min)",
  "Charge sans fil": "50 W Qi2",
  "Résistance": "IP68 — 6 m pendant 30 min",
  "Système": "Android 15 · HyperOS 2 · 5G · Wi-Fi 7 · Bluetooth 6.0 · NFC · Infrarouge"
}'::jsonb
WHERE slug = 'xiaomi-15-t-pro';

UPDATE public.products SET specs = '{
  "Écran": "6,67 po AMOLED 12 bits",
  "Résolution": "2712 × 1220 px — 446 ppp",
  "Rafraîchissement": "120 Hz adaptatif · Dolby Vision · HDR10+",
  "Luminosité": "3 000 nits (pic) · Corning Gorilla Glass Victus 2",
  "Puce": "Dimensity 7300 Ultra (4 nm) — octa-core 2,6 GHz",
  "RAM": "8 Go / 12 Go LPDDR4X",
  "Stockage": "128 Go / 256 Go / 512 Go UFS 2.2",
  "Capteur principal": "200 Mpx, f/1.65, OIS, Dual Pixel PDAF",
  "Ultra-grand angle": "8 Mpx, f/2.2, angle 120°",
  "Macro": "2 Mpx, f/2.4",
  "Caméra frontale": "20 Mpx, f/2.2",
  "Batterie": "5 110 mAh · 45 W câble",
  "Résistance": "IP68 — 2 m pendant 30 min",
  "Double SIM": "Nano SIM + eSIM · 5G",
  "Système": "Android 14 · HyperOS · 5G · Wi-Fi 6 · Bluetooth 5.4 · NFC"
}'::jsonb
WHERE slug = 'xiaomi-redmi-note-14-pro';


-- ══════════════════════════════════════════════════════════════════════════════
-- GOPRO
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE public.products SET specs = '{
  "Vidéo max": "5,3K à 60 ips · 5,3K à 30 ips en 10 bits",
  "Vidéo 4K": "4K à 120 ips · 4K à 60 ips en 10 bits · HDR",
  "Ralenti max": "1080p à 400 ips · 2,7K à 240 ips",
  "Photos": "27 Mpx (format 8:7) · HDR · RAW disponible",
  "Stabilisation": "HyperSmooth 6.0 — stabilisation leader du marché",
  "Étanchéité": "10 m sans boîtier supplémentaire",
  "Batterie": "1 900 mAh Enduro (incluse)",
  "Autonomie": "2 h 30 à 1080p30 · 1 h 30 à 4K30",
  "Connectivité": "Wi-Fi 6 (transfert +40 %) · Bluetooth 5.0",
  "Écran": "Tactile LCD couleur arrière + écran avant statut",
  "GPS intégré": "Oui — données de vitesse, altitude, trajet",
  "Poids": "157 g · 71,8 × 50,8 × 33,6 mm",
  "Objectifs interchangeables": "Ultra Wide · Macro · Anamorphique · ND Filter",
  "HDR vidéo": "HLG HDR — couleurs plus riches, détails préservés",
  "Stockage": "MicroSD jusqu''à 1 To (non incluse)"
}'::jsonb
WHERE slug = 'gopro-hero-13';

UPDATE public.products SET specs = '{
  "Vidéo max": "5,3K à 60 ips · 5,3K à 30 ips en 10 bits",
  "Vidéo 4K": "4K à 120 ips · 4K à 60 ips en 10 bits · HDR",
  "Ralenti max": "1080p à 400 ips · 2,7K à 240 ips",
  "Photos": "27 Mpx (format 8:7) · HDR · RAW disponible",
  "Stabilisation": "HyperSmooth 6.0 — stabilisation leader du marché",
  "Étanchéité": "10 m sans boîtier supplémentaire",
  "Batterie": "2× 1 900 mAh Enduro incluses",
  "Autonomie": "2 h 30 à 1080p30 · 1 h 30 à 4K30 par batterie",
  "Connectivité": "Wi-Fi 6 (transfert +40 %) · Bluetooth 5.0",
  "Écran": "Tactile LCD couleur arrière + écran avant statut",
  "GPS intégré": "Oui — données de vitesse, altitude, trajet",
  "Poids": "157 g · 71,8 × 50,8 × 33,6 mm",
  "Pack accessoires": "Fixations · ventouses · supports · sac de transport",
  "HDR vidéo": "HLG HDR — couleurs plus riches, détails préservés",
  "Stockage": "MicroSD jusqu''à 1 To (non incluse)"
}'::jsonb
WHERE slug = 'gopro-hero-13-pack';
