import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import TodayDashboard from '@/components/TodayDashboard';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import ShoppingList from '@/components/ShoppingList';
import NutritionistsPage from '@/components/NutritionistsPage';
import { DayMenu } from '@/data/menuData';
import { useGenerateMenu } from '@/hooks/useGenerateMenu';

type NavTab = 'today' | 'calendar' | 'list' | 'nutris';

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  
  const { generateWeeklyMenu, isLoading: isLoadingAlimentos } = useGenerateMenu();

  // Load menu from localStorage on mount
  useEffect(() => {
    const savedMenu = localStorage.getItem('nutriBebe_weekMenu');
    if (savedMenu) {
      const parsed = JSON.parse(savedMenu);
      const restored = parsed.map((day: DayMenu) => ({
        ...day,
        date: new Date(day.date),
      }));
      setWeekMenu(restored);
    }
  }, []);

  const handleGenerate = () => {
    const newMenu = generateWeeklyMenu();
    if (newMenu.length > 0) {
      setWeekMenu(newMenu);
      localStorage.setItem('nutriBebe_weekMenu', JSON.stringify(newMenu));
    }
  };

  const getTodayMenu = (): DayMenu | null => {
    if (weekMenu.length === 0) return null;
    const today = new Date().getDay();
    return weekMenu[today] || null;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <TodayDashboard
            todayMenu={getTodayMenu()}
            onGenerate={handleGenerate}
            isLocked={false}
            isLoadingAlimentos={isLoadingAlimentos}
          />
        );
      case 'calendar':
        return <WeeklyCalendar weekMenu={weekMenu} isLocked={false} />;
      case 'list':
        return <ShoppingList weekMenu={weekMenu} />;
      case 'nutris':
        return <NutritionistsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
