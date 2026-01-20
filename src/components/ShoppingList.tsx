import { useState } from 'react';
import { Check, ShoppingBag, FileDown, Share2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { DayMenu, getShoppingList } from '@/data/menuData';
import { useViewContentTracking, useConversionTracking } from '@/hooks/useConversionTracking';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShoppingListProps {
  weekMenu: DayMenu[];
}

const ShoppingList = ({ weekMenu }: ShoppingListProps) => {
  useViewContentTracking('Lista de Compras', 'Shopping');
  const { handlePaywallClick } = useConversionTracking();
  const { isPremium } = useAuth();
  
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const shoppingList = getShoppingList(weekMenu);
  const sortedItems = Array.from(shoppingList.entries()).sort((a, b) => {
    const groupOrder = { protein: 0, carbs: 1, veggies: 2 };
    return groupOrder[a[1].food.group] - groupOrder[b[1].food.group];
  });

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const groupLabels = {
    protein: { label: 'Proteínas', emoji: '🥩' },
    carbs: { label: 'Carboidratos', emoji: '🍚' },
    veggies: { label: 'Legumes & Verduras', emoji: '🥦' },
  };

  const groupedItems = sortedItems.reduce((acc, [id, { food, count }]) => {
    if (!acc[food.group]) {
      acc[food.group] = [];
    }
    acc[food.group].push({ id, food, count });
    return acc;
  }, {} as Record<string, { id: string; food: typeof sortedItems[0][1]['food']; count: number }[]>);

  const completedCount = checkedItems.size;
  const totalCount = sortedItems.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleExportPDF = () => {
    if (!isPremium) {
      handlePaywallClick('Lista de Compras', 'Baixar Lista PDF');
      toast.error('Recurso Exclusivo do Plano Vitalício ⭐', {
        description: 'Libere seu acesso para baixar a lista em PDF!',
        action: {
          label: 'Liberar Acesso',
          onClick: () => window.open('https://pay.kiwify.com.br/vrYjxfv', '_blank'),
        },
      });
      return;
    }

    if (checkedItems.size === 0) {
      toast.error('Nenhum item selecionado', { 
        description: 'Selecione os itens que deseja baixar.' 
      });
      return;
    }

    // Filter only checked items
    const selectedItems = sortedItems.filter(([id]) => checkedItems.has(id));
    const selectedGroupedItems = selectedItems.reduce((acc, [id, { food, count }]) => {
      if (!acc[food.group]) {
        acc[food.group] = [];
      }
      acc[food.group].push({ id, food, count });
      return acc;
    }, {} as Record<string, { id: string; food: typeof sortedItems[0][1]['food']; count: number }[]>);

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Minha Lista NutriBebê PRO', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(today, 105, 30, { align: 'center' });

    let yPosition = 50;
    const lineHeight = 8;
    const categorySpacing = 15;

    // Categories
    const categoryOrder: Array<'protein' | 'carbs' | 'veggies'> = ['protein', 'carbs', 'veggies'];
    
    categoryOrder.forEach((group) => {
      const items = selectedGroupedItems[group];
      if (!items || items.length === 0) return;

      // Check if we need a new page
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      // Category header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${groupLabels[group].emoji} ${groupLabels[group].label}`, 20, yPosition);
      yPosition += lineHeight + 2;

      // Items
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      items.forEach(({ food, count }) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${food.name} (${count}x)`, 25, yPosition);
        yPosition += lineHeight;
      });

      yPosition += categorySpacing;
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Gerado por NutriBebê PRO', 105, 290, { align: 'center' });

    doc.save('lista-nutribebe-selecionados.pdf');
    toast.success(`PDF com ${checkedItems.size} item(ns) baixado! 📄`);
  };

  const handleShareWhatsApp = () => {
    if (!isPremium) {
      handlePaywallClick('Lista de Compras', 'Compartilhar WhatsApp');
      toast.error('Recurso Exclusivo do Plano Vitalício ⭐', {
        description: 'Libere seu acesso para compartilhar a lista!',
        action: {
          label: 'Liberar Acesso',
          onClick: () => window.open('https://pay.kiwify.com.br/vrYjxfv', '_blank'),
        },
      });
      return;
    }

    if (sortedItems.length === 0) {
      toast.error('Lista vazia', { description: 'Gere um cardápio primeiro!' });
      return;
    }

    const today = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    let message = `🛒 *Minha Lista NutriBebê PRO*\n📅 ${today}\n\n`;

    const categoryOrder: Array<'protein' | 'carbs' | 'veggies'> = ['protein', 'carbs', 'veggies'];
    
    categoryOrder.forEach((group) => {
      const items = groupedItems[group];
      if (!items || items.length === 0) return;

      message += `*${groupLabels[group].emoji} ${groupLabels[group].label}*\n`;
      items.forEach(({ food, count }) => {
        message += `• ${food.name} (${count}x)\n`;
      });
      message += '\n';
    });

    message += '✨ _Gerado por NutriBebê PRO_';

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Abrindo WhatsApp...');
  };

  return (
    <div className="page-container">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Lista de Compras 🛒
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ingredientes para a semana toda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <FileDown size={16} />
              <span className="hidden sm:inline">Selecionados</span>
              <span className="sm:hidden">📄</span>
            </Button>
          </div>
        </div>
      </header>

      {sortedItems.length > 0 ? (
        <>
          {/* Progress Bar */}
          <div className="card-elevated mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <span className="font-semibold text-foreground">Progresso</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {completedCount} de {totalCount} itens
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Grouped Items */}
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="mb-6">
              <h2 className="section-title flex items-center gap-2">
                <span>{groupLabels[group as keyof typeof groupLabels].emoji}</span>
                <span>{groupLabels[group as keyof typeof groupLabels].label}</span>
              </h2>
              <div className="space-y-2">
                {items.map(({ id, food, count }) => {
                  const isChecked = checkedItems.has(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleItem(id)}
                      className={`ingredient-item w-full transition-all duration-200 ${
                        isChecked ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                            isChecked
                              ? 'bg-primary border-primary'
                              : 'border-border'
                          }`}
                        >
                          {isChecked && (
                            <Check size={14} className="text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-xl">{food.emoji}</span>
                        <span
                          className={`font-medium ${
                            isChecked
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {food.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {count}x
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="card-elevated text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Lista vazia
          </h3>
          <p className="text-muted-foreground">
            Gere um cardápio para ver a lista de compras
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
