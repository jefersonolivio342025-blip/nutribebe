import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import TodayDashboard from '@/components/TodayDashboard';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import ShoppingList from '@/components/ShoppingList';
import ProfilePage from '@/components/ProfilePage';
import NutritionistsPage from '@/components/NutritionistsPage';
import OnboardingScreen from '@/components/OnboardingScreen';
import { DayMenu } from '@/data/menuData';
import { useAuth } from '@/hooks/useAuth';
import { useGenerateMenu } from '@/hooks/useGenerateMenu';
import { usePWAInstall } from '@/hooks/usePWAInstall';

type NavTab = 'today' | 'calendar' | 'list' | 'nutris' | 'profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const { user, loading, isPremium } = useAuth();
  const { generateWeeklyMenu, isLoading: isLoadingAlimentos } = useGenerateMenu();
  const { isInstalled } = usePWAInstall();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load menu from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedMenu = localStorage.getItem(`nutriBebe_weekMenu_${user.id}`);
      if (savedMenu) {
        const parsed = JSON.parse(savedMenu);
        const restored = parsed.map((day: DayMenu) => ({
          ...day,
          date: new Date(day.date),
        }));
        setWeekMenu(restored);
      }
    }
  }, [user]);

  const handleGenerate = () => {
    const newMenu = generateWeeklyMenu();
    if (newMenu.length > 0 && user) {
      setWeekMenu(newMenu);
      localStorage.setItem(`nutriBebe_weekMenu_${user.id}`, JSON.stringify(newMenu));
    }
  };

  const getTodayMenu = (): DayMenu | null => {
    if (weekMenu.length === 0) return null;
    const today = new Date().getDay();
    return weekMenu[today] || null;
  };

  // isLocked is now based on isPremium from the database
  const isLocked = !isPremium;

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <TodayDashboard
            todayMenu={getTodayMenu()}
            onGenerate={handleGenerate}
            isLocked={isLocked}
            isLoadingAlimentos={isLoadingAlimentos}
          />
        );
      case 'calendar':
        return <WeeklyCalendar weekMenu={weekMenu} isLocked={isLocked} />;
      case 'list':
        return <ShoppingList weekMenu={weekMenu} />;
      case 'nutris':
        return <NutritionistsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {user && isPremium && (
        <OnboardingScreen 
          userId={user.id}
          onComplete={() => setShowWelcome(false)} 
        />
      )}
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
