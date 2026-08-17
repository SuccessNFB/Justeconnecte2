-- ── JOURNAL DE DIAGNOSTIC TEMPORAIRE ─────────────────────────────────────────
-- Aucun paiement Monetico n'a jamais été marqué "payé" alors que Monetico
-- confirme des paiements acceptés côté back-office. Cette table capture ce que
-- /api/monetico-notify reçoit réellement pour diagnostiquer où ça bloque
-- (MAC invalide, référence introuvable, etc). À supprimer une fois résolu.

CREATE TABLE IF NOT EXISTS public.monetico_notify_log (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  reference      text,
  tpe            text,
  code_retour    text,
  mac_received   text,
  mac_expected   text,
  mac_valid      boolean,
  order_matched  boolean
);

ALTER TABLE public.monetico_notify_log ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.monetico_notify_log TO service_role;
