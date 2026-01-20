-- Adicionar coluna is_admin na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Criar política para admins poderem ver todos os perfis
CREATE POLICY "Admins podem ver todos os perfis" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE is_admin = true
  )
);

-- Criar política para admins poderem atualizar qualquer perfil
CREATE POLICY "Admins podem atualizar qualquer perfil" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE is_admin = true
  )
);