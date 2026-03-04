import { Sun, Moon, Coffee, Apple } from 'lucide-react';
import { Meal, MealType } from '@/data/menuData';
import FoodCard from './FoodCard';

interface MealCardProps {
  meal: Meal;
}

const mealConfig: Record<MealType, { icon: typeof Sun; label: string; emoji: string; className: string }> = {
  morning_snack: { icon: Coffee, label: 'Café da Manhã', emoji: '🌅', className: 'meal-time-lunch' },
  lunch: { icon: Sun, label: 'Almoço', emoji: '☀️', className: 'meal-time-lunch' },
  afternoon_snack: { icon: Apple, label: 'Lanche da Tarde', emoji: '🍎', className: 'meal-time-lunch' },
  dinner: { icon: Moon, label: 'Jantar', emoji: '🌙', className: 'meal-time-dinner' },
};

const MealCard = ({ meal }: MealCardProps) => {
  const config = mealConfig[meal.type];
  const Icon = config.icon;

  return (
    <div className="card-elevated mb-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className={config.className}>
          <Icon size={16} />
          <span>{config.label}</span>
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
