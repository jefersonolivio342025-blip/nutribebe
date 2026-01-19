import { useState } from 'react';
import { X, User, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [nome, setNome] = useState(profile?.nome || '');
  const [babyName, setBabyName] = useState(profile?.baby_name || '');
  const [babyBirthDate, setBabyBirthDate] = useState(profile?.baby_birth_date || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome,
          baby_name: babyName || null,
          baby_birth_date: babyBirthDate || null,
        })
        .eq('user_id', profile?.user_id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Perfil atualizado! ✅',
        description: 'Suas informações foram salvas',
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-background p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <User size={16} className="inline mr-2" />
              Seu Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como você quer ser chamado(a)"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              👶 Nome do Bebê
            </label>
            <input
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Nome do seu bebê"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar size={16} className="inline mr-2" />
              Data de Nascimento do Bebê
            </label>
            <input
              type="date"
              value={babyBirthDate}
              onChange={(e) => setBabyBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="generate-btn w-full mt-4"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
