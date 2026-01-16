import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import TodayDashboard from '@/components/TodayDashboard';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import ShoppingList from '@/components/ShoppingList';
import ProfilePage from '@/components/ProfilePage';
import { DayMenu, generateWeeklyMenu } from '@/data/menuData';

type NavTab = 'today' | 'calendar' | 'list' | 'profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const [isLocked, setIsLocked] = useState(true);

  // Load menu from localStorage on mount
  useEffect(() => {
    const savedMenu = localStorage.getItem('nutriBebe_weekMenu');
    if (savedMenu) {
      const parsed = JSON.parse(savedMenu);
      // Restore Date objects
      const restored = parsed.map((day: DayMenu) => ({
        ...day,
        date: new Date(day.date),
      }));
      setWeekMenu(restored);
    }

    const savedLock = localStorage.getItem('nutriBebe_isLocked');
    if (savedLock !== null) {
      setIsLocked(JSON.parse(savedLock));
    }
  }, []);

  const handleGenerate = () => {
    const newMenu = generateWeeklyMenu();
    setWeekMenu(newMenu);
    localStorage.setItem('nutriBebe_weekMenu', JSON.stringify(newMenu));
  };

  const handleToggleLock = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    localStorage.setItem('nutriBebe_isLocked', JSON.stringify(newLockState));
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
            isLocked={isLocked}
          />
        );
      case 'calendar':
        return <WeeklyCalendar weekMenu={weekMenu} isLocked={isLocked} />;
      case 'list':
        return <ShoppingList weekMenu={weekMenu} />;
      case 'profile':
        return <ProfilePage isLocked={isLocked} onToggleLock={handleToggleLock} />;
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
