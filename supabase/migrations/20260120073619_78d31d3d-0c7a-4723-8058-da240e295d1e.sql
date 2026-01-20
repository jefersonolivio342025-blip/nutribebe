-- 1. Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND is_admin = true
  )
$$;

-- 2. Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins podem atualizar qualquer perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;

-- 3. Recreate admin policies using the security definer function
CREATE POLICY "Admins podem ver todos os perfis" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins podem atualizar qualquer perfil" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- 4. Also fix the conversion_events and nutricionistas policies that reference profiles
DROP POLICY IF EXISTS "Admins can view all events" ON public.conversion_events;
CREATE POLICY "Admins can view all events" 
ON public.conversion_events 
FOR SELECT 
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins podem gerenciar nutricionistas" ON public.nutricionistas;
CREATE POLICY "Admins podem gerenciar nutricionistas" 
ON public.nutricionistas 
FOR ALL 
USING (public.is_admin(auth.uid()));