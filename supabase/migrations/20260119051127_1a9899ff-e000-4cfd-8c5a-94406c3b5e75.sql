-- Adicionar colunas de restrições alimentares na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN sem_gluten BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN aplv BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN vegano BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN baby_name TEXT,
ADD COLUMN baby_birth_date DATE;