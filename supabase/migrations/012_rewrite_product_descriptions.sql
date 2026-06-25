-- ── 012 REWRITE PRODUCT DESCRIPTIONS ────────────────────────────────────────
-- Descriptions professionnelles, propres à chaque appareil.
-- Remplace les textes génériques tronqués par des descriptions précises.

-- ── APPLE ────────────────────────────────────────────────────────────────────

UPDATE public.products SET description =
'Puce A18, appareil photo 48 Mpx et écran OLED Super Retina XDR 6,1 po — l''iPhone 17 offre l''expérience Apple complète dans un format parfaitement maniable. Fluidité, autonomie et qualité d''image au rendez-vous. Neuf, scellé, garantie 12 mois.'
WHERE slug = 'iphone-17';

UPDATE public.products SET description =
'Le plus fin de la gamme. L''iPhone Air embarque la puce A18 dans un châssis ultra-léger sans sacrifier l''appareil photo 48 Mpx ni la solidité IP68. Conçu pour ceux qui veulent la puissance Apple sans le poids. Neuf, scellé, garantie 12 mois.'
WHERE slug = 'iphone-air';

UPDATE public.products SET description =
'Puce A18, appareil photo 48 Mpx, écran OLED 6,1 po et résistance IP68 — l''iPhone 16 concentre toute la fiabilité Apple dans un format compact idéal au quotidien. Réseaux sociaux, photo, multitâche : il gère tout sans effort. Neuf, scellé, garantie 12 mois.'
WHERE slug = 'iphone-16';

UPDATE public.products SET description =
'Zoom 5× optique, mode Cinématique 4K 120 fps, écran ProMotion 6,9 po et puce A18 Pro — l''iPhone 16 Pro Max repousse les limites de la photo mobile. Autonomie record, finitions titane. Neuf, scellé, garantie 12 mois.'
WHERE slug = 'iphone-16-pro-max';

UPDATE public.products SET description =
'Puce A19 Pro, triple module photo 48 Mpx avec zoom 5× optique et écran OLED ProMotion 6,3 po — le 17 Pro est le Pro compact qui n''abandonne rien. Puissance professionnelle, taille humaine. IP68. Neuf, scellé, garantie 12 mois.'
WHERE slug = 'iphone-17-pro';

UPDATE public.products SET description =
'Le sommet de la gamme Apple. Puce A19 Pro, triple module photo 48 Mpx, écran ProMotion 6,9 po et autonomie record. Capturez, créez, partagez — sans la moindre limite technique. IP68. Neuf, scellé, garantie 12 mois.'
WHERE slug = 'iphone-17-pro-max';

-- ── SAMSUNG ──────────────────────────────────────────────────────────────────

UPDATE public.products SET description =
'Écran AMOLED 90 Hz fluide, appareil photo 50 Mpx polyvalent et 5G — le Galaxy A37 est taillé pour le quotidien : streaming, réseaux sociaux et appels au top. Design moderne, prix accessible. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-a37';

UPDATE public.products SET description =
'Grand écran Super AMOLED 120 Hz, photo 64 Mpx lumineuse de jour comme de nuit, charge rapide 45 W et IP67 — le Galaxy A57 est la référence milieu de gamme qui ne laisse rien au hasard. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-a57';

UPDATE public.products SET description =
'Snapdragon 8 Elite, triple module photo 50 Mpx, écran Dynamic AMOLED 120 Hz en format compact — le Galaxy S26 concentre toute la puissance flagship Samsung dans votre poche. IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-s26';

UPDATE public.products SET description =
'Grand écran QHD+ 6,7 po, Snapdragon 8 Elite et triple appareil photo 50 Mpx — le Galaxy S26+ est fait pour ceux qui vivent sur leur smartphone. Autonomie longue durée, finitions premium. IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-s26-plus';

UPDATE public.products SET description =
'200 Mpx, S Pen intégré, écran QHD+ 6,9 po et Snapdragon 8 Elite — le Galaxy S26 Ultra est l''outil ultime des créateurs et des professionnels. Zéro compromis. IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-s26-ultra';

UPDATE public.products SET description =
'Écran intérieur AMOLED pliable 7,9 po pour la productivité, design smartphone pour la poche — le Galaxy Z Fold 7 est dans une catégorie à part. Snapdragon 8 Elite, photo 200 Mpx, IPX8. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-z-fold-7';

UPDATE public.products SET description =
'Snapdragon 8 Elite, triple module 50 Mpx et écran Dynamic AMOLED 120 Hz dans un format compact — le Galaxy S25 est le flagship Samsung pensé pour ceux qui veulent l''essentiel, sans excès. IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-s25';

UPDATE public.products SET description =
'Capteur principal 200 Mpx, S Pen intégré, écran QHD+ immersif et Snapdragon 8 Elite — le Galaxy S25 Ultra est la machine des utilisateurs exigeants qui refusent les compromis. IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'samsung-galaxy-s25-ultra';

-- ── XIAOMI ───────────────────────────────────────────────────────────────────

UPDATE public.products SET description =
'Snapdragon 8 Elite, triple capteur Leica 50 Mpx et charge rapide 90 W — le Xiaomi 15 rivalise avec l''élite pour une fraction du prix. Compact, premium et fulguramment rapide. IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'xiaomi-15';

UPDATE public.products SET description =
'Dimensity 8400 Ultra, double capteur Leica 50 Mpx et écran AMOLED 144 Hz ultra-fluide — le 15 T offre une expérience quasi-flagship à un tarif qui surprend. Charge ultra-rapide, IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'xiaomi-15-t';

UPDATE public.products SET description =
'Snapdragon 8 Elite, triple capteur Leica 50 Mpx et charge qui remplit la batterie en moins de 20 minutes — le 15 T Pro fait tout mieux que prévu. Écran AMOLED 144 Hz, IP68. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'xiaomi-15-t-pro';

UPDATE public.products SET description =
'Capteur 200 Mpx, écran AMOLED 120 Hz, batterie 5 110 mAh avec charge rapide 45 W et Dimensity 7300 Ultra — le Redmi Note 14 Pro 5G est le meilleur rapport qualité-prix du marché. 5G, double SIM, Android 14. Neuf, scellé, garantie 24 mois.'
WHERE slug = 'xiaomi-redmi-note-14-pro';

-- ── GOPRO ────────────────────────────────────────────────────────────────────

UPDATE public.products SET description =
'Vidéo 5.3K60, stabilisation HyperSmooth 6.0 et étanchéité à 10 m sans boîtier — la HERO 13 capte chaque instant d''action avec une netteté et une fluidité sans égal. La référence des caméras sport. Neuve, scellée, garantie 1 an.'
WHERE slug = 'gopro-hero-13';

UPDATE public.products SET description =
'La HERO 13 en vidéo 5.3K, HyperSmooth 6.0, étanche à 10 m — livrée avec un pack d''accessoires complet pour filmer immédiatement. Tout ce qu''il faut pour démarrer l''aventure dès le premier jour. Neuve, scellée, garantie 1 an.'
WHERE slug = 'gopro-hero-13-pack';
