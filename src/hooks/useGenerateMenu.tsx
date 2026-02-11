import { useCallback } from 'react';
import { DayMenu, Food } from '@/data/menuData';
import { useAlimentosByTipo } from './useAlimentos';

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const pickRandomExcluding = <T extends { id: string }>(arr: T[], excludeIds: Set<string>, attempts = 10): T => {
  if (arr.length <= excludeIds.size) return pickRandom(arr);
  let item = pickRandom(arr);
  let i = 0;
  while (excludeIds.has(item.id) && i < attempts) {
    item = pickRandom(arr);
    i++;
  }
  return item;
};

export const useGenerateMenu = () => {
  const { proteins, carbs, veggies, isLoading } = useAlimentosByTipo();

  const generateWeeklyMenu = useCallback((): DayMenu[] => {
    if (proteins.length === 0 || carbs.length === 0 || veggies.length === 0) {
      return [];
    }

    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const today = new Date();
    const dayOfWeek = today.getDay();

    const weekMenu: DayMenu[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOfWeek + i);

      const usedProteins = new Set<string>();
      const usedCarbs = new Set<string>();
      const usedVeggies = new Set<string>();

      const makeMeal = (type: 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner') => {
        const protein = pickRandomExcluding(proteins, usedProteins);
        usedProteins.add(protein.id);
        const carb = pickRandomExcluding(carbs, usedCarbs);
        usedCarbs.add(carb.id);
        const veggie = pickRandomExcluding(veggies, usedVeggies);
        usedVeggies.add(veggie.id);
        return { type, foods: [protein, carb, veggie] };
      };

      weekMenu.push({
        date,
        dayName: days[i],
        meals: [
          makeMeal('morning_snack'),
          makeMeal('lunch'),
          makeMeal('afternoon_snack'),
          makeMeal('dinner'),
        ],
      });
    }

    return weekMenu;
  }, [proteins, carbs, veggies]);

  return { generateWeeklyMenu, isLoading };
};
