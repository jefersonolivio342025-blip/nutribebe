import { Food } from '@/data/menuData';
import { ChevronRight } from 'lucide-react';
import { useEncyclopedia } from '@/hooks/useEncyclopedia';
import { getFoodImage } from '@/lib/foodImages';

interface FoodCardProps {
  food: Food;
}

const groupStyles: Record<string, string> = {
  protein: 'food-tag-protein',
  carbs: 'food-tag-carbs',
  veggies: 'food-tag-veggies',
  fruit: 'food-tag-carbs',
};

const groupLabels: Record<string, string> = {
  protein: 'Proteína',
  carbs: 'Carboidrato',
  veggies: 'Legumes',
  fruit: 'Fruta',
};

const groupToTipo: Record<string, string> = {
  protein: 'proteina',
  carbs: 'carboidrato',
  veggies: 'vegetal',
  fruit: 'fruit',
};

const FoodCard = ({ food }: FoodCardProps) => {
  const { open } = useEncyclopedia();
  const img = getFoodImage(food.name);

  const handleClick = () => {
    open({
      nome: food.name,
      emoji: food.emoji,
      tipo: groupToTipo[food.group] || 'vegetal',
      preparo: food.prepGuide,
      corte_6_9m: food.cutGuide['6-9'],
      corte_9_12m: food.cutGuide['9-12'],
      corte_12_mais: food.cutGuide['12+'],
    });
  };

  return (
    <button
      onClick={handleClick}
      className="w-full card-soft mb-3 flex items-center justify-between gap-3 text-left transition-all duration-200 active:scale-[0.99] hover:shadow-md"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
          {img ? (
            <img
              src={img}
              alt={food.name}
              width={96}
              height={96}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">{food.emoji}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{food.name}</p>
          <span className={groupStyles[food.group]}>{groupLabels[food.group]}</span>
        </div>
      </div>
      <ChevronRight size={18} className="text-muted-foreground shrink-0" />
    </button>
  );
};

export default FoodCard;
