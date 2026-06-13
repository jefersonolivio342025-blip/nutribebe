import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useAlimentos } from "@/hooks/useAlimentos";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { getFoodImage } from "@/lib/foodImages";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const GlobalFoodSearch = () => {
  const { data: alimentos } = useAlimentos();
  const { open } = useEncyclopedia();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!alimentos || !query.trim()) return [];
    const q = normalize(query);
    const seen = new Set<string>();
    return alimentos
      .filter((a) => {
        if (seen.has(a.nome)) return false;
        if (normalize(a.nome).includes(q)) {
          seen.add(a.nome);
          return true;
        }
        return false;
      })
      .slice(0, 8);
  }, [alimentos, query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSelect = (food: typeof results[number]) => {
    open({
      nome: food.nome,
      tipo: food.tipo,
      preparo: food.preparo,
      corte_6_9m: food.corte_6_9m,
      corte_9_12m: food.corte_9_12m,
      corte_12_mais: food.corte_12_mais,
    });
    setQuery("");
    setFocused(false);
  };

  const showDropdown = focused && query.trim().length > 0;

  return (
    <div ref={containerRef} className="px-4 pt-4 pb-2 relative z-30">
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="🔎 Digite um alimento (ex: Banana, Ovo, Brócolis)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="w-full bg-card border border-border rounded-2xl py-3.5 pl-11 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/70"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
            aria-label="Limpar busca"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-4 right-4 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              Nenhum alimento encontrado para "{query}".
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((r) => {
                const img = getFoodImage(r.nome);
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => handleSelect(r)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary transition-colors text-left"
                    >
                      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                        {img ? (
                          <img
                            src={img}
                            alt={r.nome}
                            width={88}
                            height={88}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">🍽️</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{r.nome}</p>
                        <p className="text-[11px] text-muted-foreground capitalize">{r.tipo}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalFoodSearch;
