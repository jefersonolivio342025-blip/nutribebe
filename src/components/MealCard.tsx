import { Meal, MealType } from '@/data/menuData';
import FoodCard from './FoodCard';

interface MealCardProps {
  meal: Meal;
}

const mealConfig: Record<MealType, { label: string; emoji: string; bg: string; text: string }> = {
  morning_snack: { label: 'Café da Manhã', emoji: '🌅', bg: 'bg-[hsl(40_85%_92%)]', text: 'text-[hsl(30_60%_30%)]' },
  lunch: { label: 'Almoço', emoji: '☀️', bg: 'bg-[hsl(50_85%_90%)]', text: 'text-[hsl(35_60%_28%)]' },
  afternoon_snack: { label: 'Lanche da Tarde', emoji: '🍎', bg: 'bg-[hsl(15_75%_92%)]', text: 'text-[hsl(15_55%_32%)]' },
  dinner: { label: 'Jantar', emoji: '🌙', bg: 'bg-[hsl(260_45%_92%)]', text: 'text-[hsl(260_35%_35%)]' },
};

const MealCard = ({ meal }: MealCardProps) => {
  const config = mealConfig[meal.type];
  // Use the first food's emoji as the dynamic meal icon when available
  const dynamicEmoji = meal.foods[0]?.emoji ?? config.emoji;

  return (
    <div className="bg-card rounded-2xl p-5 mb-4 shadow-sm border border-border/50 animate-slide-up transition-all duration-200 hover:shadow-md active:scale-[0.995]">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl ${config.bg}`}>
          <span>{dynamicEmoji}</span>
        </div>
        <div className="flex-1">
          <p className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
            {config.label}
          </p>
        </div>
      </div>

      <div>
        {meal.foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default MealCard;
