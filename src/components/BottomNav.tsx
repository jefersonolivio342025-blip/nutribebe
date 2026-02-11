import { Calendar, Home, ShoppingCart, Stethoscope } from 'lucide-react';

type NavTab = 'today' | 'calendar' | 'list' | 'nutris';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems: { id: NavTab; icon: typeof Home; label: string }[] = [
    { id: 'today', icon: Home, label: 'Hoje' },
    { id: 'calendar', icon: Calendar, label: 'Semana' },
    { id: 'list', icon: ShoppingCart, label: 'Lista' },
    { id: 'nutris', icon: Stethoscope, label: 'Nutris' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`nav-item ${activeTab === id ? 'active' : ''}`}
        >
          <Icon 
            size={24} 
            strokeWidth={activeTab === id ? 2.5 : 2}
            className="transition-transform duration-200"
          />
          <span className="text-xs font-semibold">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
