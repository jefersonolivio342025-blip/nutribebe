import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Food } from '@/data/menuData';

interface AlimentoDB {
  id: string;
  nome: string;
  tipo: 'proteina' | 'carboidrato' | 'vegetal';
  preparo: string | null;
  corte_6_9m: string | null;
  corte_9_12m: string | null;
  corte_12_mais: string | null;
}

const emojiMap: Record<string, string> = {
  'Frango': '🍗',
  'Carne Bovina': '🥩',
  'Peixe': '🐟',
  'Ovo': '🥚',
  'Feijão': '🫘',
  'Arroz': '🍚',
  'Batata': '🥔',
  'Batata Doce': '🍠',
  'Macarrão': '🍝',
  'Mandioca': '🥕',
  'Brócolis': '🥦',
  'Cenoura': '🥕',
  'Abobrinha': '🥒',
  'Chuchu': '🥒',
  'Beterraba': '🍠',
};

const typeToGroup: Record<string, 'protein' | 'carbs' | 'veggies'> = {
  'proteina': 'protein',
  'carboidrato': 'carbs',
  'vegetal': 'veggies',
};

const transformAlimentoToFood = (alimento: AlimentoDB): Food => ({
  id: alimento.id,
  name: alimento.nome,
  emoji: emojiMap[alimento.nome] || '🍽️',
  group: typeToGroup[alimento.tipo],
  prepGuide: alimento.preparo || '',
  cutGuide: {
    '6-9': alimento.corte_6_9m || '',
    '9-12': alimento.corte_9_12m || '',
    '12+': alimento.corte_12_mais || '',
  },
});

export const useAlimentos = () => {
  return useQuery({
    queryKey: ['alimentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alimentos')
        .select('*')
        .order('nome');

      if (error) {
        throw error;
      }

      return data as AlimentoDB[];
    },
  });
};

export const useAlimentosByTipo = () => {
  const { data: alimentos, isLoading, error } = useAlimentos();

  const proteins = alimentos
    ?.filter((a) => a.tipo === 'proteina')
    .map(transformAlimentoToFood) || [];

  const carbs = alimentos
    ?.filter((a) => a.tipo === 'carboidrato')
    .map(transformAlimentoToFood) || [];

  const veggies = alimentos
    ?.filter((a) => a.tipo === 'vegetal')
    .map(transformAlimentoToFood) || [];

  return {
    proteins,
    carbs,
    veggies,
    allFoods: [...proteins, ...carbs, ...veggies],
    isLoading,
    error,
  };
};
