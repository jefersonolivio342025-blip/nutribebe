import { useState, useMemo } from "react";
import { Beef, Wheat, Leaf, Bean, Sparkles } from "lucide-react";
import { useAlimentos } from "@/hooks/useAlimentos";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { getFoodImage } from "@/lib/foodImages";

const LEGUMINOSAS = ["Feijão", "Feijão preto", "Grão-de-bico", "Lentilhas", "Ervilhas"];

const emojiMap: Record<string, string> = {
  "Frango": "🍗", "Frango desfiado": "🍗", "Carne Bovina": "🥩", "Carne moída": "🥩",
  "Peixe": "🐟", "Pescada cozida": "🐟", "Salmão": "🐟", "Atum em água": "🐟",
  "Camarão": "🦐", "Ovo": "🥚", "Ovo cozido": "🥚", "Fígado de frango": "🫀",
  "Peru desfiado": "🦃", "Tofu": "🧈", "Iogurte natural": "🥛", "Queijo cottage": "🧀",
  "Feijão": "🫘", "Feijão preto": "🫘", "Grão-de-bico": "🧆", "Lentilhas": "🥣", "Ervilhas": "🟢",
  "Arroz": "🍚", "Batata": "🥔", "Batata Doce": "🍠", "Batata-doce": "🍠",
  "Macarrão": "🍝", "Massa": "🍝", "Mandioca": "🥕", "Inhame": "🥔",
  "Aveia": "🥣", "Cuscuz": "🌽", "Milho cozido": "🌽", "Polenta": "🌽",
  "Quinoa": "🌾", "Pão integral": "🍞", "Panqueca de banana": "🥞", "Banana": "🍌",
  "Brócolis": "🥦", "Cenoura": "🥕", "Abobrinha": "🥒", "Chuchu": "🥒",
  "Beterraba": "🍠", "Abóbora": "🎃", "Espinafre": "🥬", "Couve-flor": "🥦",
  "Vagem": "🫛", "Tomate": "🍅", "Pepino": "🥒", "Abacate": "🥑",
};

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  bgClass: string;
  iconBg: string;
  filter: (nome: string, tipo: string) => boolean;
}

const categories: Category[] = [
  {
    id: "proteina",
    label: "Proteína",
    icon: <Beef size={20} />,
    bgClass: "bg-[hsl(var(--protein)/.12)]",
    iconBg: "bg-[hsl(var(--protein)/.2)] text-[hsl(var(--protein))]",
    filter: (nome, tipo) => tipo === "proteina" && !LEGUMINOSAS.includes(nome),
  },
  {
    id: "carboidrato",
    label: "Carboidrato",
    icon: <Wheat size={20} />,
    bgClass: "bg-[hsl(var(--carbs)/.12)]",
    iconBg: "bg-[hsl(var(--carbs)/.25)] text-[hsl(40_50%_40%)]",
    filter: (_nome, tipo) => tipo === "carboidrato",
  },
  {
    id: "leguminosa",
    label: "Leguminosa",
    icon: <Bean size={20} />,
    bgClass: "bg-[hsl(var(--sage)/.12)]",
    iconBg: "bg-[hsl(var(--sage)/.2)] text-[hsl(var(--sage-dark))]",
    filter: (nome, tipo) => tipo === "proteina" && LEGUMINOSAS.includes(nome),
  },
  {
    id: "vegetal",
    label: "Legumes",
    icon: <Leaf size={20} />,
    bgClass: "bg-[hsl(var(--veggies)/.12)]",
    iconBg: "bg-[hsl(var(--veggies)/.2)] text-[hsl(var(--veggies))]",
    filter: (_nome, tipo) => tipo === "vegetal",
  },
];

interface AlimentoDB {
  id: string;
  nome: string;
  tipo: string;
  preparo: string | null;
  corte_6_9m: string | null;
  corte_9_12m: string | null;
  corte_12_mais: string | null;
}

const FoodGridCard = ({ item, onSelect }: { item: AlimentoDB; onSelect: () => void }) => {
  const img = getFoodImage(item.nome);
  const emoji = emojiMap[item.nome] || "🍽️";
  return (
    <button
      onClick={onSelect}
      className="group relative flex flex-col rounded-3xl bg-card border border-border/60 shadow-sm transition-all duration-200 active:scale-[0.97] hover:shadow-md hover:border-primary/40 overflow-hidden"
    >
      <div className="aspect-square w-full bg-gradient-to-br from-secondary/60 to-secondary/20 flex items-center justify-center overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={item.nome}
            width={256}
            height={256}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl drop-shadow-sm">{emoji}</span>
        )}
      </div>
      <div className="px-2 py-2.5 text-center">
        <p className="text-[12px] font-bold text-foreground leading-tight line-clamp-2">
          {item.nome}
        </p>
      </div>
    </button>
  );
};

const PlateBuilder = () => {
  const { data: alimentos, isLoading } = useAlimentos();
  const { open } = useEncyclopedia();
  const [activeCategory, setActiveCategory] = useState("proteina");

  const grouped = useMemo(() => {
    if (!alimentos) return {};
    const map: Record<string, AlimentoDB[]> = {};
    categories.forEach((cat) => {
      const seen = new Set<string>();
      map[cat.id] = alimentos
        .filter((a) => cat.filter(a.nome, a.tipo))
        .filter((a) => {
          if (seen.has(a.nome)) return false;
          seen.add(a.nome);
          return true;
        });
    });
    return map;
  }, [alimentos]);

  const activeCat = categories.find((c) => c.id === activeCategory)!;
  const items = grouped[activeCategory] || [];

  return (
    <div className="page-container overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Enciclopédia
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground leading-tight">
          Alimentos para o bebê
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Toque em um alimento para ver guia, cortes seguros e cuidados.
        </p>
      </div>

      {/* Category Selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-colors duration-200 ${
                isActive
                  ? `${cat.bgClass} border-primary/40`
                  : "bg-card border-border/40 hover:bg-secondary/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? cat.iconBg : "bg-secondary text-muted-foreground"}`}>
                {cat.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {cat.label}
              </span>
              <span className="text-[9px] text-muted-foreground font-semibold">
                {grouped[cat.id]?.length || 0} itens
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCat.iconBg}`}>
            {activeCat.icon}
          </div>
          <h2 className="font-bold text-foreground">{activeCat.label}</h2>
        </div>
        <span className="text-xs text-muted-foreground font-semibold">
          {items.length} opções
        </span>
      </div>

      {/* Food Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-3xl bg-secondary/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item) => (
            <FoodGridCard
              key={item.id}
              item={item}
              onSelect={() =>
                open({
                  nome: item.nome,
                  tipo: item.tipo,
                  preparo: item.preparo,
                  corte_6_9m: item.corte_6_9m,
                  corte_9_12m: item.corte_9_12m,
                  corte_12_mais: item.corte_12_mais,
                })
              }
            />
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground text-center py-8">
              Nenhum alimento encontrado nesta categoria.
            </p>
          )}
        </div>
      )}

      {/* Tip */}
      <div className="mt-6 p-4 rounded-2xl bg-primary/8 border border-primary/15">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">💡 Dica:</strong> Um prato equilibrado para o bebê deve ter{" "}
          <strong>1 proteína + 1 carboidrato + 1 leguminosa + 1 legume</strong>. Varie os alimentos a cada dia!
        </p>
      </div>
    </div>
  );
};

export default PlateBuilder;
