-- Criar tabela de nutricionistas
CREATE TABLE public.nutricionistas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  crn TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  cidade TEXT NOT NULL,
  bairro TEXT,
  link_whatsapp TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.nutricionistas ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (nutricionistas são visíveis para todos os usuários logados)
CREATE POLICY "Usuários logados podem ver nutricionistas" 
ON public.nutricionistas 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Política para admins inserirem/editarem
CREATE POLICY "Admins podem gerenciar nutricionistas" 
ON public.nutricionistas 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Popular com exemplos de nutricionistas
INSERT INTO public.nutricionistas (nome, crn, especialidade, cidade, bairro, link_whatsapp, instagram) VALUES
('Dra. Ana Carolina Mendes', 'CRN-3 45678', 'Nutrição Materno-Infantil e BLW', 'São Paulo', 'Moema', 'https://wa.me/5511999998888', '@dra.ananutri'),
('Dra. Beatriz Santos', 'CRN-4 12345', 'Introdução Alimentar e Alergias', 'Rio de Janeiro', 'Barra da Tijuca', 'https://wa.me/5521988887777', '@beatriznutriinfantil'),
('Dra. Camila Ferreira', 'CRN-2 67890', 'Nutrição Pediátrica', 'Porto Alegre', 'Moinhos de Vento', 'https://wa.me/5551977776666', '@camilanutripediatrica'),
('Dra. Daniela Costa', 'CRN-3 11223', 'BLW e Seletividade Alimentar', 'São Paulo', 'Pinheiros', 'https://wa.me/5511966665555', '@nutriblw.dani'),
('Dra. Fernanda Lima', 'CRN-4 44556', 'Nutrição Materno-Infantil', 'Rio de Janeiro', 'Copacabana', 'https://wa.me/5521955554444', '@fernandanutrirj');