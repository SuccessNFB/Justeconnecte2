-- Fix "Function Search Path Mutable" security advisor warning:
-- functions without a fixed search_path are vulnerable to search_path hijacking.
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
