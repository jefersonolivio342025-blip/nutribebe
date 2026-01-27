import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Users, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Lead {
  id: string;
  nome: string | null;
  whatsapp: string;
  created_at: string;
  utm_source: string | null;
  utm_campaign: string | null;
}

const AdminLeads = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !profile?.is_admin)) {
      navigate('/');
    }
  }, [user, profile, authLoading, navigate]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && profile?.is_admin) {
      fetchLeads();
    }
  }, [user, profile]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWhatsapp = (phone: string) => {
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  const handleSendWhatsApp = (lead: Lead) => {
    const babyName = lead.nome || 'seu bebê';
    const message = encodeURIComponent(
      `Oi! Aqui é a Sara do NutriBebê. Vi que baixou o Guia Prático para o(a) ${babyName}! 😊 Conseguiu ver o guia e as receitas que liberei? Qualquer dúvida, estou aqui!`
    );
    const phone = lead.whatsapp.startsWith('55') ? lead.whatsapp : `55${lead.whatsapp}`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, '_blank');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Painel de Leads</h1>
            <p className="text-sm text-muted-foreground">
              {leads.length} leads cadastrados
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchLeads}
            className="ml-auto"
          >
            <RefreshCw size={18} />
          </Button>
        </div>
      </header>

      <div className="px-4 pt-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="border-none shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                  <p className="text-xs text-muted-foreground">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {leads.filter(l => {
                      const today = new Date().toDateString();
                      return new Date(l.created_at).toDateString() === today;
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        <div className="space-y-3">
          {leads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-none shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">
                        {lead.nome || 'Sem nome'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatWhatsapp(lead.whatsapp)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(lead.created_at)}
                      </p>
                      {(lead.utm_source || lead.utm_campaign) && (
                        <div className="flex gap-2 mt-2">
                          {lead.utm_source && (
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {lead.utm_source}
                            </span>
                          )}
                          {lead.utm_campaign && (
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {lead.utm_campaign}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSendWhatsApp(lead)}
                      className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
                      size="sm"
                    >
                      <MessageCircle size={16} className="mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {leads.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum lead cadastrado ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
