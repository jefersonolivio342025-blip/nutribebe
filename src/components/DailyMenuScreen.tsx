import { useState, useMemo } from 'react';
import { Clock, Baby } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  dailyRecipes,
  recipeMealConfigs,
  type RecipeMealType,
  type Recipe,
} from '@/data/recipeData';

const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
  <div className="card-elevated mb-4 animate-slide-up">
    {/* Header */}
    <div className="flex items-start justify-between gap-3 mb-3">
      <h3 className="text-lg font-bold text-foreground leading-snug">
        {recipe.name}
      </h3>
      <Badge
        variant="secondary"
        className="shrink-0 bg-primary/15 text-primary border-0 font-bold text-xs"
      >
        <Baby size={12} className="mr-1" />
        {recipe.ageRange}
      </Badge>
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
      {recipe.description}
    </p>

    {/* Prep time */}
    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-4">
      <Clock size={14} />
      <span>Preparo: {recipe.prepTime}</span>
    </div>

    {/* Ingredients */}
    <div className="rounded-xl bg-secondary/50 p-4">
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
  </div>
);

const DailyMenuScreen = () => {
  const [activeTab, setActiveTab] = useState<RecipeMealType>('breakfast');

  const todayIndex = useMemo(() => new Date().getDay(), []);
  const recipes = dailyRecipes[activeTab];
  // Rotate which recipe shows based on day of the week
  const todayRecipe = recipes[todayIndex % recipes.length];

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
        <p className="text-sm text-muted-foreground font-medium capitalize">
          {formatDate()}
        </p>
        <h1 className="text-2xl font-extrabold text-foreground mt-1">
          Cardápio do Dia 🍽️
        </h1>
      </header>

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

        {recipeMealConfigs.map((cfg) => (
          <TabsContent key={cfg.type} value={cfg.type}>
            <RecipeCard
              recipe={dailyRecipes[cfg.type][todayIndex % dailyRecipes[cfg.type].length]}
            />

            {/* Other suggestions */}
            <div className="mt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                Outras sugestões
              </p>
              {dailyRecipes[cfg.type]
                .filter((_, i) => i !== todayIndex % dailyRecipes[cfg.type].length)
                .map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DailyMenuScreen;
