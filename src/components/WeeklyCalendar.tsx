import { useState } from 'react';
import { ChevronRight, Lock, Sparkles } from 'lucide-react';
import { DayMenu } from '@/data/menuData';
import MealCard from './MealCard';
import { useConversionTracking, useViewContentTracking } from '@/hooks/useConversionTracking';

interface WeeklyCalendarProps {
  weekMenu: DayMenu[];
  isLocked: boolean;
}

const WeeklyCalendar = ({ weekMenu, isLocked }: WeeklyCalendarProps) => {
  const { handlePaywallClick } = useConversionTracking();
  useViewContentTracking('Calendário Semanal', 'Menu');
  
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const today = new Date().getDay();

  const isAfterWednesday = (dayIndex: number) => dayIndex >= 3;

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          Calendário Semanal 📅
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Planejamento completo da semana
        </p>
      </header>

      {weekMenu.length > 0 ? (
        <>
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-hide">
            {weekMenu.map((day, index) => {
              const isSelected = selectedDay === index;
              const isToday = today === index;
              const locked = isLocked && isAfterWednesday(index);

              return (
                <button
                  key={day.dayName}
                  onClick={() => setSelectedDay(index)}
                  className={`flex-shrink-0 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-card'
                      : 'bg-card text-foreground shadow-soft hover:shadow-card'
                  } ${locked ? 'opacity-70' : ''}`}
                >
                  <p className="text-xs font-medium opacity-80">
                    {day.dayName.slice(0, 3)}
                  </p>
                  <p className="text-lg font-bold">{day.date.getDate()}</p>
                  {isToday && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${
                        isSelected ? 'bg-primary-foreground' : 'bg-primary'
                      }`}
                    />
                  )}
                  {locked && <Lock size={12} className="mx-auto mt-1" />}
                </button>
              );
            })}
          </div>

          {/* Selected Day Content */}
          {weekMenu[selectedDay] && (
            <div
              className={`relative ${
                isLocked && isAfterWednesday(selectedDay) ? 'blur-paywall' : ''
              }`}
            >
              <h2 className="section-title flex items-center gap-2">
                {weekMenu[selectedDay].dayName}
                <ChevronRight size={18} className="text-muted-foreground" />
              </h2>

              {weekMenu[selectedDay].meals.map((meal, index) => (
                <MealCard key={`${meal.type}-${index}`} meal={meal} />
              ))}

              {/* Paywall Overlay */}
              {isLocked && isAfterWednesday(selectedDay) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
                  <div className="card-elevated text-center max-w-sm animate-scale-in">
                    <div className="w-16 h-16 rounded-full bg-terracotta-light flex items-center justify-center mx-auto mb-4">
                      <Lock size={28} className="text-terracotta" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Conteúdo Exclusivo NutriBebê PRO
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Adquira seu Acesso Vitalício agora e tenha o guia completo na palma da sua mão.
                    </p>
                    <a 
                      href="https://pay.kiwify.com.br/vrYjxFv" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="paywall-cta inline-flex"
                      onClick={() => handlePaywallClick('weekly_calendar')}
                    >
                      <Sparkles size={20} />
                      Liberar Acesso Vitalício ⭐
                    </a>
                    <p className="text-xs text-muted-foreground mt-3">
                      Compra segura. Acesso vitalício sem mensalidades.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="card-elevated text-center py-12">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Nenhum cardápio gerado
          </h3>
          <p className="text-muted-foreground">
            Vá para a aba "Hoje" e gere o cardápio da semana
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
