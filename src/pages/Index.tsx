import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import TodayDashboard from "@/components/TodayDashboard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import ShoppingList from "@/components/ShoppingList";
import NutritionistsPage from "@/components/NutritionistsPage";
import { DayMenu } from "@/data/menuData";
import { useGenerateMenu } from "@/hooks/useGenerateMenu";
import { Coffee, Apple, Moon } from "lucide-react"; // Ícones para os lanches

type NavTab = "today" | "calendar" | "list" | "nutris";

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const { generateWeeklyMenu, isLoading: isLoadingAlimentos } = useGenerateMenu();

  const manualRecipes = {
    manha: {
      nome: "Papinha de Abacate com Banana",
      ingredientes: "1/2 abacate, 1 banana prata",
      preparo: "Amasse e misture.",
    },
    tarde: {
      nome: "Muffin de Maçã e Aveia",
      ingredientes: "1 maçã, 1 ovo, 3 col. aveia",
      preparo: "Misture e assar 15min.",
    },
    jantar: {
      nome: "Sopa de Mandioquinha com Frango",
      ingredientes: "1 mandioquinha, 30g frango",
      preparo: "Cozinhar e amassar.",
    },
  };

  useEffect(() => {
    const savedMenu = localStorage.getItem("nutriBebe_weekMenu");
    if (savedMenu) {
      const parsed = JSON.parse(savedMenu);
      setWeekMenu(parsed.map((day: any) => ({ ...day, date: new Date(day.date) })));
    } else {
      handleGenerate();
    }
  }, []);

  const handleGenerate = () => {
    const newMenu = generateWeeklyMenu();
    if (newMenu.length > 0) {
      setWeekMenu(newMenu);
      localStorage.setItem("nutriBebe_weekMenu", JSON.stringify(newMenu));
    }
  };

  const getTodayMenu = () => weekMenu[new Date().getDay()] || weekMenu[0] || null;

  // COMPONENTE EXTRA PARA MOSTRAR OS LANCHES QUE ESTÃO SUMIDOS
  const ExtraMeals = () => (
    <div className="px-4 pb-6 space-y-4 -mt-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
        <div className="flex items-center gap-2 mb-2 text-orange-500 font-bold text-sm">
          <Coffee size={18} /> LANCHE DA MANHÃ
        </div>
        <h4 className="font-bold text-slate-800">{manualRecipes.manha.nome}</h4>
        <p className="text-xs text-slate-500 mt-1 italic">{manualRecipes.manha.preparo}</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
        <div className="flex items-center gap-2 mb-2 text-orange-500 font-bold text-sm">
          <Apple size={18} /> LANCHE DA TARDE
        </div>
        <h4 className="font-bold text-slate-800">{manualRecipes.tarde.nome}</h4>
        <p className="text-xs text-slate-500 mt-1 italic">{manualRecipes.tarde.preparo}</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
        <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold text-sm">
          <Moon size={18} /> JANTAR ESPECIAL
        </div>
        <h4 className="font-bold text-slate-800">{manualRecipes.jantar.nome}</h4>
        <p className="text-xs text-slate-500 mt-1 italic">{manualRecipes.jantar.preparo}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "today":
        return (
          <>
            <TodayDashboard
              todayMenu={getTodayMenu()}
              onGenerate={handleGenerate}
              isLocked={false}
              isLoadingAlimentos={isLoadingAlimentos}
            />
            <ExtraMeals />
          </>
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
    <div className="min-h-screen bg-slate-50">
      <div className="pb-24">{renderContent()}</div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
