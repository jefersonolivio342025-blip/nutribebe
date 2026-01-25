-- Remove the problematic trigger and function that use http_post extension (CASCADE to remove dependencies)
DROP TRIGGER IF EXISTS on_profile_created_send_recovery_email ON public.profiles;
DROP FUNCTION IF EXISTS public.trigger_recovery_email() CASCADE;