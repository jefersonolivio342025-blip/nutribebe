import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { DayMenu, getShoppingList } from '@/data/menuData';
import { useViewContentTracking } from '@/hooks/useConversionTracking';

interface ShoppingListProps {
  weekMenu: DayMenu[];
}

const ShoppingList = ({ weekMenu }: ShoppingListProps) => {
  useViewContentTracking('Lista de Compras', 'Shopping');
  
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const shoppingList = getShoppingList(weekMenu);
  const sortedItems = Array.from(shoppingList.entries()).sort((a, b) => {
    const groupOrder = { protein: 0, carbs: 1, veggies: 2 };
    return groupOrder[a[1].food.group] - groupOrder[b[1].food.group];
  });

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const groupLabels = {
    protein: { label: 'Proteínas', emoji: '🥩' },
    carbs: { label: 'Carboidratos', emoji: '🍚' },
    veggies: { label: 'Legumes & Verduras', emoji: '🥦' },
  };

  const groupedItems = sortedItems.reduce((acc, [id, { food, count }]) => {
    if (!acc[food.group]) {
      acc[food.group] = [];
    }
    acc[food.group].push({ id, food, count });
    return acc;
  }, {} as Record<string, { id: string; food: typeof sortedItems[0][1]['food']; count: number }[]>);

  const completedCount = checkedItems.size;
  const totalCount = sortedItems.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          Lista de Compras 🛒
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ingredientes para a semana toda
        </p>
      </header>

      {sortedItems.length > 0 ? (
        <>
          {/* Progress Bar */}
          <div className="card-elevated mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <span className="font-semibold text-foreground">Progresso</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {completedCount} de {totalCount} itens
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Grouped Items */}
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="mb-6">
              <h2 className="section-title flex items-center gap-2">
                <span>{groupLabels[group as keyof typeof groupLabels].emoji}</span>
                <span>{groupLabels[group as keyof typeof groupLabels].label}</span>
              </h2>
              <div className="space-y-2">
                {items.map(({ id, food, count }) => {
                  const isChecked = checkedItems.has(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleItem(id)}
                      className={`ingredient-item w-full transition-all duration-200 ${
                        isChecked ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                            isChecked
                              ? 'bg-primary border-primary'
                              : 'border-border'
                          }`}
                        >
                          {isChecked && (
                            <Check size={14} className="text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-xl">{food.emoji}</span>
                        <span
                          className={`font-medium ${
                            isChecked
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {food.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {count}x
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="card-elevated text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Lista vazia
          </h3>
          <p className="text-muted-foreground">
            Gere um cardápio para ver a lista de compras
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
