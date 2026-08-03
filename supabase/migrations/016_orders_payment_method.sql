-- Track which payment provider was used for each order ('monetico' | 'scalapay')
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'monetico';
