import { useState, useEffect } from "react";
import BottomNav, { NavTab } from "@/components/BottomNav";
import TodayDashboard from "@/components/TodayDashboard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import ShoppingList from "@/components/ShoppingList";
import NutritionistsPage from "@/components/NutritionistsPage";
import PlateBuilder from "@/components/PlateBuilder";
import RotinaSemCaos from "@/components/RotinaSemCaos";
import { DayMenu } from "@/data/menuData";
import { useGenerateMenu } from "@/hooks/useGenerateMenu";
import { Search, CheckCircle2, XCircle, AlertCircle, ClipboardCheck, X, Heart } from "lucide-react";
import VideoLibrary from "@/components/VideoLibrary";
import { EncyclopediaProvider } from "@/hooks/useEncyclopedia";
import GlobalFoodSearch from "@/components/GlobalFoodSearch";

// --- COMPONENTE DO DIÁRIO DE REAÇÕES ---
const ReactionTracker = () => {
  const [reaction, setReaction] = useState<string | null>(null);
  const reactions = [
    { id: "loved", emoji: "😋", label: "Amou" },
    { id: "ok", emoji: "😐", label: "Aceitou" },
    { id: "disliked", emoji: "🤢", label: "Recusou" },
    { id: "allergy", emoji: "🔴", label: "Reação" },
  ];

  return (
    <div className="mx-4 mt-6 p-5 bg-white rounded-[32px] border border-gray-100 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="text-pink-500 fill-pink-500" size={18} />
        <h3 className="font-bold text-gray-800 text-sm">Como foi a refeição de hoje?</h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {reactions.map((r) => (
          <button
            key={r.id}
            onClick={() => setReaction(r.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
              reaction === r.id ? "bg-orange-50 border-orange-200 scale-105" : "bg-gray-50 border-transparent"
            } border`}
          >
            <span className="text-2xl">{r.emoji}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{r.label}</span>
          </button>
        ))}
      </div>
      {reaction === "allergy" && (
        <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
          <p className="text-[11px] text-red-600 leading-tight italic">
            <strong>Atenção:</strong> Se notar manchas, inchaço ou diarreia, suspenda o alimento e consulte o pediatra.
          </p>
        </div>
      )}
    </div>
  );
};

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
        placeholder="Buscar alimentos, vídeos ou dicas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
      />
    </div>
  </div>
);

// --- MODAL DE SINAIS DE PRONTIDÃO ---
const ReadinessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [checks, setChecks] = useState({ s1: false, s2: false, s3: false, s4: false });
  if (!isOpen) return null;
  const allReady = Object.values(checks).every((v) => v);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-[#F97316]" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Pronto para comer?</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { id: "s1", txt: "Senta sem apoio" },
            { id: "s2", txt: "Cabeça firme" },
            { id: "s3", txt: "Leva itens à boca" },
            { id: "s4", txt: "Interesse real" },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checks[item.id as keyof typeof checks]}
                onChange={() => setChecks((prev) => ({ ...prev, [item.id]: !prev[item.id as keyof typeof checks] }))}
                className="w-5 h-5 accent-[#F97316]"
              />
              <span className="text-sm font-semibold text-gray-700">{item.txt}</span>
            </label>
          ))}
        </div>
        <button onClick={onClose} className="mt-6 w-full py-4 bg-[#F97316] text-white rounded-2xl font-bold">
          Fechar
        </button>
      </div>
    </div>
  );
};


const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
  const { generateWeeklyMenu, isLoading: isLoadingAlimentos } = useGenerateMenu();

  // --- LÓGICA DE GERAÇÃO ---
  const handleGenerate = () => {
    const newMenu = generateWeeklyMenu();
    if (newMenu.length > 0) {
      setWeekMenu(newMenu);
      localStorage.setItem("nutriBebe_weekMenu", JSON.stringify(newMenu));
    }
  };

  // --- EFEITO PARA CARREGAR E LIMPAR O CACHE ANTIGO ---
  useEffect(() => {
    const savedMenu = localStorage.getItem("nutriBebe_weekMenu");
    if (savedMenu) {
      const parsed = JSON.parse(savedMenu);

      // Se o cardápio tiver apenas 2 refeições (lunch/dinner), forçamos o novo com as frutas
      if (parsed[0] && parsed[0].meals.length < 4) {
        localStorage.removeItem("nutriBebe_weekMenu");
        handleGenerate();
      } else {
        setWeekMenu(parsed.map((day: any) => ({ ...day, date: new Date(day.date) })));
      }
    } else {
      handleGenerate();
    }
  }, []);

  const handleUpdateDayMenu = (dayIndex: number, updatedDay: DayMenu) => {
    const newMenu = [...weekMenu];
    newMenu[dayIndex] = updatedDay;
    setWeekMenu(newMenu);
    localStorage.setItem("nutriBebe_weekMenu", JSON.stringify(newMenu));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "today":
        return (
          <div className="relative">
            <div className="px-4 pt-4 mb-2">
              <button
                onClick={() => setIsReadinessOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-2xl text-[#F97316] font-bold text-sm"
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={20} />
                  <span>Sinais de Prontidão</span>
                </div>
                <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">Verificar</span>
              </button>
            </div>
            <TodayDashboard
              todayMenu={weekMenu[new Date().getDay()] || weekMenu[0]}
              onGenerate={handleGenerate}
              isLocked={false}
              isLoadingAlimentos={isLoadingAlimentos}
            />
            <ReactionTracker />
          </div>
        );
      case "daily":
        return <PlateBuilder />;
      case "calendar":
        return <WeeklyCalendar weekMenu={weekMenu} isLocked={false} onUpdateMenu={handleUpdateDayMenu} />;
      case "list":
        return <ShoppingList weekMenu={weekMenu} />;
      case "nutris":
        return <NutritionistsPage />;
      case "videos":
        return <VideoLibrary searchQuery={searchQuery} />;
      case "rotina":
        return <RotinaSemCaos />;
      default:
        return null;
    }
  };

  return (
    <EncyclopediaProvider>
      <div className="min-h-screen bg-[#FDFCFB]">
        <GlobalFoodSearch />
        <div className="pb-24">{renderContent()}</div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <ReadinessModal isOpen={isReadinessOpen} onClose={() => setIsReadinessOpen(false)} />
      </div>
    </EncyclopediaProvider>
  );
};

export default Index;
