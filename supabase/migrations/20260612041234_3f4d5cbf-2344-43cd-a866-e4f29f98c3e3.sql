
-- email_logs: restrict insert to service_role
DROP POLICY IF EXISTS "Service role can insert email logs" ON public.email_logs;
CREATE POLICY "Service role can insert email logs"
ON public.email_logs FOR INSERT TO service_role WITH CHECK (true);

-- leads: restrict insert to service_role only
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Service role can insert leads"
ON public.leads FOR INSERT TO service_role WITH CHECK (true);

-- conversion_events: prevent authenticated users from inserting null/false user_id
DROP POLICY IF EXISTS "Users can insert their own events" ON public.conversion_events;
CREATE POLICY "Users can insert their own events"
ON public.conversion_events FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous can insert anonymous events"
ON public.conversion_events FOR INSERT TO anon
WITH CHECK (user_id IS NULL);

-- Revoke EXECUTE on internal SECURITY DEFINER functions from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.find_user_id_by_email(text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
