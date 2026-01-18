import { useCallback } from 'react';
import { DayMenu, Food } from '@/data/menuData';
import { useAlimentosByTipo } from './useAlimentos';

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
    const usedProteinsToday: Set<string> = new Set();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOfWeek + i);

      usedProteinsToday.clear();

      const lunchProtein = proteins[Math.floor(Math.random() * proteins.length)];
      usedProteinsToday.add(lunchProtein.id);

      let dinnerProtein = proteins[Math.floor(Math.random() * proteins.length)];
      let attempts = 0;
      while (usedProteinsToday.has(dinnerProtein.id) && proteins.length > 1 && attempts < 10) {
        dinnerProtein = proteins[Math.floor(Math.random() * proteins.length)];
        attempts++;
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
            foods: [lunchProtein, lunchCarb, lunchVeggie],
          },
          {
            type: 'dinner',
            foods: [dinnerProtein, dinnerCarb, dinnerVeggie],
          },
        ],
      });
    }

    return weekMenu;
  }, [proteins, carbs, veggies]);

  return { generateWeeklyMenu, isLoading };
};
