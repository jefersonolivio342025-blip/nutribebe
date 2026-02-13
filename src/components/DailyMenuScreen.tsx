import { useState, useMemo, useCallback } from 'react';
import { Clock, Baby, Scissors, AlertTriangle, Check, ChevronRight, Lightbulb, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  dailyRecipes,
  recipeMealConfigs,
  nutritionTips,
  allergenConfig,
  type RecipeMealType,
  type Recipe,
  type Allergen,
} from '@/data/recipeData';

/* ──────────────────────────────────────────────
   Allergen Filter Bar
   ────────────────────────────────────────────── */
const AllergenFilterBar = ({
  active,
  onToggle,
}: {
  active: Set<Allergen>;
  onToggle: (a: Allergen) => void;
}) => (
  <div className="mb-5">
    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1 flex items-center gap-1.5">
      <AlertTriangle size={13} />
      Filtrar alérgenos
    </p>
    <div className="flex flex-wrap gap-2">
      {(Object.entries(allergenConfig) as [Allergen, { label: string; emoji: string }][]).map(
        ([key, cfg]) => {
          const isActive = active.has(key);
          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isActive
                  ? 'bg-destructive/15 border-destructive/40 text-destructive'
                  : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              <span>{cfg.emoji}</span>
              {cfg.label}
              {isActive && <X size={12} />}
            </button>
          );
        }
      )}
    </div>
  </div>
);

/* ──────────────────────────────────────────────
   BLW Cutting Guide Modal
   ────────────────────────────────────────────── */
const CuttingGuideModal = ({
  recipe,
  open,
  onClose,
}: {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Scissors size={20} className="text-primary" />
            Guia de Corte Seguro
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-4">
          Como preparar <strong className="text-foreground">{recipe.name}</strong> de forma segura para o bebê.
        </p>

        <div className="space-y-4">
          {/* 6 months */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground border-0 font-bold text-xs">
                <Baby size={12} className="mr-1" />
                6 meses
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">Tiras grandes</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {recipe.cuttingGuide['6m']}
            </p>
          </div>

          {/* 9 months+ */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground border-0 font-bold text-xs">
                <Baby size={12} className="mr-1" />
                9+ meses
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">Pedacinhos</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {recipe.cuttingGuide['9m+']}
            </p>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-secondary/50 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">⚠️ Dica de segurança:</strong> Sempre supervisione
          o bebê durante as refeições. Alimentos devem estar macios o suficiente para amassar entre
          seus dedos.
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ──────────────────────────────────────────────
   Meal Completion Check
   ────────────────────────────────────────────── */
const useMealCompletion = () => {
  const storageKey = `nutriBebe_mealCheck_${new Date().toDateString()}`;

  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const toggle = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        localStorage.setItem(storageKey, JSON.stringify([...next]));
        return next;
      });
    },
    [storageKey]
  );

  return { completed, toggle };
};

/* ──────────────────────────────────────────────
   Recipe Card
   ────────────────────────────────────────────── */
const RecipeCard = ({
  recipe,
  onOpenCuttingGuide,
  isCompleted,
  onToggleComplete,
  isFiltered,
}: {
  recipe: Recipe;
  onOpenCuttingGuide: (r: Recipe) => void;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  isFiltered: boolean;
}) => {
  if (isFiltered) {
    return (
      <div className="card-elevated mb-4 opacity-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-destructive/5 z-0" />
        <div className="relative z-10 flex items-center gap-3 p-2">
          <AlertTriangle size={18} className="text-destructive shrink-0" />
          <div>
            <p className="font-bold text-sm text-foreground">{recipe.name}</p>
            <p className="text-xs text-destructive font-semibold">
              Contém: {recipe.allergens.map((a) => allergenConfig[a].label).join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card-elevated mb-4 animate-slide-up transition-all ${
        isCompleted ? 'ring-2 ring-primary/30 bg-primary/5' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold text-foreground leading-snug">{recipe.name}</h3>
        <Badge
          variant="secondary"
          className="shrink-0 bg-primary/15 text-primary border-0 font-bold text-xs"
        >
          <Baby size={12} className="mr-1" />
          {recipe.ageRange}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{recipe.description}</p>

      {/* Allergen badges */}
      {recipe.allergens.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.allergens.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold border border-destructive/20"
            >
              <AlertTriangle size={10} />
              {allergenConfig[a].label}
            </span>
          ))}
        </div>
      )}

      {/* Prep time + cutting guide button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Clock size={14} />
          <span>Preparo: {recipe.prepTime}</span>
        </div>
        <button
          onClick={() => onOpenCuttingGuide(recipe)}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <Scissors size={14} />
          Ver Corte Seguro
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Ingredients */}
      <div className="rounded-xl bg-secondary/50 p-4 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Ingredientes
        </p>
        <ul className="space-y-2.5">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="text-lg leading-none">{ing.emoji}</span>
              <span className="text-foreground font-medium">{ing.name}</span>
              <span className="ml-auto text-muted-foreground text-xs font-semibold whitespace-nowrap">
                {ing.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Completion check */}
      <button
        onClick={() => onToggleComplete(recipe.id)}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
          isCompleted
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
        }`}
      >
        <Check size={16} />
        {isCompleted ? 'Refeição concluída! ✨' : 'Marcar como concluída'}
      </button>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Nutrition Tips Carousel
   ────────────────────────────────────────────── */
const NutritionTipsSection = () => (
  <div className="mt-6 mb-4">
    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1 flex items-center gap-1.5">
      <Lightbulb size={13} />
      Dicas Nutricionais
    </p>
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
      {nutritionTips.map((tip) => (
        <div
          key={tip.id}
          className="snap-start shrink-0 w-[220px] rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="text-2xl mb-2">{tip.emoji}</div>
          <p className="text-sm font-bold text-foreground mb-1">{tip.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ──────────────────────────────────────────────
   Main Screen
   ────────────────────────────────────────────── */
const DailyMenuScreen = () => {
  const [activeTab, setActiveTab] = useState<RecipeMealType>('breakfast');
  const [activeAllergens, setActiveAllergens] = useState<Set<Allergen>>(new Set());
  const [cuttingGuideRecipe, setCuttingGuideRecipe] = useState<Recipe | null>(null);
  const { completed, toggle: toggleComplete } = useMealCompletion();

  const todayIndex = useMemo(() => new Date().getDay(), []);

  const toggleAllergen = useCallback((a: Allergen) => {
    setActiveAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  }, []);

  const isRecipeFiltered = useCallback(
    (recipe: Recipe) =>
      recipe.allergens.some((a) => activeAllergens.has(a)),
    [activeAllergens]
  );

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return new Date().toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="mb-5">
        <p className="text-sm text-muted-foreground font-medium capitalize">{formatDate()}</p>
        <h1 className="text-2xl font-extrabold text-foreground mt-1">Cardápio do Dia 🍽️</h1>
      </header>

      {/* Allergen Filters */}
      <AllergenFilterBar active={activeAllergens} onToggle={toggleAllergen} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as RecipeMealType)}
        className="w-full"
      >
        <TabsList className="w-full h-auto flex-wrap gap-1 bg-secondary/60 p-1.5 rounded-2xl mb-5">
          {recipeMealConfigs.map((cfg) => (
            <TabsTrigger
              key={cfg.type}
              value={cfg.type}
              className="flex-1 min-w-[80px] text-xs font-bold py-2 px-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <span className="mr-1">{cfg.emoji}</span>
              {cfg.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {recipeMealConfigs.map((cfg) => {
          const recipes = dailyRecipes[cfg.type];
          const mainIdx = todayIndex % recipes.length;

          return (
            <TabsContent key={cfg.type} value={cfg.type}>
              {/* Main recipe of the day */}
              <RecipeCard
                recipe={recipes[mainIdx]}
                onOpenCuttingGuide={setCuttingGuideRecipe}
                isCompleted={completed.has(recipes[mainIdx].id)}
                onToggleComplete={toggleComplete}
                isFiltered={isRecipeFiltered(recipes[mainIdx])}
              />

              {/* Other suggestions */}
              <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                  Outras sugestões
                </p>
                {recipes
                  .filter((_, i) => i !== mainIdx)
                  .map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onOpenCuttingGuide={setCuttingGuideRecipe}
                      isCompleted={completed.has(recipe.id)}
                      onToggleComplete={toggleComplete}
                      isFiltered={isRecipeFiltered(recipe)}
                    />
                  ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Nutrition Tips */}
      <NutritionTipsSection />

      {/* Cutting Guide Modal */}
      <CuttingGuideModal
        recipe={cuttingGuideRecipe}
        open={!!cuttingGuideRecipe}
        onClose={() => setCuttingGuideRecipe(null)}
      />
    </div>
  );
};

export default DailyMenuScreen;
