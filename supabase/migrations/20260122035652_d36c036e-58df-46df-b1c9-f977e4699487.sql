-- Drop insecure policy that allows privilege escalation
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;

-- Recreate with WITH CHECK to prevent privilege escalation
-- Users can only update their own profile AND cannot modify is_premium or is_admin
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Prevent modification of sensitive privilege fields
  is_premium = (SELECT is_premium FROM public.profiles WHERE user_id = auth.uid()) AND
  is_admin = (SELECT is_admin FROM public.profiles WHERE user_id = auth.uid())
);