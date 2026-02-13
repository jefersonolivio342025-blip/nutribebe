export interface Ingredient {
  name: string;
  quantity: string;
  emoji: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  ingredients: Ingredient[];
  prepTime: string;
}

export type RecipeMealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface RecipeMealConfig {
  type: RecipeMealType;
  label: string;
  emoji: string;
}

export const recipeMealConfigs: RecipeMealConfig[] = [
  { type: 'breakfast', label: 'Café da Manhã', emoji: '☀️' },
  { type: 'lunch', label: 'Almoço', emoji: '🍽️' },
  { type: 'snack', label: 'Lanche da Tarde', emoji: '🍎' },
  { type: 'dinner', label: 'Jantar', emoji: '🌙' },
];

export const dailyRecipes: Record<RecipeMealType, Recipe[]> = {
  breakfast: [
    {
      id: 'bf-1',
      name: 'Banana Amassada com Aveia',
      description: 'Uma combinação nutritiva e fácil de preparar, perfeita para o primeiro contato com alimentos sólidos.',
      ageRange: '+6 meses',
      ingredients: [
        { name: 'Banana madura', quantity: '½ unidade', emoji: '🍌' },
        { name: 'Aveia em flocos finos', quantity: '1 colher de sopa', emoji: '🌾' },
        { name: 'Leite materno ou fórmula', quantity: '2 colheres de sopa', emoji: '🍼' },
      ],
      prepTime: '5 min',
    },
    {
      id: 'bf-2',
      name: 'Mingau de Aveia com Maçã',
      description: 'Rico em fibras e vitaminas, ideal para começar o dia com energia.',
      ageRange: '+6 meses',
      ingredients: [
        { name: 'Aveia em flocos finos', quantity: '2 colheres de sopa', emoji: '🌾' },
        { name: 'Maçã sem casca ralada', quantity: '¼ unidade', emoji: '🍎' },
        { name: 'Água filtrada', quantity: '100 ml', emoji: '💧' },
        { name: 'Canela em pó', quantity: '1 pitada', emoji: '✨' },
      ],
      prepTime: '10 min',
    },
    {
      id: 'bf-3',
      name: 'Panqueca de Banana com Ovo',
      description: 'Panquequinha macia e fácil de segurar, ótima para BLW.',
      ageRange: '+9 meses',
      ingredients: [
        { name: 'Banana madura', quantity: '1 unidade', emoji: '🍌' },
        { name: 'Ovo', quantity: '1 unidade', emoji: '🥚' },
        { name: 'Aveia em flocos', quantity: '2 colheres de sopa', emoji: '🌾' },
      ],
      prepTime: '15 min',
    },
  ],
  lunch: [
    {
      id: 'lu-1',
      name: 'Purê de Mandioquinha com Feijão e Carne',
      description: 'Refeição completa com proteína, carboidrato e ferro essencial.',
      ageRange: '+6 meses',
      ingredients: [
        { name: 'Mandioquinha', quantity: '1 unidade média', emoji: '🥕' },
        { name: 'Feijão cozido amassado', quantity: '2 colheres de sopa', emoji: '🫘' },
        { name: 'Carne moída bem cozida', quantity: '1 colher de sopa', emoji: '🥩' },
        { name: 'Azeite extra-virgem', quantity: '1 colher de chá', emoji: '🫒' },
      ],
      prepTime: '30 min',
    },
    {
      id: 'lu-2',
      name: 'Papinha de Abóbora com Frango',
      description: 'Combinação rica em vitamina A e proteína de alta qualidade.',
      ageRange: '+6 meses',
      ingredients: [
        { name: 'Abóbora cabotiá', quantity: '2 fatias médias', emoji: '🎃' },
        { name: 'Frango desfiado', quantity: '1 colher de sopa', emoji: '🍗' },
        { name: 'Arroz cozido', quantity: '2 colheres de sopa', emoji: '🍚' },
        { name: 'Brócolis cozido', quantity: '2 floretes', emoji: '🥦' },
        { name: 'Azeite extra-virgem', quantity: '1 colher de chá', emoji: '🫒' },
      ],
      prepTime: '35 min',
    },
    {
      id: 'lu-3',
      name: 'Arroz com Lentilha e Cenoura',
      description: 'Rico em ferro e fibras, perfeito para uma refeição equilibrada.',
      ageRange: '+9 meses',
      ingredients: [
        { name: 'Arroz cozido', quantity: '3 colheres de sopa', emoji: '🍚' },
        { name: 'Lentilha cozida', quantity: '2 colheres de sopa', emoji: '🫘' },
        { name: 'Cenoura cozida', quantity: '½ unidade', emoji: '🥕' },
        { name: 'Abobrinha refogada', quantity: '2 rodelas', emoji: '🥒' },
      ],
      prepTime: '25 min',
    },
  ],
  snack: [
    {
      id: 'sn-1',
      name: 'Pera Raspadinha',
      description: 'Fruta suave e fácil de digerir, ótima opção para lanches.',
      ageRange: '+6 meses',
      ingredients: [
        { name: 'Pera madura', quantity: '½ unidade', emoji: '🍐' },
      ],
      prepTime: '2 min',
    },
    {
      id: 'sn-2',
      name: 'Melancia em Tiras (Corte Seguro)',
      description: 'Hidratante e refrescante, ideal para bebês que já seguram alimentos.',
      ageRange: '+6 meses',
      ingredients: [
        { name: 'Melancia sem sementes', quantity: '1 fatia grande', emoji: '🍉' },
      ],
      prepTime: '3 min',
    },
    {
      id: 'sn-3',
      name: 'Iogurte Natural com Manga',
      description: 'Probióticos naturais com vitaminas, uma combinação deliciosa.',
      ageRange: '+9 meses',
      ingredients: [
        { name: 'Iogurte natural sem açúcar', quantity: '3 colheres de sopa', emoji: '🥛' },
        { name: 'Manga madura amassada', quantity: '2 colheres de sopa', emoji: '🥭' },
      ],
      prepTime: '3 min',
    },
  ],
  dinner: [
    {
      id: 'dn-1',
      name: 'Sopa de Letrinhas com Legumes',
      description: 'Sopa quentinha e nutritiva, cheia de vegetais e muito saborosa.',
      ageRange: '+9 meses',
      ingredients: [
        { name: 'Macarrão letrinhas', quantity: '2 colheres de sopa', emoji: '🍝' },
        { name: 'Cenoura picada', quantity: '½ unidade', emoji: '🥕' },
        { name: 'Batata picada', quantity: '½ unidade', emoji: '🥔' },
        { name: 'Frango desfiado', quantity: '1 colher de sopa', emoji: '🍗' },
        { name: 'Espinafre picado', quantity: '1 colher de sopa', emoji: '🥬' },
      ],
      prepTime: '25 min',
    },
    {
      id: 'dn-2',
      name: 'Caldo de Feijão com Abóbora',
      description: 'Caldo nutritivo e reconfortante, perfeito para o final do dia.',
      ageRange: '+6 meses',
      ingredients: [
        { name: 'Feijão cozido', quantity: '3 colheres de sopa', emoji: '🫘' },
        { name: 'Abóbora cozida', quantity: '2 colheres de sopa', emoji: '🎃' },
        { name: 'Caldo de legumes caseiro', quantity: '½ xícara', emoji: '🥣' },
        { name: 'Azeite extra-virgem', quantity: '1 colher de chá', emoji: '🫒' },
      ],
      prepTime: '20 min',
    },
    {
      id: 'dn-3',
      name: 'Purê de Batata com Peixe',
      description: 'Rico em ômega-3 e fácil de preparar, ideal para a janta.',
      ageRange: '+9 meses',
      ingredients: [
        { name: 'Batata cozida', quantity: '1 unidade média', emoji: '🥔' },
        { name: 'Peixe sem espinhas cozido', quantity: '1 colher de sopa', emoji: '🐟' },
        { name: 'Abobrinha cozida', quantity: '2 rodelas', emoji: '🥒' },
        { name: 'Azeite extra-virgem', quantity: '1 colher de chá', emoji: '🫒' },
      ],
      prepTime: '30 min',
    },
  ],
};
