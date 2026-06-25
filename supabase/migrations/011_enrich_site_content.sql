-- ── 011 ENRICH SITE CONTENT ──────────────────────────────────────────────────
-- Adds global contact info (WhatsApp number), social proof stats,
-- and WhatsApp CTA content so /admin/contenu exposes them for editing.

INSERT INTO public.site_content (page, section, key, value, type) VALUES
  -- Contact global (WhatsApp number used across the whole site)
  ('global', 'contact', 'whatsapp_number',  '33610750294',                              'text'),
  ('global', 'contact', 'whatsapp_label',   'Écrire sur WhatsApp',                       'text'),
  ('global', 'contact', 'response_time',    'Réponse en moins de 2 h · 7j/7 · 8h–20h',  'text'),
  -- Accueil · Barre de preuves sociales
  ('accueil', 'social_proof', 'stat1_value', '1 200+',              'text'),
  ('accueil', 'social_proof', 'stat1_label', 'commandes livrées',   'text'),
  ('accueil', 'social_proof', 'stat2_value', '4,8 / 5',             'text'),
  ('accueil', 'social_proof', 'stat2_label', '127 avis vérifiés',   'text'),
  ('accueil', 'social_proof', 'stat3_value', '2 à 5 j',             'text'),
  ('accueil', 'social_proof', 'stat3_label', 'délai de livraison',  'text'),
  ('accueil', 'social_proof', 'stat4_value', '3',                   'text'),
  ('accueil', 'social_proof', 'stat4_label', 'territoires couverts','text'),
  -- Accueil · CTA WhatsApp
  ('accueil', 'whatsapp_cta', 'title',    'Une question avant de commander ?',              'text'),
  ('accueil', 'whatsapp_cta', 'subtitle', 'Notre équipe répond sous 2 heures, 7j/7. Conseils personnalisés, suivi de commande et garantie — tout passe par WhatsApp.', 'textarea'),
  ('accueil', 'whatsapp_cta', 'btn_label','Écrire sur WhatsApp',                            'text')
ON CONFLICT (page, section, key) DO NOTHING;
