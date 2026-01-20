import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, MapPin, Phone, Instagram, X, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Nutricionista {
  id: string;
  nome: string;
  crn: string;
  especialidade: string;
  cidade: string;
  bairro: string | null;
  link_whatsapp: string | null;
  instagram: string | null;
}

const emptyForm: Omit<Nutricionista, 'id'> = {
  nome: '',
  crn: '',
  especialidade: '',
  cidade: '',
  bairro: '',
  link_whatsapp: '',
  instagram: '',
};

const NutricionistasManager = () => {
  const { toast } = useToast();
  const [nutricionistas, setNutricionistas] = useState<Nutricionista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNutricionistas();
  }, []);

  const fetchNutricionistas = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('nutricionistas')
      .select('*')
      .order('cidade', { ascending: true });

    if (!error && data) {
      setNutricionistas(data);
    }
    setIsLoading(false);
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (nutri: Nutricionista) => {
    setEditingId(nutri.id);
    setForm({
      nome: nutri.nome,
      crn: nutri.crn,
      especialidade: nutri.especialidade,
      cidade: nutri.cidade,
      bairro: nutri.bairro || '',
      link_whatsapp: nutri.link_whatsapp || '',
      instagram: nutri.instagram || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome || !form.crn || !form.cidade || !form.especialidade) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, CRN, especialidade e cidade',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    const payload = {
      nome: form.nome,
      crn: form.crn,
      especialidade: form.especialidade,
      cidade: form.cidade,
      bairro: form.bairro || null,
      link_whatsapp: form.link_whatsapp || null,
      instagram: form.instagram || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('nutricionistas')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Atualizado! ✅',
          description: 'Nutricionista atualizado com sucesso',
        });
      } else {
        const { error } = await supabase
          .from('nutricionistas')
          .insert([payload]);

        if (error) throw error;

        toast({
          title: 'Cadastrado! 🎉',
          description: 'Nutricionista adicionado com sucesso',
        });
      }

      setIsDialogOpen(false);
      fetchNutricionistas();
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Excluir ${nome}?`)) return;

    try {
      const { error } = await supabase
        .from('nutricionistas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Excluído',
        description: 'Nutricionista removido',
      });

      fetchNutricionistas();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir',
        variant: 'destructive',
      });
    }
  };

  const filteredNutricionistas = nutricionistas.filter(n =>
    n.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar nutricionista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus size={18} />
          Novo
        </Button>
      </div>

      {/* Stats */}
      <div className="card-soft mb-4">
        <p className="text-2xl font-bold text-foreground">{nutricionistas.length}</p>
        <p className="text-sm text-muted-foreground">Nutricionistas cadastrados</p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNutricionistas.map((nutri) => (
            <div key={nutri.id} className="card-soft">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👩‍⚕️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{nutri.nome}</p>
                  <p className="text-xs text-muted-foreground">{nutri.crn}</p>
                  <p className="text-xs text-primary">{nutri.especialidade}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin size={12} />
                    <span>{nutri.bairro ? `${nutri.bairro}, ` : ''}{nutri.cidade}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {nutri.link_whatsapp && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Phone size={10} /> WhatsApp
                      </span>
                    )}
                    {nutri.instagram && (
                      <span className="text-xs text-purple-600 flex items-center gap-1">
                        <Instagram size={10} /> {nutri.instagram}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditDialog(nutri)}
                    className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80"
                  >
                    <Pencil size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(nutri.id, nutri.nome)}
                    className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredNutricionistas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum nutricionista encontrado
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Nutricionista' : 'Novo Nutricionista'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Nome completo *
              </label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Dra. Maria Silva"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                CRN *
              </label>
              <Input
                value={form.crn}
                onChange={(e) => setForm({ ...form, crn: e.target.value })}
                placeholder="CRN-3 12345"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Especialidade *
              </label>
              <Input
                value={form.especialidade}
                onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
                placeholder="Nutrição Materno-Infantil"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Cidade *
                </label>
                <Input
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Bairro
                </label>
                <Input
                  value={form.bairro || ''}
                  onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                  placeholder="Pinheiros"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Link WhatsApp
              </label>
              <Input
                value={form.link_whatsapp || ''}
                onChange={(e) => setForm({ ...form, link_whatsapp: e.target.value })}
                placeholder="https://wa.me/5511999999999"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Instagram
              </label>
              <Input
                value={form.instagram || ''}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="@nutricionista"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NutricionistasManager;
