-- Adicionar colunas UTM na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN utm_source text DEFAULT NULL,
ADD COLUMN utm_medium text DEFAULT NULL,
ADD COLUMN utm_campaign text DEFAULT NULL,
ADD COLUMN utm_content text DEFAULT NULL;