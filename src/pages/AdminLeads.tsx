import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Search, MessageCircle, Calendar, Phone, Baby, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Lead {
  id: string;
  nome: string | null;
  whatsapp: string;
  created_at: string;
  utm_source: string | null;
  utm_campaign: string | null;
}

const AdminLeads = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  const isAdmin = profile?.is_admin ?? false;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isAdmin) {
      navigate('/');
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar esta página',
        variant: 'destructive',
      });
    }
  }, [user, loading, isAdmin, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchLeads();
    }
  }, [isAdmin]);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os leads',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const formatWhatsApp = (phone: string) => {
    // Format for display: (XX) XXXXX-XXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const generateWhatsAppMessage = (babyName: string | null) => {
    const name = babyName || 'seu bebê';
    const message = `Oi! Aqui é o Miguel do NutriBebê. Vi que você baixou o Guia para o(a) ${name}! 😊 Deu tudo certo com o acesso? Qualquer dúvida sobre a segurança dele(a) na alimentação, estou aqui!`;
    return encodeURIComponent(message);
  };

  const handleSendWelcome = (lead: Lead) => {
    const phone = lead.whatsapp.replace(/\D/g, '');
    // Add Brazil country code if not present
    const fullPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const message = generateWhatsAppMessage(lead.nome);
    const url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${message}`;
    window.open(url, '_blank');
  };

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.nome?.toLowerCase().includes(searchLower) ||
      lead.whatsapp.includes(searchTerm) ||
      lead.utm_source?.toLowerCase().includes(searchLower) ||
      lead.utm_campaign?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/admin')}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-foreground">
              Gestão de Leads 📋
            </h1>
            <p className="text-sm text-muted-foreground">
              {leads.length} leads capturados
            </p>
          </div>
          <Button
            onClick={fetchLeads}
            variant="outline"
            size="icon"
            disabled={isLoadingLeads}
          >
            <RefreshCw size={18} className={isLoadingLeads ? 'animate-spin' : ''} />
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-soft">
            <p className="text-2xl font-bold text-foreground">{leads.length}</p>
            <p className="text-sm text-muted-foreground">Total de Leads</p>
          </div>
          <div className="card-soft">
            <p className="text-2xl font-bold text-primary">
              {leads.filter(l => {
                const today = new Date().toDateString();
                return new Date(l.created_at).toDateString() === today;
              }).length}
            </p>
            <p className="text-sm text-muted-foreground">Leads Hoje</p>
          </div>
          <div className="card-soft">
            <p className="text-2xl font-bold text-foreground">
              {leads.filter(l => l.utm_source).length}
            </p>
            <p className="text-sm text-muted-foreground">Com UTM</p>
          </div>
          <div className="card-soft">
            <p className="text-2xl font-bold text-foreground">
              {new Set(leads.map(l => l.utm_source).filter(Boolean)).size}
            </p>
            <p className="text-sm text-muted-foreground">Fontes</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por nome, WhatsApp ou UTM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Leads Table */}
        {isLoadingLeads ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="card-elevated overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Baby size={16} />
                      Nome do Bebê
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      WhatsApp
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Data
                    </div>
                  </TableHead>
                  <TableHead>UTM</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.nome || <span className="text-muted-foreground italic">Não informado</span>}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatWhatsApp(lead.whatsapp)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      {lead.utm_source ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {lead.utm_source}
                          {lead.utm_campaign && ` / ${lead.utm_campaign}`}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleSendWelcome(lead)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1"
                      >
                        <MessageCircle size={16} />
                        <span className="hidden sm:inline">Enviar Boas-Vindas</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Nenhum lead encontrado para esta busca' : 'Nenhum lead cadastrado ainda'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
