import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import TodayDashboard from "@/components/TodayDashboard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import ShoppingList from "@/components/ShoppingList";
import NutritionistsPage from "@/components/NutritionistsPage";
import { DayMenu } from "@/data/menuData";
import { useGenerateMenu } from "@/hooks/useGenerateMenu";

type NavTab = "today" | "calendar" | "list" | "nutris";

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);

  const { generateWeeklyMenu, isLoading: isLoadingAlimentos } = useGenerateMenu();

  // NOVAS RECEITAS QUE VOCÊ PEDIU (Injetadas manualmente)
  const manualRecipes = {
    manha: {
      nome: "Papinha de Abacate com Banana",
      ingredientes: ["1/2 abacate", "1 banana prata"],
      preparo: "Amasse e misture.",
    },
    tarde: {
      nome: "Muffin de Maçã e Aveia",
      ingredientes: ["1 maçã", "1 ovo", "3 col. aveia"],
      preparo: "Misture e assar 15min.",
    },
    jantar: {
      nome: "Sopa de Mandioquinha com Frango",
      ingredientes: ["1 mandioquinha", "30g frango"],
      preparo: "Cozinhar e amassar.",
    },
  };

  useEffect(() => {
    const savedMenu = localStorage.getItem("nutriBebe_weekMenu");
    if (savedMenu) {
      const parsed = JSON.parse(savedMenu);
      const restored = parsed.map((day: DayMenu) => ({
        ...day,
        date: new Date(day.date),
      }));
      setWeekMenu(restored);
    } else {
      // Se estiver vazio, gera o primeiro menu automaticamente para não ficar em branco
      handleGenerate();
    }
  }, []);

  const handleGenerate = () => {
    const newMenu = generateWeeklyMenu();
    if (newMenu.length > 0) {
      const enhancedMenu = newMenu.map((day: any) => ({
        ...day,
        // Forçamos a substituição nos campos que o componente costuma ler
        breakfast: manualRecipes.manha,
        lunch: {
          nome: "Almoço Nutritivo",
          ingredientes: ["Proteína", "Legumes", "Carboidrato"],
          preparo: "Cozinhe os alimentos de forma segura para o bebê.",
        },
        snack: manualRecipes.tarde,
        dinner: manualRecipes.jantar,
        // Mantemos também em português caso o componente use esses nomes
        lancheManha: manualRecipes.manha,
        lancheTarde: manualRecipes.tarde,
        jantar: manualRecipes.jantar,
      }));
      setWeekMenu(enhancedMenu);
      localStorage.setItem("nutriBebe_weekMenu", JSON.stringify(enhancedMenu));
    }
  };

  const getTodayMenu = (): DayMenu | null => {
    if (weekMenu.length === 0) return null;
    const today = new Date().getDay();
    // Ajuste para evitar erro de índice no array
    return weekMenu[today] || weekMenu[0];
  };

  const renderContent = () => {
    switch (activeTab) {
      case "today":
        return (
          <TodayDashboard
            todayMenu={getTodayMenu()}
            onGenerate={handleGenerate}
            isLocked={false}
            isLoadingAlimentos={isLoadingAlimentos}
          />
        );
      case "calendar":
        return <WeeklyCalendar weekMenu={weekMenu} isLocked={false} />;
      case "list":
        return <ShoppingList weekMenu={weekMenu} />;
      case "nutris":
        return <NutritionistsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20">
        {" "}
        {/* Espaço para a Nav não cobrir o conteúdo */}
        {renderContent()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
