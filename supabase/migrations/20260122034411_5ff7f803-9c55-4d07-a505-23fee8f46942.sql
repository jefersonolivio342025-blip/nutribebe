-- Create efficient user lookup function to replace listUsers() call
CREATE OR REPLACE FUNCTION public.find_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT id FROM auth.users WHERE LOWER(email) = LOWER(user_email) LIMIT 1;
$$;