-- ── SECTIONS DE PAGE (builder) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_sections (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  page       text    NOT NULL DEFAULT 'accueil',
  type       text    NOT NULL,
  sort_order int     NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  config     jsonb   NOT NULL DEFAULT '{}'
);
GRANT SELECT ON public.site_sections TO anon, authenticated;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_sections public read" ON public.site_sections FOR SELECT USING (true);
GRANT INSERT, UPDATE, DELETE ON public.site_sections TO authenticated;
CREATE POLICY "admin full site_sections" ON public.site_sections FOR ALL TO authenticated
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Sections par défaut de la page d'accueil
INSERT INTO public.site_sections (page, type, sort_order, is_active, config) VALUES
  ('accueil', 'trust', 1, true, '{
    "items": [
      {"title": "Produits 100 % authentiques",  "body": "Sélectionnés directement chez les distributeurs officiels."},
      {"title": "Garantie constructeur",         "body": "Tous nos appareils bénéficient de la garantie officielle."},
      {"title": "Livraison express",             "body": "Guadeloupe, Martinique, Guyane. Délai estimé à la commande."},
      {"title": "Support réactif",               "body": "WhatsApp, email ou téléphone. Réponse sous 2 heures."}
    ]
  }'),
  ('accueil', 'products_new',        2, true, '{"title": "Nouveautés"}'),
  ('accueil', 'products_bestseller', 3, true, '{"title": "Meilleures ventes"}');
