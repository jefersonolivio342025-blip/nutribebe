export interface Food {
  id: string;
  name: string;
  emoji: string;
  group: "protein" | "carbs" | "veggies" | "fruit"; // Adicionado 'fruit'
  prepGuide: string;
  cutGuide: {
    "6-9": string;
    "9-12": string;
    "12+": string;
  };
}

export type MealType = "morning_snack" | "lunch" | "afternoon_snack" | "dinner";

export interface Meal {
  type: MealType;
  foods: Food[];
}

export interface DayMenu {
  date: Date;
  dayName: string;
  meals: Meal[];
}

// --- LISTA DE FRUTAS PARA O CAFÉ/LANCHES ---
export const fruits: Food[] = [
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    group: "fruit",
    prepGuide: "Escolha bananas maduras. Pode oferecer in natura ou com aveia.",
    cutGuide: {
      "6-9": "Inteira descascada ou cortada ao meio no comprimento",
      "9-12": "Rodelas ou pedaços pequenos",
      "12+": "Pedaços ou inteira",
    },
  },
  {
    id: "mamao",
    name: "Mamão",
    emoji: "🥣",
    group: "fruit",
    prepGuide: "Retire todas as sementes. O mamão ajuda muito no intestino.",
    cutGuide: { "6-9": "Fatias largas (formato de canoa)", "9-12": "Cubos pequenos", "12+": "Cubos ou pedaços" },
  },
  {
    id: "abacate",
    name: "Abacate",
    emoji: "🥑",
    group: "fruit",
    prepGuide: "Ofereça bem maduro. É uma excelente fonte de gorduras boas.",
    cutGuide: { "6-9": "Fatias grandes e macias", "9-12": "Cubos pequenos ou amassado", "12+": "Pedaços variados" },
  },
  {
    id: "maca",
    name: "Maçã Cozida",
    emoji: "🍎",
    group: "fruit",
    prepGuide: "Cozinhe ou asse até ficar macia. Nunca sirva crua e dura para bebês pequenos.",
    cutGuide: {
      "6-9": "Fatias grandes cozidas sem casca",
      "9-12": "Pedaços pequenos cozidos",
      "12+": "Ralada ou cozida",
    },
  },
];

export const proteins: Food[] = [
  {
    id: "frango",
    name: "Frango",
    emoji: "🍗",
    group: "protein",
    prepGuide: "Cozinhe bem. Desfie ou corte em tiras.",
    cutGuide: { "6-9": "Tiras do tamanho do dedo", "9-12": "Pedaços menores", "12+": "Cubos pequenos" },
  },
  {
    id: "carne",
    name: "Carne Bovina",
    emoji: "🥩",
    group: "protein",
    prepGuide: "Cozinhe até ficar macia.",
    cutGuide: { "6-9": "Tiras longas e finas", "9-12": "Pedaços pequenos", "12+": "Carne moída" },
  },
  {
    id: "ovo",
    name: "Ovo",
    emoji: "🥚",
    group: "protein",
    prepGuide: "Cozinhe até a gema ficar firme.",
    cutGuide: { "6-9": "Omelete em tiras", "9-12": "Pedaços de ovo cozido", "12+": "Ovo mexido" },
  },
  {
    id: "feijao",
    name: "Feijão",
    emoji: "🫘",
    group: "protein",
    prepGuide: "Cozinhe até ficar bem macio.",
    cutGuide: { "6-9": "Amassado", "9-12": "Levemente amassado", "12+": "Grãos inteiros" },
  },
];

export const carbs: Food[] = [
  {
    id: "arroz",
    name: "Arroz",
    emoji: "🍚",
    group: "carbs",
    prepGuide: "Cozinhe até ficar macio.",
    cutGuide: { "6-9": "Amassado", "9-12": "Cozido normalmente", "12+": "Cozido normalmente" },
  },
  {
    id: "batata",
    name: "Batata",
    emoji: "🥔",
    group: "carbs",
    prepGuide: "Cozinhe até ficar macia.",
    cutGuide: { "6-9": "Palitos grossos", "9-12": "Cubos pequenos", "12+": "Pedaços maiores" },
  },
];

export const veggies: Food[] = [
  {
    id: "brocolis",
    name: "Brócolis",
    emoji: "🥦",
    group: "veggies",
    prepGuide: "Vapor até ficar macio.",
    cutGuide: { "6-9": "Floretes com cabo longo", "9-12": "Floretes menores", "12+": "Picado" },
  },
  {
    id: "cenoura",
    name: "Cenoura",
    emoji: "🥕",
    group: "veggies",
    prepGuide: "Cozinhe até ficar bem macia.",
    cutGuide: { "6-9": "Palitos grossos cozidos", "9-12": "Rodelas ou cubos", "12+": "Ralada" },
  },
];

export const allFoods = [...proteins, ...carbs, ...veggies, ...fruits];

export const generateWeeklyMenu = (): DayMenu[] => {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekMenu: DayMenu[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + i);

    // Sorteio das refeições
    const mSnackFruit = fruits[Math.floor(Math.random() * fruits.length)];
    const aSnackFruit = fruits[Math.floor(Math.random() * fruits.length)];

    const lunchProtein = proteins[Math.floor(Math.random() * proteins.length)];
    const lunchCarb = carbs[Math.floor(Math.random() * carbs.length)];
    const lunchVeggie = veggies[Math.floor(Math.random() * veggies.length)];

    const dinnerProtein = proteins[Math.floor(Math.random() * proteins.length)];
    const dinnerCarb = carbs[Math.floor(Math.random() * carbs.length)];
    const dinnerVeggie = veggies[Math.floor(Math.random() * veggies.length)];

    weekMenu.push({
      date,
      dayName: days[i],
      meals: [
        { type: "morning_snack", foods: [mSnackFruit] }, // Café da Manhã (Fruta)
        { type: "lunch", foods: [lunchProtein, lunchCarb, lunchVeggie] },
        { type: "afternoon_snack", foods: [aSnackFruit] }, // Lanche da Tarde (Fruta)
        { type: "dinner", foods: [dinnerProtein, dinnerCarb, dinnerVeggie] },
      ],
    });
  }
  return weekMenu;
};

export const getShoppingList = (menu: DayMenu[]): Map<string, { food: Food; count: number }> => {
  const shoppingMap = new Map<string, { food: Food; count: number }>();
  menu.forEach((day) => {
    day.meals.forEach((meal) => {
      meal.foods.forEach((food) => {
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
