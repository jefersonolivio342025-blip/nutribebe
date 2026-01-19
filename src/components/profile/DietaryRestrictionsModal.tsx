import { useState, useEffect } from 'react';
import { X, Check, Wheat, Milk, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DietaryRestrictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DietaryRestrictionsModal = ({ isOpen, onClose }: DietaryRestrictionsModalProps) => {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [semGluten, setSemGluten] = useState(false);
  const [aplv, setAplv] = useState(false);
  const [vegano, setVegano] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setSemGluten(profile.sem_gluten || false);
      setAplv(profile.aplv || false);
      setVegano(profile.vegano || false);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          sem_gluten: semGluten,
          aplv: aplv,
          vegano: vegano,
        })
        .eq('user_id', profile?.user_id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Restrições salvas! ✅',
        description: 'O cardápio será ajustado automaticamente',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restrictions = [
    {
      id: 'semGluten',
      label: 'Sem Glúten',
      description: 'Exclui alimentos com glúten (trigo, aveia, cevada)',
      icon: Wheat,
      color: 'bg-amber-100 text-amber-700',
      checked: semGluten,
      onChange: setSemGluten,
    },
    {
      id: 'aplv',
      label: 'APLV',
      description: 'Alergia à Proteína do Leite de Vaca',
      icon: Milk,
      color: 'bg-blue-100 text-blue-700',
      checked: aplv,
      onChange: setAplv,
    },
    {
      id: 'vegano',
      label: 'Vegano',
      description: 'Sem produtos de origem animal',
      icon: Leaf,
      color: 'bg-green-100 text-green-700',
      checked: vegano,
      onChange: setVegano,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-background p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Restrições Alimentares</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Selecione as restrições alimentares do seu bebê. O cardápio será ajustado automaticamente.
          </p>

          {restrictions.map((restriction) => (
            <button
              key={restriction.id}
              onClick={() => restriction.onChange(!restriction.checked)}
              className={`card-soft w-full flex items-center gap-4 transition-all ${
                restriction.checked ? 'ring-2 ring-primary shadow-card' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${restriction.color} flex items-center justify-center`}>
                <restriction.icon size={22} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{restriction.label}</p>
                <p className="text-sm text-muted-foreground">{restriction.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                restriction.checked 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground/30'
              }`}>
                {restriction.checked && <Check size={14} className="text-primary-foreground" />}
              </div>
            </button>
          ))}

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="generate-btn w-full mt-4"
          >
            {isLoading ? 'Salvando...' : 'Salvar Preferências'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietaryRestrictionsModal;
