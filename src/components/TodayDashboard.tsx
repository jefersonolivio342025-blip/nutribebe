import { Sparkles, Lock, Loader2 } from 'lucide-react';
import { DayMenu } from '@/data/menuData';
import MealCard from './MealCard';

interface TodayDashboardProps {
  todayMenu: DayMenu | null;
  onGenerate: () => void;
  isLocked: boolean;
  isLoadingAlimentos?: boolean;
}

const TodayDashboard = ({ todayMenu, onGenerate, isLocked, isLoadingAlimentos }: TodayDashboardProps) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const isAfterWednesday = dayOfWeek >= 3;

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return today.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="mb-6">
        <p className="text-sm text-muted-foreground font-medium capitalize">
          {formatDate()}
        </p>
        <h1 className="text-2xl font-extrabold text-foreground mt-1">
          Cardápio de Hoje 🥗
        </h1>
      </header>

      {/* Generate Button */}
      <button 
        onClick={onGenerate} 
        className="generate-btn mb-6"
        disabled={isLoadingAlimentos}
      >
        {isLoadingAlimentos ? (
          <Loader2 size={22} className="animate-spin" />
        ) : (
          <Sparkles size={22} />
        )}
        <span>{isLoadingAlimentos ? 'Carregando...' : 'Gerar Cardápio da Semana'}</span>
      </button>

      {/* Menu Content */}
      {todayMenu ? (
        <div className={`relative ${isLocked && isAfterWednesday ? 'blur-paywall' : ''}`}>
          {todayMenu.meals.map((meal, index) => (
            <MealCard key={`${meal.type}-${index}`} meal={meal} />
          ))}

          {/* Paywall Overlay */}
          {isLocked && isAfterWednesday && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
              <div className="card-elevated text-center max-w-sm animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-terracotta-light flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-terracotta" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Conteúdo Bloqueado
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Desbloqueie o cardápio completo da semana e tenha acesso a todas
                  as receitas e guias de preparo.
                </p>
                <button className="paywall-cta">
                  <Sparkles size={20} />
                  Liberar Plano Completo na Kiwify
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card-elevated text-center py-12">
          <div className="text-5xl mb-4">👶</div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Nenhum cardápio gerado
          </h3>
          <p className="text-muted-foreground">
            Clique no botão acima para gerar o cardápio da semana
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayDashboard;
