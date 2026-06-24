-- ── CATÉGORIES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id         uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text  NOT NULL,
  slug       text  UNIQUE NOT NULL,
  sort_order int   NOT NULL DEFAULT 0
);
GRANT SELECT ON public.categories TO anon, authenticated;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
CREATE POLICY "admin full categories" ON public.categories FOR ALL TO authenticated
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Smartphones', 'smartphones', 1),
  ('Tablettes',   'tablettes',   2),
  ('Caméras',     'cameras',     3),
  ('Audio',       'audio',       4),
  ('Accessoires', 'accessoires', 5)
ON CONFLICT (slug) DO NOTHING;

-- Ajouter la colonne catégorie aux produits
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- Mettre tous les produits existants en Smartphones par défaut
UPDATE public.products
  SET category_id = (SELECT id FROM public.categories WHERE slug = 'smartphones')
  WHERE category_id IS NULL;

-- ── CONTENU DU SITE ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_content (
  id      uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  page    text  NOT NULL,
  section text  NOT NULL,
  key     text  NOT NULL,
  value   text  NOT NULL DEFAULT '',
  type    text  NOT NULL DEFAULT 'text',
  UNIQUE (page, section, key)
);
GRANT SELECT ON public.site_content TO anon, authenticated;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content public read" ON public.site_content FOR SELECT USING (true);
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
CREATE POLICY "admin full site_content" ON public.site_content FOR ALL TO authenticated
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.site_content (page, section, key, value, type) VALUES
  -- Accueil · Héro
  ('accueil', 'hero', 'badge',         'Livraison en 7–10 jours', 'text'),
  ('accueil', 'hero', 'title',         'Les meilleurs smartphones', 'text'),
  ('accueil', 'hero', 'subtitle',      'livrés aux Antilles & Guyane', 'text'),
  ('accueil', 'hero', 'cta_primary',   'Voir la boutique', 'text'),
  ('accueil', 'hero', 'cta_secondary', 'En savoir plus', 'text'),
  -- Accueil · Badges de confiance
  ('accueil', 'trust', '1_title', 'Produits 100 % authentiques',  'text'),
  ('accueil', 'trust', '1_body',  'Sélectionnés directement chez les distributeurs officiels.', 'textarea'),
  ('accueil', 'trust', '2_title', 'Garantie constructeur',         'text'),
  ('accueil', 'trust', '2_body',  'Tous nos appareils bénéficient de la garantie officielle.', 'textarea'),
  ('accueil', 'trust', '3_title', 'Livraison express',             'text'),
  ('accueil', 'trust', '3_body',  'Guadeloupe, Martinique, Guyane. Délai estimé à la commande.', 'textarea'),
  ('accueil', 'trust', '4_title', 'Support réactif',               'text'),
  ('accueil', 'trust', '4_body',  'WhatsApp, email ou téléphone. Réponse sous 2 heures.', 'textarea'),
  -- Fiche produit · FAQ
  ('produit', 'faq', '1_q', 'Comment se passe la livraison ?', 'text'),
  ('produit', 'faq', '1_a', 'Nous livrons en Martinique, Guadeloupe et Guyane via transporteur express. Le délai est de 7 à 10 jours ouvrés après expédition.', 'textarea'),
  ('produit', 'faq', '2_q', 'Les produits sont-ils garantis ?', 'text'),
  ('produit', 'faq', '2_a', 'Oui, tous nos appareils sont neufs et bénéficient de la garantie constructeur (12 à 24 mois selon les marques).', 'textarea'),
  ('produit', 'faq', '3_q', 'Puis-je retourner un produit ?', 'text'),
  ('produit', 'faq', '3_a', 'Vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation, conformément à la loi.', 'textarea'),
  ('produit', 'faq', '4_q', 'Comment puis-je suivre ma commande ?', 'text'),
  ('produit', 'faq', '4_a', 'Dès l''expédition, vous recevez un numéro de suivi par email ou WhatsApp pour suivre votre colis en temps réel.', 'textarea'),
  ('produit', 'faq', '5_q', 'Puis-je payer en plusieurs fois ?', 'text'),
  ('produit', 'faq', '5_a', 'Oui, nous proposons le paiement en 3x sans frais via Scalapay sur les commandes éligibles.', 'textarea')
ON CONFLICT (page, section, key) DO NOTHING;
