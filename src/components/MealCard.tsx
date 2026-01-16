import { Sun, Moon } from 'lucide-react';
import { Meal } from '@/data/menuData';
import FoodCard from './FoodCard';

interface MealCardProps {
  meal: Meal;
}

const MealCard = ({ meal }: MealCardProps) => {
  const isLunch = meal.type === 'lunch';

  return (
    <div className="card-elevated mb-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className={isLunch ? 'meal-time-lunch' : 'meal-time-dinner'}>
          {isLunch ? (
            <>
              <Sun size={16} />
              <span>Almoço</span>
            </>
          ) : (
            <>
              <Moon size={16} />
              <span>Jantar</span>
            </>
          )}
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
