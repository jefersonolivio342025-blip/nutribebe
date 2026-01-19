import { X } from 'lucide-react';
import { useAlimentos } from '@/hooks/useAlimentos';

interface BLWGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLWGuideModal = ({ isOpen, onClose }: BLWGuideModalProps) => {
  const { data: alimentos, isLoading } = useAlimentos();

  if (!isOpen) return null;

  const groupedAlimentos = alimentos?.reduce((acc, food) => {
    const tipo = food.tipo;
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(food);
    return acc;
  }, {} as Record<string, typeof alimentos>);

  const tipoLabels: Record<string, { label: string; emoji: string }> = {
    proteina: { label: 'Proteínas', emoji: '🥩' },
    carboidrato: { label: 'Carboidratos', emoji: '🍚' },
    vegetal: { label: 'Vegetais', emoji: '🥦' },
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-background p-4 border-b border-border flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-foreground">Guia BLW Completo</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-muted-foreground">Carregando alimentos...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedAlimentos || {}).map(([tipo, foods]) => (
                <div key={tipo}>
                  <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                    <span>{tipoLabels[tipo]?.emoji}</span>
                    {tipoLabels[tipo]?.label || tipo}
                  </h3>
                  <div className="space-y-3">
                    {foods?.map((food) => (
                      <div key={food.id} className="card-soft">
                        <h4 className="font-semibold text-foreground mb-2">{food.nome}</h4>
                        {food.preparo && (
                          <p className="text-sm text-muted-foreground mb-3">
                            📝 {food.preparo}
                          </p>
                        )}
                        <div className="space-y-2 text-sm">
                          {food.corte_6_9m && (
                            <div className="flex gap-2">
                              <span className="font-medium text-sage-dark">6-9m:</span>
                              <span className="text-muted-foreground">{food.corte_6_9m}</span>
                            </div>
                          )}
                          {food.corte_9_12m && (
                            <div className="flex gap-2">
                              <span className="font-medium text-terracotta">9-12m:</span>
                              <span className="text-muted-foreground">{food.corte_9_12m}</span>
                            </div>
                          )}
                          {food.corte_12_mais && (
                            <div className="flex gap-2">
                              <span className="font-medium text-lavender">12m+:</span>
                              <span className="text-muted-foreground">{food.corte_12_mais}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BLWGuideModal;
