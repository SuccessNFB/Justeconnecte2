-- Remplacement de Monetico/Stripe par PayPal comme unique moyen de paiement.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paypal_order_id text;
