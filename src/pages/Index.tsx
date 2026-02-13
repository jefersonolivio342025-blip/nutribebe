import { useState, useEffect } from "react";
import BottomNav, { NavTab } from "@/components/BottomNav";
import TodayDashboard from "@/components/TodayDashboard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import ShoppingList from "@/components/ShoppingList";
import NutritionistsPage from "@/components/NutritionistsPage";
import DailyMenuScreen from "@/components/DailyMenuScreen";
import { DayMenu } from "@/data/menuData";
import { useGenerateMenu } from "@/hooks/useGenerateMenu";
import { Search } from "lucide-react"; // Importando ícone de busca

// --- COMPONENTE DE BUSCA ---
const SearchBar = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="px-4 pt-6 pb-2">
    <div className="relative group">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F97316] transition-colors"
        size={20}
      />
      <input
        type="text"
        placeholder="Buscar vídeos ou dicas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
      />
    </div>
  </div>
);

// --- COMPONENTE DE VÍDEOS INTERNO (AJUSTADO PARA FILTRO) ---
const VideoLibrary = ({ searchQuery }: { searchQuery: string }) => {
  const allVideos = [
    { id: "4oBnVNaN0jU", title: "Cortes Seguros BLW", category: "Segurança" },
    { id: "X6z438GiVVc", title: "Como oferecer Laranja", category: "Cortes" },
    { id: "1TeGyXsZA3U", title: "Introdução Alimentar: Começo", category: "Dicas" },
    { id: "UCIjFewVtGc", title: "Como oferecer Batata", category: "Cortes" },
  ];

  // Lógica de filtro
  const filteredVideos = allVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-4 bg-[#FDFCFB] pb-24">
      <h2 className="text-2xl font-bold text-[#F97316] mb-6 px-1">Guia em Vídeo</h2>

      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-transform active:scale-[0.98]"
            >
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
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">Nenhum vídeo encontrado para "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Estado da busca
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
      case "videos":
        return (
          <>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <VideoLibrary searchQuery={searchQuery} />
          </>
        );
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
