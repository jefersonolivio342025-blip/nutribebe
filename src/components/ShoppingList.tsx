import { useState } from "react";
import { Check, ShoppingBag, FileDown, Share2, Plus, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { DayMenu, getShoppingList } from "@/data/menuData";
import { useViewContentTracking, useConversionTracking } from "@/hooks/useConversionTracking";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShoppingListProps {
  weekMenu: DayMenu[];
}

// Interface para itens que a mãe adiciona manualmente
interface CustomItem {
  id: string;
  name: string;
  checked: boolean;
}

const ShoppingList = ({ weekMenu }: ShoppingListProps) => {
  useViewContentTracking("Lista de Compras", "Shopping");
  const { handlePaywallClick } = useConversionTracking();
  const { isPremium } = useAuth();

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

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

  // Funções para itens manuais
  const addCustomItem = () => {
    if (!newItemName.trim()) return;
    const newItem: CustomItem = {
      id: `custom-${Date.now()}`,
      name: newItemName,
      checked: false,
    };
    setCustomItems([...customItems, newItem]);
    setNewItemName("");
    toast.success("Item adicionado à lista!");
  };

  const toggleCustomItem = (id: string) => {
    setCustomItems(customItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const removeCustomItem = (id: string) => {
    setCustomItems(customItems.filter((item) => item.id !== id));
  };

  const groupLabels = {
    protein: { label: "Proteínas", emoji: "🥩" },
    carbs: { label: "Carboidratos", emoji: "🍚" },
    veggies: { label: "Legumes & Verduras", emoji: "🥦" },
  };

  const groupedItems = sortedItems.reduce(
    (acc, [id, { food, count }]) => {
      if (!acc[food.group]) {
        acc[food.group] = [];
      }
      acc[food.group].push({ id, food, count });
      return acc;
    },
    {} as Record<string, { id: string; food: (typeof sortedItems)[0][1]["food"]; count: number }[]>,
  );

  const completedCount = checkedItems.size + customItems.filter((i) => i.checked).length;
  const totalCount = sortedItems.length + customItems.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="page-container">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Lista de Compras 🛒</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize tudo o que o bebê precisa</p>
          </div>
        </div>
      </header>

      {/* INPUT PARA ADICIONAR ITENS MANUAIS */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Adicionar item (ex: Fraldas, Leite...)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
          className="flex-1 bg-white border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <Button onClick={addCustomItem} size="icon" className="rounded-xl">
          <Plus size={20} />
        </Button>
      </div>

      {totalCount > 0 ? (
        <>
          {/* Progress Bar */}
          <div className="card-elevated mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <span className="font-semibold text-foreground">Progresso Total</span>
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

          {/* ITENS PERSONALIZADOS DA MÃE */}
          {customItems.length > 0 && (
            <div className="mb-6">
              <h2 className="section-title flex items-center gap-2">
                <span>📝</span>
                <span>Itens Extras</span>
              </h2>
              <div className="space-y-2">
                {customItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCustomItem(item.id)}
                      className={`ingredient-item flex-1 transition-all duration-200 ${item.checked ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${item.checked ? "bg-primary border-primary" : "border-border"}`}
                        >
                          {item.checked && <Check size={14} className="text-primary-foreground" />}
                        </div>
                        <span
                          className={`font-medium ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomItem(item.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grouped Items (Automáticos do Cardápio) */}
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
                      className={`ingredient-item w-full transition-all duration-200 ${isChecked ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${isChecked ? "bg-primary border-primary" : "border-border"}`}
                        >
                          {isChecked && <Check size={14} className="text-primary-foreground" />}
                        </div>
                        <span className="text-xl">{food.emoji}</span>
                        <span
                          className={`font-medium ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}
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
          <h3 className="text-lg font-bold text-foreground mb-2">Lista vazia</h3>
          <p className="text-muted-foreground">Adicione itens acima ou gere um cardápio semanal.</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
