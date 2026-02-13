import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import TodayDashboard from "@/components/TodayDashboard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import ShoppingList from "@/components/ShoppingList";
import NutritionistsPage from "@/components/NutritionistsPage";
import DailyMenuScreen from "@/components/DailyMenuScreen";
import { DayMenu } from "@/data/menuData";
import { useGenerateMenu } from "@/hooks/useGenerateMenu";

// --- COMPONENTE DE VÍDEOS ADICIONADO AQUI ---
const VideoLibrary = () => {
  const videos = [
    { id: "4oBnVNaN0jU", title: "Cortes Seguros BLW", category: "Segurança" },
    { id: "X6z438GiVVc", title: "Como oferecer Laranja", category: "Cortes" },
    { id: "1TeGyXsZA3U", title: "Introdução Alimentar: Começo", category: "Dicas" },
    { id: "UCIjFewVtGc", title: "Como oferecer Batata", category: "Cortes" },
  ];

  return (
    <div className="p-4 bg-[#FDFCFB] pb-24">
      <h2 className="text-2xl font-bold text-[#F97316] mb-6">Guia em Vídeo</h2>
      <div className="grid grid-cols-1 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider">{video.category}</span>
              <h3 className="text-lg font-medium text-gray-800 mt-1">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Atualizado o tipo NavTab para incluir "videos"
type NavTab = "today" | "daily" | "calendar" | "list" | "nutris" | "videos";

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const { generateWeeklyMenu, isLoading: isLoadingAlimentos } = useGenerateMenu();

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
      case "daily":
        return <DailyMenuScreen />;
      case "calendar":
        return <WeeklyCalendar weekMenu={weekMenu} isLocked={false} />;
      case "list":
        return <ShoppingList weekMenu={weekMenu} />;
      case "nutris":
        return <NutritionistsPage />;
      case "videos": // Nova aba adicionada ao render
        return <VideoLibrary />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <div className="pb-24">{renderContent()}</div>
      {/* Certifique-se de que o componente BottomNav aceite a nova aba "videos" */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
