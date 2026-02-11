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

  const [openMeals, setOpenMeals] = useState<{ [key: string]: boolean }>({});

  const toggleMeal = (meal: string) => {
    setOpenMeals((prev) => ({ ...prev, [meal]: !prev[meal] }));
  };

  const manualRecipes = {
    manha: {
      nome: "Papinha de Abacate com Banana",
      ingredientes: "1/2 abacate, 1 banana prata",
      preparo: "Amasse bem a banana e o abacate separadamente. Misture os dois até formar uma pasta homogênea.",
    },
    tarde: {
      nome: "Muffin de Maçã e Aveia",
      ingredientes: "1 maçã ralada, 1 ovo, 3 col. aveia",
      preparo: "Misture os ingredientes, coloque em forminhas e leve ao forno (180°C) por 20 minutos.",
    },
    jantar: {
      nome: "Sopa de Mandioquinha com Frango",
      ingredientes: "1 mandioquinha, 30g frango desfiado, 1 colher azeite",
      preparo: "Cozinhe a mandioquinha até amassar, misture o frango cozido e finalize com azeite.",
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

  const MealCard = ({ id, icon: Icon, title, recipe, colorClass }: any) => {
    const isOpen = openMeals[id];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4">
        <button onClick={() => toggleMeal(id)} className="w-full p-5 flex items-center justify-between text-left">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10`}>
              <Icon size={22} className={colorClass.replace("bg-", "text-")} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">{title}</p>
              <h4 className="font-bold text-slate-800 text-base leading-tight">{recipe.nome}</h4>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp size={20} className="text-slate-300" />
          ) : (
            <ChevronDown size={20} className="text-slate-300" />
          )}
        </button>

        {isOpen && (
          <div className="px-5 pb-5 animate-in fade-in duration-300">
            <div className="pt-2 space-y-4">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Ingredientes</p>
                <p className="text-sm text-slate-600 leading-relaxed">{recipe.ingredientes}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  Modo de Preparo
                </p>
                <p className="text-sm text-slate-600 leading-relaxed italic">{recipe.preparo}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    const todayMenu = getTodayMenu();
    switch (activeTab) {
      case "today":
        return (
          <div className="pb-10">
            {/* 1. LANCHE DA MANHÃ NO TOPO (Fora do Dashboard) */}
            <div className="px-4 pt-6">
              <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4 ml-2">
                Primeira Refeição
              </h3>
              <MealCard
                id="manha"
                icon={Coffee}
                title="Lanche da Manhã"
                recipe={manualRecipes.manha}
                colorClass="bg-orange-500"
              />
            </div>

            {/* 2. DASHBOARD (ALMOÇO) */}
            <TodayDashboard
              todayMenu={todayMenu}
              onGenerate={handleGenerate}
              isLocked={false}
              isLoadingAlimentos={isLoadingAlimentos}
            />

            {/* 3. LANCHE DA TARDE E JANTAR ABAIXO */}
            <div className="px-4 -mt-4">
              <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4 ml-2">
                Próximas Refeições
              </h3>
              <MealCard
                id="tarde"
                icon={Apple}
                title="Lanche da Tarde"
                recipe={manualRecipes.tarde}
                colorClass="bg-orange-500"
              />
              <MealCard
                id="jantar"
                icon={Moon}
                title="Jantar Especial"
                recipe={manualRecipes.jantar}
                colorClass="bg-blue-600"
              />
            </div>
          </div>
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
    <div className="min-h-screen bg-[#FDFCFB]">
      <div className="pb-24">{renderContent()}</div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
