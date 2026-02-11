import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import TodayDashboard from "@/components/TodayDashboard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import ShoppingList from "@/components/ShoppingList";
import NutritionistsPage from "@/components/NutritionistsPage";
import { DayMenu } from "@/data/menuData";
import { useGenerateMenu } from "@/hooks/useGenerateMenu";
import { Coffee, Apple, Moon, ChevronDown, ChevronUp } from "lucide-react";

type NavTab = "today" | "calendar" | "list" | "nutris";

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const { generateWeeklyMenu, isLoading: isLoadingAlimentos } = useGenerateMenu();

  // Estado para controlar quais abas de lanche estão abertas
  const [openMeals, setOpenMeals] = useState<{ [key: string]: boolean }>({});

  const toggleMeal = (meal: string) => {
    setOpenMeals((prev) => ({ ...prev, [meal]: !prev[meal] }));
  };

  const manualRecipes = {
    manha: {
      nome: "Papinha de Abacate com Banana",
      ingredientes: ["1/2 abacate", "1 banana prata"],
      preparo:
        "Amasse bem a banana e o abacate separadamente. Misture os dois até formar uma pasta homogênea. Sirva imediatamente.",
    },
    tarde: {
      nome: "Muffin de Maçã e Aveia",
      ingredientes: ["1 maçã ralada", "1 ovo", "3 col. aveia"],
      preparo:
        "Misture todos os ingredientes em um bowl. Coloque em forminhas de silicone e leve ao forno (180°C) por 15 a 20 minutos.",
    },
    jantar: {
      nome: "Sopa de Mandioquinha com Frango",
      ingredientes: ["1 mandioquinha", "30g frango desfiado", "1 colher azeite"],
      preparo:
        "Cozinhe a mandioquinha até ficar macia e amasse. Misture o frango desfiado já cozido e finalize com o azeite.",
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

  // Componente de Card Expansível Reutilizável
  const ExpandableMealCard = ({ id, icon: Icon, title, recipe, colorClass, borderClass }: any) => {
    const isOpen = openMeals[id];
    return (
      <div className={`bg-white rounded-2xl shadow-sm border ${borderClass} overflow-hidden transition-all`}>
        <button onClick={() => toggleMeal(id)} className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
              <Icon size={20} className={colorClass.replace("bg-", "text-")} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-wider ${colorClass.replace("bg-", "text-")}`}>
                {title}
              </p>
              <h4 className="font-bold text-slate-800">{recipe.nome}</h4>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp size={18} className="text-slate-400" />
          ) : (
            <ChevronDown size={18} className="text-slate-400" />
          )}
        </button>

        {isOpen && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="h-px bg-slate-100 mb-4" />
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ingredientes</p>
                <p className="text-sm text-slate-600">
                  {Array.isArray(recipe.ingredientes) ? recipe.ingredientes.join(", ") : recipe.ingredientes}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Modo de Preparo</p>
                <p className="text-sm text-slate-600 italic leading-relaxed">{recipe.preparo}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ExtraMeals = () => (
    <div className="px-4 pb-10 space-y-4 -mt-4">
      <ExpandableMealCard
        id="manha"
        icon={Coffee}
        title="Lanche da Manhã"
        recipe={manualRecipes.manha}
        colorClass="bg-orange-500"
        borderClass="border-orange-100"
      />
      <ExpandableMealCard
        id="tarde"
        icon={Apple}
        title="Lanche da Tarde"
        recipe={manualRecipes.tarde}
        colorClass="bg-orange-500"
        borderClass="border-orange-100"
      />
      <ExpandableMealCard
        id="jantar"
        icon={Moon}
        title="Jantar Especial"
        recipe={manualRecipes.jantar}
        colorClass="bg-blue-500"
        borderClass="border-blue-100"
      />
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
