-- Enable the pg_net extension for HTTP requests from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create a function to call the recovery email edge function
CREATE OR REPLACE FUNCTION public.trigger_recovery_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := current_setting('app.settings.supabase_url', true);
  service_role_key text := current_setting('app.settings.service_role_key', true);
  request_id bigint;
BEGIN
  -- Only trigger for non-premium users
  IF NEW.is_premium = false THEN
    -- Make async HTTP request to the edge function
    SELECT extensions.http_post(
      url := 'https://kpseuvvhaynlbpnuaenf.supabase.co/functions/v1/send-recovery-email',
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'profiles',
        'schema', 'public',
        'record', jsonb_build_object(
          'id', NEW.id,
          'user_id', NEW.user_id,
          'nome', NEW.nome,
          'is_premium', NEW.is_premium
        )
      ),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwc2V1dnZoYXlubGJwbnVhZW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDE0MjEsImV4cCI6MjA4NDMxNzQyMX0.MGSMMCZI1sW9QwtQGgka50XnexMCJd_eUcVto1fzRTU'
      )
    ) INTO request_id;
    
    RAISE LOG 'Recovery email trigger fired for user_id: %, request_id: %', NEW.user_id, request_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_created_send_recovery_email ON public.profiles;

CREATE TRIGGER on_profile_created_send_recovery_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_recovery_email();