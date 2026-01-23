import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Send, CheckCircle2, XCircle, TrendingUp, Eye, MousePointer, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EmailLog {
  id: string;
  created_at: string;
  email_to: string;
  email_type: string;
  subject: string;
  status: string;
  resend_id: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  converted_at: string | null;
}

interface Profile {
  id: string;
  is_premium: boolean;
  created_at: string;
}

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const EmailDashboard = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [emailsResult, profilesResult] = await Promise.all([
        supabase
          .from('email_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500),
        supabase
          .from('profiles')
          .select('id, is_premium, created_at')
      ]);

      if (emailsResult.data) {
        setEmailLogs(emailsResult.data);
      }
      if (profilesResult.data) {
        setProfiles(profilesResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const totalEmailsSent = emailLogs.filter(e => e.status === 'sent').length;
  const totalEmailsFailed = emailLogs.filter(e => e.status === 'failed').length;
  const totalRecoveryEmails = emailLogs.filter(e => e.email_type === 'recovery').length;
  
  // Open tracking metrics
  const emailsOpened = emailLogs.filter(e => e.opened_at).length;
  const openRate = totalEmailsSent > 0 ? ((emailsOpened / totalEmailsSent) * 100).toFixed(1) : '0';
  
  // Click tracking metrics
  const emailsClicked = emailLogs.filter(e => e.clicked_at).length;
  const clickRate = emailsOpened > 0 ? ((emailsClicked / emailsOpened) * 100).toFixed(1) : '0';
  
  const premiumUsers = profiles.filter(p => p.is_premium);
  const totalUsers = profiles.length;
  const conversionRate = totalUsers > 0 ? ((premiumUsers.length / totalUsers) * 100).toFixed(1) : '0';

  // Emails by type for pie chart
  const emailsByType = emailLogs.reduce((acc, email) => {
    const type = email.email_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emailTypeData = Object.entries(emailsByType).map(([name, value]) => ({
    name: name === 'recovery' ? 'Recuperação' : name === 'welcome' ? 'Boas-vindas' : name === 'premium' ? 'Premium' : name,
    value,
  }));

  // Emails per day for last 14 days
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 13 - i));
    return {
      date,
      dateStr: format(date, 'dd/MM', { locale: ptBR }),
      sent: 0,
      failed: 0,
    };
  });

  emailLogs.forEach(email => {
    const emailDate = startOfDay(new Date(email.created_at));
    const dayData = last14Days.find(d => d.date.getTime() === emailDate.getTime());
    if (dayData) {
      if (email.status === 'sent') {
        dayData.sent++;
      } else {
        dayData.failed++;
      }
    }
  });

  // Recent emails table
  const recentEmails = emailLogs.slice(0, 10);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <Send className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Enviados</p>
                <p className="text-lg font-bold text-primary">{totalEmailsSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Abertos</p>
                <p className="text-lg font-bold text-blue-600">{emailsOpened}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                <Percent className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Taxa Abertura</p>
                <p className="text-lg font-bold text-purple-600">{openRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 rounded-lg">
                <MousePointer className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Cliques</p>
                <p className="text-lg font-bold text-amber-600">{emailsClicked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Conversão</p>
                <p className="text-lg font-bold text-emerald-600">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-500/20 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Falhas</p>
                <p className="text-lg font-bold text-red-600">{totalEmailsFailed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Emails per Day */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Emails Enviados (14 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={last14Days}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="dateStr" 
                  tick={{ fontSize: 11 }} 
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sent" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2 }}
                  name="Enviados"
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2 }}
                  name="Falhas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emails by Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emailTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={emailTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {emailTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                Nenhum email enviado ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Emails Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEmails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Aberto</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmails.map((email) => (
                    <tr key={email.id} className="border-b border-muted/50">
                      <td className="py-2 px-2 text-xs text-muted-foreground">
                        {format(new Date(email.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                      </td>
                      <td className="py-2 px-2 font-medium truncate max-w-[120px]">
                        {email.email_to}
                      </td>
                      <td className="py-2 px-2">
                        <Badge variant="secondary" className="text-[10px] px-1.5">
                          {email.email_type === 'recovery' ? '🔄' : 
                           email.email_type === 'welcome' ? '👋' :
                           email.email_type === 'premium' ? '⭐' : email.email_type}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        {email.opened_at ? (
                          <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 text-[10px] px-1.5">
                            <Eye className="h-3 w-3 mr-0.5" />
                            {format(new Date(email.opened_at), 'dd/MM HH:mm', { locale: ptBR })}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {email.status === 'sent' ? (
                          <Badge className="bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30 text-[10px] px-1.5">
                            <CheckCircle2 className="h-3 w-3 mr-0.5" />
                            OK
                          </Badge>
                        ) : email.status === 'pending' ? (
                          <Badge variant="secondary" className="text-[10px] px-1.5">
                            ⏳
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] px-1.5">
                            <XCircle className="h-3 w-3 mr-0.5" />
                            Erro
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum email enviado ainda</p>
              <p className="text-xs mt-1">Os emails aparecerão aqui quando novos usuários se cadastrarem</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
