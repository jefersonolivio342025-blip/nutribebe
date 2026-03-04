import { Calendar, Home, ShoppingCart, Stethoscope, UtensilsCrossed, PlayCircle, BookOpen } from "lucide-react";

// Exportamos o tipo para que o Index.tsx possa usá-lo e evitar o erro de "unrelated types"
export type NavTab = "today" | "daily" | "calendar" | "list" | "nutris" | "videos" | "rotina";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  // Adicionamos o item de vídeos aqui
  const navItems: { id: NavTab; icon: any; label: string }[] = [
    { id: "today", icon: Home, label: "Hoje" },
    { id: "daily", icon: UtensilsCrossed, label: "Prato" },
    { id: "calendar", icon: Calendar, label: "Semana" },
    { id: "list", icon: ShoppingCart, label: "Lista" },
    { id: "videos", icon: PlayCircle, label: "Vídeos" },
    { id: "rotina", icon: BookOpen, label: "Rotina" },
    { id: "nutris", icon: Stethoscope, label: "Nutris" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => onTabChange(id)} className={`nav-item ${activeTab === id ? "active" : ""}`}>
          <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} className="transition-transform duration-200" />
          <span className="text-xs font-semibold">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
