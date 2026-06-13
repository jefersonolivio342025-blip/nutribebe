import { createContext, useContext, useState, ReactNode } from "react";
import FoodEncyclopedia, { EncyclopediaFood } from "@/components/FoodEncyclopedia";

interface Ctx {
  open: (food: EncyclopediaFood) => void;
}

const EncyclopediaContext = createContext<Ctx | null>(null);

export const EncyclopediaProvider = ({ children }: { children: ReactNode }) => {
  const [food, setFood] = useState<EncyclopediaFood | null>(null);

  return (
    <EncyclopediaContext.Provider value={{ open: setFood }}>
      {children}
      <FoodEncyclopedia food={food} onClose={() => setFood(null)} />
    </EncyclopediaContext.Provider>
  );
};

export const useEncyclopedia = () => {
  const ctx = useContext(EncyclopediaContext);
  if (!ctx) throw new Error("useEncyclopedia must be used within EncyclopediaProvider");
  return ctx;
};
