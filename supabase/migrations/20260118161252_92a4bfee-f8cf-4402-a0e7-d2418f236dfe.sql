-- Criar tabela de alimentos com guias BLW
CREATE TABLE public.alimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('proteina', 'carboidrato', 'vegetal')),
  preparo TEXT,
  corte_6_9m TEXT,
  corte_9_12m TEXT,
  corte_12_mais TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de profiles para dados do usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de cardápios salvos
CREATE TABLE public.cardapios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  refeicao TEXT NOT NULL CHECK (refeicao IN ('almoco', 'jantar')),
  proteina_id UUID REFERENCES public.alimentos(id),
  carboidrato_id UUID REFERENCES public.alimentos(id),
  vegetal_id UUID REFERENCES public.alimentos(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, data, refeicao)
);

-- Habilitar RLS
ALTER TABLE public.alimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardapios ENABLE ROW LEVEL SECURITY;

-- Políticas para alimentos (público para leitura)
CREATE POLICY "Alimentos são visíveis para todos" 
ON public.alimentos 
FOR SELECT 
USING (true);

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seu próprio perfil" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Políticas para cardápios
CREATE POLICY "Usuários podem ver seus próprios cardápios" 
ON public.cardapios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios cardápios" 
ON public.cardapios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios cardápios" 
ON public.cardapios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Inserir alimentos iniciais
INSERT INTO public.alimentos (nome, tipo, preparo, corte_6_9m, corte_9_12m, corte_12_mais) VALUES
-- Proteínas
('Frango', 'proteina', 'Cozinhe bem até ficar macio. Desfie ou corte conforme a idade.', 'Tiras longas do tamanho do dedo', 'Pedaços pequenos desfiados', 'Cubos de 1-2cm'),
('Carne Bovina', 'proteina', 'Cozinhe em pressão até ficar muito macia. Desfie bem.', 'Tiras grandes desfiadas', 'Pedaços desfiados menores', 'Cubos macios de 1cm'),
('Peixe', 'proteina', 'Cozinhe no vapor ou assado. Verifique espinhas!', 'Lascas grandes macias', 'Pedaços em flocos', 'Cubos ou lascas'),
('Ovo', 'proteina', 'Cozinhe bem (gema dura). Nunca sirva cru.', 'Fatias de ovo cozido', 'Pedaços de ovo mexido', 'Inteiro ou picado'),
('Feijão', 'proteina', 'Cozinhe até ficar bem macio. Amasse levemente.', 'Amassado grosseiramente', 'Levemente amassado', 'Inteiro ou amassado'),
-- Carboidratos
('Arroz', 'carboidrato', 'Cozinhe até ficar macio. Pode amassar levemente.', 'Bolinho de arroz macio', 'Arroz bem cozido solto', 'Arroz normal'),
('Batata', 'carboidrato', 'Cozinhe até ficar macia. Não adicione sal em excesso.', 'Palitos grossos cozidos', 'Cubos macios de 2cm', 'Cubos de 1-2cm'),
('Batata Doce', 'carboidrato', 'Asse ou cozinhe até ficar bem macia.', 'Palitos grossos assados', 'Cubos macios de 2cm', 'Cubos de 1-2cm'),
('Macarrão', 'carboidrato', 'Cozinhe até ficar al dente ou mais macio para bebês.', 'Fusilli ou penne grande', 'Espaguete cortado', 'Qualquer formato'),
('Mandioca', 'carboidrato', 'Cozinhe em pressão até ficar bem macia.', 'Palitos grossos macios', 'Cubos de 2cm', 'Cubos de 1-2cm'),
-- Vegetais
('Brócolis', 'vegetal', 'Cozinhe no vapor até ficar macio mas não mole.', 'Floretes inteiros com cabo', 'Floretes menores', 'Floretes pequenos'),
('Cenoura', 'vegetal', 'Cozinhe até ficar macia. Nunca sirva crua.', 'Palitos grossos cozidos', 'Palitos médios', 'Rodelas ou cubos'),
('Abobrinha', 'vegetal', 'Cozinhe no vapor ou refogue levemente.', 'Palitos grossos com casca', 'Meias luas', 'Cubos pequenos'),
('Chuchu', 'vegetal', 'Cozinhe até ficar bem macio.', 'Palitos grossos', 'Cubos de 2cm', 'Cubos de 1cm'),
('Beterraba', 'vegetal', 'Cozinhe até ficar macia. Atenção: mancha!', 'Palitos grossos cozidos', 'Cubos de 2cm', 'Cubos de 1cm');