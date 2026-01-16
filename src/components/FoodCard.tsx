import { useState } from 'react';
import { ChevronDown, Baby, Scissors, ChefHat } from 'lucide-react';
import { Food } from '@/data/menuData';

interface FoodCardProps {
  food: Food;
}

const FoodCard = ({ food }: FoodCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const groupStyles = {
    protein: 'food-tag-protein',
    carbs: 'food-tag-carbs',
    veggies: 'food-tag-veggies',
  };

  const groupLabels = {
    protein: 'Proteína',
    carbs: 'Carboidrato',
    veggies: 'Legumes',
  };

  return (
    <div className="card-soft mb-3 animate-fade-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{food.emoji}</span>
          <div className="text-left">
            <p className="font-semibold text-foreground">{food.name}</p>
            <span className={groupStyles[food.group]}>
              {groupLabels[food.group]}
            </span>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-muted-foreground transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`expandable-card ${
          isExpanded ? 'max-h-96 mt-4 pt-4 border-t border-border' : 'max-h-0'
        }`}
      >
        {isExpanded && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sage-light/50">
                <ChefHat size={18} className="text-sage-dark" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground mb-1">
                  Como preparar
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {food.prepGuide}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-terracotta-light/50">
                <Scissors size={18} className="text-terracotta" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground mb-2">
                  Corte seguro por idade
                </p>
                <div className="space-y-2">
                  {Object.entries(food.cutGuide).map(([age, guide]) => (
                    <div
                      key={age}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div className="flex items-center gap-1 min-w-[70px]">
                        <Baby size={14} className="text-primary" />
                        <span className="font-medium text-primary">
                          {age === '12+' ? '12+ meses' : `${age} meses`}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{guide}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
