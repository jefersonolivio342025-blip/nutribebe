export type Allergen = 'gluten' | 'lactose' | 'egg' | 'fish';

export const allergenConfig: Record<Allergen, { label: string; emoji: string }> = {
  gluten: { label: 'Glúten', emoji: '🌾' },
  lactose: { label: 'Lactose', emoji: '🥛' },
  egg: { label: 'Ovo', emoji: '🥚' },
  fish: { label: 'Peixe', emoji: '🐟' },
};

export interface Ingredient {
  name: string;
  quantity: string;
  emoji: string;
}

export interface CuttingGuide {
  '6m': string;
  '9m+': string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  ingredients: Ingredient[];
  prepTime: string;
  allergens: Allergen[];
  cuttingGuide: CuttingGuide;
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

export interface NutritionTip {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const nutritionTips: NutritionTip[] = [
  {
    id: 'tip-1',
    title: 'Sem sal até 1 ano',
    description: 'Os rins do bebê ainda estão em desenvolvimento. Evite adicionar sal às refeições até pelo menos 12 meses.',
    emoji: '🧂',
  },
  {
    id: 'tip-2',
    title: 'Ferro no almoço',
    description: 'O ferro é essencial para o desenvolvimento cerebral. Ofereça carne, feijão ou lentilha no almoço diariamente.',
    emoji: '💪',
  },
  {
    id: 'tip-3',
    title: 'Como oferecer água',
    description: 'A partir dos 6 meses, ofereça água em copinho aberto durante as refeições. Evite sucos.',
    emoji: '💧',
  },
  {
    id: 'tip-4',
    title: 'Vitamina C + Ferro',
    description: 'Ofereça frutas cítricas junto com refeições ricas em ferro para melhorar a absorção do nutriente.',
    emoji: '🍊',
  },
  {
    id: 'tip-5',
    title: 'Sem açúcar até 2 anos',
    description: 'Evite oferecer açúcar, mel, achocolatados e alimentos ultraprocessados antes dos 2 anos.',
    emoji: '🍬',
  },
  {
    id: 'tip-6',
    title: 'Texturas são importantes',
    description: 'Varie as texturas gradualmente: purês lisos, amassados, pedacinhos. Isso estimula a mastigação.',
    emoji: '🥄',
  },
];

export const dailyRecipes: Record<RecipeMealType, Recipe[]> = {
  breakfast: [
    {
      id: 'bf-1',
      name: 'Banana Amassada com Aveia',
      description: 'Uma combinação nutritiva e fácil de preparar, perfeita para o primeiro contato com alimentos sólidos.',
      ageRange: '+6 meses',
      allergens: ['gluten'],
      cuttingGuide: {
        '6m': 'Amasse a banana com um garfo até formar um purê grosso. A aveia deve estar bem hidratada e macia.',
        '9m+': 'Corte a banana em rodelas finas ou palitos. A aveia pode ser oferecida em flocos maiores.',
      },
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
      allergens: ['gluten'],
      cuttingGuide: {
        '6m': 'Rale a maçã bem fininha e misture ao mingau. A consistência deve ser de purê cremoso.',
        '9m+': 'Corte a maçã cozida em palitos finos que o bebê consiga segurar. O mingau pode ser mais espesso.',
      },
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
      allergens: ['egg', 'gluten'],
      cuttingGuide: {
        '6m': 'Não recomendado para 6 meses. Prefira a banana amassada nesta fase.',
        '9m+': 'Corte a panqueca em tiras da largura de um dedo adulto para o bebê segurar e morder.',
      },
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
      allergens: [],
      cuttingGuide: {
        '6m': 'Amasse todos os ingredientes com garfo. A carne deve ser bem desfiada ou moída finamente, misturada ao purê.',
        '9m+': 'A mandioquinha pode ser oferecida em palitos cozidos. A carne em tiras finas e macias do tamanho de um dedo.',
      },
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
      allergens: [],
      cuttingGuide: {
        '6m': 'Corte o frango em tiras da largura de um dedo para o bebê segurar. A abóbora pode ser amassada ou em fatias grossas.',
        '9m+': 'O frango pode ser desfiado em pedaços menores. A abóbora em cubos macios que o bebê pegue com a pinça.',
      },
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
      allergens: [],
      cuttingGuide: {
        '6m': 'Amasse o arroz com a lentilha e a cenoura até formar um purê. Ofereça na colher.',
        '9m+': 'A cenoura pode ser cortada em palitos cozidos. Lentilha e arroz ofereça soltos para treino da pinça.',
      },
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
      allergens: [],
      cuttingGuide: {
        '6m': 'Raspe a pera com uma colher para obter uma textura de purê fino. Ideal para as primeiras frutas.',
        '9m+': 'Corte em fatias finas ou palitos que o bebê consiga segurar. A casca pode ser mantida para aderência.',
      },
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
      allergens: [],
      cuttingGuide: {
        '6m': 'Corte em tiras longas e grossas (formato de "batata frita"). Retire todas as sementes. O bebê vai chupar e morder.',
        '9m+': 'Pode cortar em cubos ou triângulos menores. Sempre sem sementes.',
      },
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
      allergens: ['lactose'],
      cuttingGuide: {
        '6m': 'Amasse a manga e misture ao iogurte formando um creme liso. Ofereça na colher.',
        '9m+': 'A manga pode ser cortada em tiras finas. Sirva o iogurte separado em um potinho para o bebê se servir.',
      },
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
      allergens: ['gluten'],
      cuttingGuide: {
        '6m': 'Bata todos os ingredientes no liquidificador formando um caldo liso. O macarrão pode ser oferecido bem cozido em pedaços grandes.',
        '9m+': 'Pique os legumes em cubos pequenos. O macarrão letrinhas é ideal pois é pequeno e fácil de mastigar.',
      },
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
      allergens: [],
      cuttingGuide: {
        '6m': 'Amasse o feijão e a abóbora juntos até formar um caldo grosso e homogêneo. Ofereça na colher.',
        '9m+': 'O feijão pode ser levemente amassado. A abóbora em cubos macios para treino da pinça.',
      },
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
      allergens: ['fish'],
      cuttingGuide: {
        '6m': 'Amasse a batata e misture o peixe bem desfiado, sem nenhuma espinha. Textura de purê.',
        '9m+': 'A batata em cubos macios. O peixe em lascas grandes que o bebê consiga pegar. Verifique espinhas duas vezes!',
      },
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
