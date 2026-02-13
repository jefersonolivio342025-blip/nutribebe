import { useState, useEffect } from "react";
import BottomNav, { NavTab } from "@/components/BottomNav";
import TodayDashboard from "@/components/TodayDashboard";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import ShoppingList from "@/components/ShoppingList";
import NutritionistsPage from "@/components/NutritionistsPage";
import DailyMenuScreen from "@/components/DailyMenuScreen";
import { DayMenu } from "@/data/menuData";
import { useGenerateMenu } from "@/hooks/useGenerateMenu";
import { Search, CheckCircle2, XCircle, AlertCircle, ClipboardCheck, X } from "lucide-react";

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

        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Verifique se o seu bebê apresenta todos os sinais de prontidão recomendados pela OMS:
        </p>

        <div className="space-y-3">
          {[
            { id: "s1", txt: "Senta sem apoio (ou com o mínimo)" },
            { id: "s2", txt: "Mantém a cabeça e tronco firmes" },
            { id: "s3", txt: "Leva objetos à boca com as mãos" },
            { id: "s4", txt: "Demonstra interesse pela comida" },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-orange-50/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={checks[item.id as keyof typeof checks]}
                onChange={() => setChecks((prev) => ({ ...prev, [item.id]: !prev[item.id as keyof typeof checks] }))}
                className="w-5 h-5 accent-[#F97316] border-gray-300 rounded"
              />
              <span className="text-sm font-semibold text-gray-700">{item.txt}</span>
            </label>
          ))}
        </div>

        {allReady ? (
          <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 text-center animate-bounce">
            <p className="text-green-700 font-bold text-sm">🎉 Seu bebê está pronto!</p>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="mt-6 w-full py-4 bg-[#F97316] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition-transform"
          >
            Entendido
          </button>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE DE VÍDEOS E CONSULTA DE SEGURANÇA ---
const VideoLibrary = ({ searchQuery }: { searchQuery: string }) => {
  const allVideos = [
    { id: "4oBnVNaN0jU", title: "Cortes Seguros BLW", category: "Segurança" },
    { id: "X6z438GiVVc", title: "Como oferecer Laranja", category: "Cortes" },
    { id: "1TeGyXsZA3U", title: "Introdução Alimentar: Começo", category: "Dicas" },
    { id: "UCIjFewVtGc", title: "Como oferecer Batata", category: "Cortes" },
  ];

  const segurancaAlimentar = [
    { nome: "Mel", msg: "Risco de botulismo. Proibido até 1 ano.", icon: <XCircle className="text-red-500" /> },
    {
      nome: "Açúcar",
      msg: "Não recomendado oferecer antes dos 2 anos.",
      icon: <AlertCircle className="text-amber-500" />,
    },
    {
      nome: "Ovo",
      msg: "Pode desde os 6 meses, sempre bem cozido.",
      icon: <CheckCircle2 className="text-green-500" />,
    },
    {
      nome: "Sal",
      msg: "Evite ao máximo até 1 ano. Use temperos naturais.",
      icon: <AlertCircle className="text-amber-500" />,
    },
    {
      nome: "Leite de Vaca",
      msg: "Risco de sobrecarga renal antes de 1 ano.",
      icon: <XCircle className="text-red-500" />,
    },
    {
      nome: "Suco de Fruta",
      msg: "Prefira a fruta inteira. Suco não é recomendado antes de 1 ano.",
      icon: <AlertCircle className="text-amber-500" />,
    },
  ];

  const filteredVideos = allVideos.filter((v) => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDicas = segurancaAlimentar.filter((item) =>
    item.nome.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-4 bg-[#FDFCFB] pb-24">
      {filteredDicas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Pode ou Não Pode?</h2>
          <div className="space-y-3">
            {filteredDicas.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-800">{item.nome}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Guia em Vídeo</h2>
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

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
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

  const renderContent = () => {
    switch (activeTab) {
      case "today":
        return (
          <div className="relative">
            <div className="px-4 pt-4 mb-2">
              <button
                onClick={() => setIsReadinessOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-2xl text-[#F97316] font-bold text-sm shadow-sm active:bg-orange-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={20} />
                  <span>Sinais de Prontidão</span>
                </div>
                <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase">
                  Verificar
                </span>
              </button>
            </div>
            <TodayDashboard
              todayMenu={weekMenu[new Date().getDay()] || weekMenu[0]}
              onGenerate={handleGenerate}
              isLocked={false}
              isLoadingAlimentos={isLoadingAlimentos}
            />
          </div>
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
      <ReadinessModal isOpen={isReadinessOpen} onClose={() => setIsReadinessOpen(false)} />
    </div>
  );
};

export default Index;
