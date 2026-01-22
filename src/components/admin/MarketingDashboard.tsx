import { useState, useEffect } from 'react';
import { Loader2, Users, TrendingUp, Clock, Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProfileData {
  id: string;
  user_id: string;
  nome: string | null;
  is_premium: boolean;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
}

interface KPIs {
  totalUsers: number;
  premiumUsers: number;
  conversionRate: number;
  pendingSales: number;
}

interface CampaignData {
  name: string;
  usuarios: number;
}

interface SourceData {
  name: string;
  value: number;
}

const COLORS = ['#8B9A6B', '#A4B87C', '#6B8B5C', '#C4D4A5', '#5A7A4A', '#D4E4B5'];

const MarketingDashboard = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profilesRes, emailsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, user_id, nome, is_premium, created_at, utm_source, utm_medium, utm_campaign, utm_content')
          .order('created_at', { ascending: false }),
        supabase.functions.invoke('get-user-emails'),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      setProfiles(profilesRes.data || []);

      if (emailsRes.data?.emails) {
        setUserEmails(emailsRes.data.emails);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate KPIs
  const kpis: KPIs = {
    totalUsers: profiles.length,
    premiumUsers: profiles.filter(p => p.is_premium).length,
    conversionRate: profiles.length > 0 
      ? Math.round((profiles.filter(p => p.is_premium).length / profiles.length) * 100) 
      : 0,
    pendingSales: profiles.filter(p => !p.is_premium).length,
  };

  // Aggregate campaign data
  const campaignData: CampaignData[] = Object.entries(
    profiles.reduce((acc, profile) => {
      const campaign = profile.utm_campaign || 'Direto';
      acc[campaign] = (acc[campaign] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, usuarios]) => ({ name, usuarios }))
    .sort((a, b) => b.usuarios - a.usuarios)
    .slice(0, 6);

  // Aggregate source data for premium users
  const sourceData: SourceData[] = Object.entries(
    profiles
      .filter(p => p.is_premium)
      .reduce((acc, profile) => {
        const source = profile.utm_source || 'Direto';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Recent leads (last 10)
  const recentLeads = profiles.slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-secondary to-background border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{kpis.totalUsers}</p>
                <p className="text-xs text-muted-foreground">Total Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{kpis.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Taxa Conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sage-light/50 to-background border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{kpis.premiumUsers}</p>
                <p className="text-xs text-muted-foreground">Vendas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-100/50 to-background border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-200/50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{kpis.pendingSales}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            Usuários por Campanha
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {campaignData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={campaignData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={80}
                  tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="usuarios" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
              Nenhum dado de campanha disponível
            </div>
          )}
        </CardContent>
      </Card>

      {/* Source Pie Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Origem das Vendas (UTM Source)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value} vendas`, 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
              Nenhuma venda registrada ainda
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Leads Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Leads Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">{lead.is_premium ? '⭐' : '👤'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {lead.nome || userEmails[lead.user_id]?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmails[lead.user_id] || 'Email não disponível'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    lead.is_premium 
                      ? 'bg-primary/20 text-primary font-medium' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {lead.is_premium ? 'Premium' : 'Free'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}

            {recentLeads.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Nenhum lead encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Detalhes por Anúncio (utm_content)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentLeads.filter(l => l.utm_content).slice(0, 5).map((lead) => (
              <div key={lead.id} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {lead.nome || 'Usuário'}
                    </p>
                    <p className="text-xs text-primary truncate">
                      📢 {lead.utm_content}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    lead.is_premium 
                      ? 'bg-primary/20 text-primary font-medium' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {lead.is_premium ? '💰' : '⏳'}
                  </span>
                </div>
              </div>
            ))}

            {!recentLeads.some(l => l.utm_content) && (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Nenhum lead com utm_content registrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingDashboard;
