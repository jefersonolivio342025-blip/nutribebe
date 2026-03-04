import { useCallback } from 'react';
import { DayMenu, Food, Meal } from '@/data/menuData';
import { useAlimentosByTipo } from './useAlimentos';

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const pickRandomExcluding = <T extends { id: string }>(arr: T[], excludeIds: Set<string>, attempts = 10): T => {
  if (arr.length === 0) return arr[0]; // safety
  if (arr.length <= excludeIds.size) return pickRandom(arr);
  let item = pickRandom(arr);
  let i = 0;
  while (excludeIds.has(item.id) && i < attempts) {
    item = pickRandom(arr);
    i++;
  }
  return item;
};

// ── Filtering rules ──────────────────────────────────────

// Foods BLOCKED from breakfast/morning snack
const BLOCKED_MORNING = [
  'feijão', 'feijão preto', 'grão-de-bico', 'lentilhas',
  'peixe', 'pescada cozida', 'salmão', 'atum em água', 'camarão',
  'carne bovina', 'carne moída', 'fígado de frango', 'peru desfiado',
  'frango', 'frango desfiado',
  'arroz', 'macarrão', 'massa', 'mandioca', 'inhame', 'polenta', 'cuscuz', 'quinoa',
];

// Foods ALLOWED for morning snack (from proteins)
const MORNING_PROTEINS = ['ovo', 'ovo cozido', 'iogurte natural', 'queijo cottage', 'tofu'];

// Foods ALLOWED for morning snack (from carbs)
const MORNING_CARBS = ['banana', 'aveia', 'pão integral', 'panqueca de banana', 'batata doce', 'batata-doce'];

// Foods BLOCKED from afternoon snack (same heavy items)
const BLOCKED_AFTERNOON = BLOCKED_MORNING;
const AFTERNOON_CARBS = ['banana', 'aveia', 'panqueca de banana'];

const normalize = (s: string) => s.toLowerCase().trim();

const filterByNames = (foods: Food[], allowedNames: string[]): Food[] =>
  foods.filter(f => allowedNames.includes(normalize(f.name)));

const excludeByNames = (foods: Food[], blockedNames: string[]): Food[] =>
  foods.filter(f => !blockedNames.includes(normalize(f.name)));

export const useGenerateMenu = () => {
  const { proteins, carbs, veggies, isLoading } = useAlimentosByTipo();

  const generateWeeklyMenu = useCallback((): DayMenu[] => {
    if (proteins.length === 0 || carbs.length === 0 || veggies.length === 0) {
      return [];
    }

    // Pre-filter food pools per meal type
    const morningProteins = filterByNames(proteins, MORNING_PROTEINS);
    const morningCarbs = filterByNames(carbs, MORNING_CARBS);
    const morningVeggies: Food[] = []; // no veggies at breakfast

    const lunchProteins = proteins; // all allowed
    const lunchCarbs = carbs;
    const lunchVeggies = veggies;

    const afternoonCarbs = filterByNames(carbs, AFTERNOON_CARBS);

    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const today = new Date();
    const dayOfWeek = today.getDay();

    const weekMenu: DayMenu[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOfWeek + i);

      const usedIds = new Set<string>();

      // ── Morning Snack: fruit/cereal + optional light protein ──
      const morningFoods: Food[] = [];
      if (morningCarbs.length > 0) {
        const carb = pickRandomExcluding(morningCarbs, usedIds);
        usedIds.add(carb.id);
        morningFoods.push(carb);
      }
      if (morningProteins.length > 0) {
        const prot = pickRandomExcluding(morningProteins, usedIds);
        usedIds.add(prot.id);
        morningFoods.push(prot);
      }

      // ── Lunch: protein + carb + veggie ──
      const lunchProt = pickRandomExcluding(lunchProteins, usedIds);
      usedIds.add(lunchProt.id);
      const lunchCarb = pickRandomExcluding(lunchCarbs, usedIds);
      usedIds.add(lunchCarb.id);
      const lunchVeg = pickRandomExcluding(lunchVeggies, usedIds);
      usedIds.add(lunchVeg.id);

      // ── Afternoon Snack: light fruit/cereal ──
      const afternoonFoods: Food[] = [];
      if (afternoonCarbs.length > 0) {
        const carb = pickRandomExcluding(afternoonCarbs, usedIds);
        usedIds.add(carb.id);
        afternoonFoods.push(carb);
      }

      // ── Dinner: protein + carb + veggie (different from lunch) ──
      const dinnerProt = pickRandomExcluding(lunchProteins, usedIds);
      usedIds.add(dinnerProt.id);
      const dinnerCarb = pickRandomExcluding(lunchCarbs, usedIds);
      usedIds.add(dinnerCarb.id);
      const dinnerVeg = pickRandomExcluding(lunchVeggies, usedIds);
      usedIds.add(dinnerVeg.id);

      weekMenu.push({
        date,
        dayName: days[i],
        meals: [
          { type: 'morning_snack', foods: morningFoods },
          { type: 'lunch', foods: [lunchProt, lunchCarb, lunchVeg] },
          { type: 'afternoon_snack', foods: afternoonFoods },
          { type: 'dinner', foods: [dinnerProt, dinnerCarb, dinnerVeg] },
        ],
      });
    }

    return weekMenu;
  }, [proteins, carbs, veggies]);

  return { generateWeeklyMenu, isLoading };
};
