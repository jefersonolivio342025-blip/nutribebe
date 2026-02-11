export interface Food {
  id: string;
  name: string;
  emoji: string;
  group: 'protein' | 'carbs' | 'veggies';
  prepGuide: string;
  cutGuide: {
    '6-9': string;
    '9-12': string;
    '12+': string;
  };
}

export type MealType = 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';

export interface Meal {
  type: MealType;
  foods: Food[];
}

export interface DayMenu {
  date: Date;
  dayName: string;
  meals: Meal[];
}

export const proteins: Food[] = [
  {
    id: 'frango',
    name: 'Frango',
    emoji: '🍗',
    group: 'protein',
    prepGuide: 'Cozinhe bem até não haver partes rosadas. Desfie ou corte em tiras.',
    cutGuide: {
      '6-9': 'Tiras do tamanho do dedo, bem macias',
      '9-12': 'Pedaços menores, do tamanho de uma moeda',
      '12+': 'Cubos pequenos ou desfiado'
    }
  },
  {
    id: 'carne',
    name: 'Carne Bovina',
    emoji: '🥩',
    group: 'protein',
    prepGuide: 'Cozinhe até ficar bem macia, sem gorduras visíveis.',
    cutGuide: {
      '6-9': 'Tiras longas e finas, muito macias',
      '9-12': 'Pedaços pequenos e macios',
      '12+': 'Cubos ou carne moída'
    }
  },
  {
    id: 'peixe',
    name: 'Peixe',
    emoji: '🐟',
    group: 'protein',
    prepGuide: 'Retire todas as espinhas. Cozinhe no vapor ou assado.',
    cutGuide: {
      '6-9': 'Lascas grandes sem espinhas',
      '9-12': 'Pedaços menores em lascas',
      '12+': 'Pedaços pequenos ou desfiado'
    }
  },
  {
    id: 'ovo',
    name: 'Ovo',
    emoji: '🥚',
    group: 'protein',
    prepGuide: 'Cozinhe até a gema ficar firme. Nunca sirva cru.',
    cutGuide: {
      '6-9': 'Ovo cozido cortado em tiras ou omelete em tiras',
      '9-12': 'Pedaços menores de ovo cozido',
      '12+': 'Ovo mexido ou picado'
    }
  },
  {
    id: 'feijao',
    name: 'Feijão',
    emoji: '🫘',
    group: 'protein',
    prepGuide: 'Cozinhe até ficar bem macio. Pode amassar levemente.',
    cutGuide: {
      '6-9': 'Amassado ou em purê grosso',
      '9-12': 'Levemente amassado',
      '12+': 'Grãos inteiros macios'
    }
  }
];

export const carbs: Food[] = [
  {
    id: 'arroz',
    name: 'Arroz',
    emoji: '🍚',
    group: 'carbs',
    prepGuide: 'Cozinhe até ficar bem macio. Pode usar integral após 12 meses.',
    cutGuide: {
      '6-9': 'Bem cozido e amassado',
      '9-12': 'Cozido normalmente',
      '12+': 'Cozido normalmente'
    }
  },
  {
    id: 'batata',
    name: 'Batata',
    emoji: '🥔',
    group: 'carbs',
    prepGuide: 'Cozinhe até ficar bem macia. Não adicione sal em excesso.',
    cutGuide: {
      '6-9': 'Palitos grossos ou amassada',
      '9-12': 'Cubos pequenos',
      '12+': 'Pedaços maiores'
    }
  },
  {
    id: 'macarrao',
    name: 'Macarrão',
    emoji: '🍝',
    group: 'carbs',
    prepGuide: 'Cozinhe além do al dente. Use formatos fáceis de pegar.',
    cutGuide: {
      '6-9': 'Fusilli ou penne bem cozidos',
      '9-12': 'Pedaços menores de massa',
      '12+': 'Qualquer formato'
    }
  },
  {
    id: 'batata-doce',
    name: 'Batata Doce',
    emoji: '🍠',
    group: 'carbs',
    prepGuide: 'Asse ou cozinhe até ficar bem macia.',
    cutGuide: {
      '6-9': 'Palitos grossos',
      '9-12': 'Cubos pequenos',
      '12+': 'Pedaços variados'
    }
  },
  {
    id: 'mandioca',
    name: 'Mandioca',
    emoji: '🥕',
    group: 'carbs',
    prepGuide: 'Cozinhe até ficar bem macia. Retire fibras do centro.',
    cutGuide: {
      '6-9': 'Palitos grossos sem fibras',
      '9-12': 'Pedaços menores',
      '12+': 'Cubos ou palitos'
    }
  }
];

export const veggies: Food[] = [
  {
    id: 'brocolis',
    name: 'Brócolis',
    emoji: '🥦',
    group: 'veggies',
    prepGuide: 'Cozinhe no vapor até ficar macio mas não mole demais.',
    cutGuide: {
      '6-9': 'Floretes com cabo longo para segurar',
      '9-12': 'Floretes menores',
      '12+': 'Picado ou floretes pequenos'
    }
  },
  {
    id: 'cenoura',
    name: 'Cenoura',
    emoji: '🥕',
    group: 'veggies',
    prepGuide: 'Cozinhe até ficar bem macia. Nunca sirva crua para bebês.',
    cutGuide: {
      '6-9': 'Palitos grossos bem cozidos',
      '9-12': 'Rodelas ou cubos',
      '12+': 'Palitos finos ou ralada'
    }
  },
  {
    id: 'abobrinha',
    name: 'Abobrinha',
    emoji: '🥒',
    group: 'veggies',
    prepGuide: 'Cozinhe no vapor ou refogue até amaciar.',
    cutGuide: {
      '6-9': 'Tiras longas com casca',
      '9-12': 'Meias-luas',
      '12+': 'Cubos ou rodelas'
    }
  },
  {
    id: 'abobora',
    name: 'Abóbora',
    emoji: '🎃',
    group: 'veggies',
    prepGuide: 'Asse ou cozinhe até ficar bem macia.',
    cutGuide: {
      '6-9': 'Fatias grossas assadas',
      '9-12': 'Cubos macios',
      '12+': 'Purê ou cubos'
    }
  },
  {
    id: 'espinafre',
    name: 'Espinafre',
    emoji: '🥬',
    group: 'veggies',
    prepGuide: 'Refogue ou cozinhe brevemente. Misture com outros alimentos.',
    cutGuide: {
      '6-9': 'Misturado em purês ou omeletes',
      '9-12': 'Picado fino em preparações',
      '12+': 'Levemente picado'
    }
  }
];

export const allFoods = [...proteins, ...carbs, ...veggies];

export const generateWeeklyMenu = (): DayMenu[] => {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  const weekMenu: DayMenu[] = [];
  const usedProteinsToday: Set<string> = new Set();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + i);
    
    usedProteinsToday.clear();
    
    const lunchProtein = proteins[Math.floor(Math.random() * proteins.length)];
    usedProteinsToday.add(lunchProtein.id);
    
    let dinnerProtein = proteins[Math.floor(Math.random() * proteins.length)];
    while (usedProteinsToday.has(dinnerProtein.id) && proteins.length > 1) {
      dinnerProtein = proteins[Math.floor(Math.random() * proteins.length)];
    }
    
    const lunchCarb = carbs[Math.floor(Math.random() * carbs.length)];
    const dinnerCarb = carbs[Math.floor(Math.random() * carbs.length)];
    
    const lunchVeggie = veggies[Math.floor(Math.random() * veggies.length)];
    const dinnerVeggie = veggies[Math.floor(Math.random() * veggies.length)];
    
    weekMenu.push({
      date,
      dayName: days[i],
      meals: [
        {
          type: 'lunch',
          foods: [lunchProtein, lunchCarb, lunchVeggie]
        },
        {
          type: 'dinner',
          foods: [dinnerProtein, dinnerCarb, dinnerVeggie]
        }
      ]
    });
  }
  
  return weekMenu;
};

export const getShoppingList = (menu: DayMenu[]): Map<string, { food: Food; count: number }> => {
  const shoppingMap = new Map<string, { food: Food; count: number }>();
  
  menu.forEach(day => {
    day.meals.forEach(meal => {
      meal.foods.forEach(food => {
        const existing = shoppingMap.get(food.id);
        if (existing) {
          existing.count += 1;
        } else {
          shoppingMap.set(food.id, { food, count: 1 });
        }
      });
    });
  });
  
  return shoppingMap;
};
