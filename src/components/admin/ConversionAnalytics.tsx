import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MousePointer, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ConversionStats {
  total: number;
  today: number;
  last7Days: number;
  bySource: Record<string, number>;
}

interface DailyData {
  date: string;
  label: string;
  cliques: number;
}

const ConversionAnalytics = () => {
  const [stats, setStats] = useState<ConversionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Get all events
      const { data: allEvents, error } = await supabase
        .from('conversion_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const events = allEvents || [];
      const today = startOfDay(new Date());
      const sevenDaysAgo = subDays(today, 7);
      const fourteenDaysAgo = subDays(today, 14);

      // Calculate stats
      const todayEvents = events.filter(e => new Date(e.created_at) >= today);
      const last7DaysEvents = events.filter(e => new Date(e.created_at) >= sevenDaysAgo);

      const bySource: Record<string, number> = {};
      events.forEach(e => {
        bySource[e.source_page] = (bySource[e.source_page] || 0) + 1;
      });

      setStats({
        total: events.length,
        today: todayEvents.length,
        last7Days: last7DaysEvents.length,
        bySource,
      });

      // Calculate daily data for chart (last 14 days)
      const days = eachDayOfInterval({ start: fourteenDaysAgo, end: today });
      const dailyClicks: DailyData[] = days.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const count = events.filter(e => {
          const eventDate = new Date(e.created_at);
          return eventDate >= dayStart && eventDate < dayEnd;
        }).length;

        return {
          date: format(day, 'yyyy-MM-dd'),
          label: format(day, 'dd/MM', { locale: ptBR }),
          cliques: count,
        };
      });

      setDailyData(dailyClicks);
      setRecentEvents(events.slice(0, 10));
    } catch (error) {
      console.error('Error fetching conversion stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sourceLabels: Record<string, string> = {
    today_dashboard: 'Hoje',
    weekly_calendar: 'Calendário',
    profile_page: 'Perfil',
    nutritionists_page: 'Nutricionistas',
    safety_guide_modal: 'Guia de Segurança',
    dashboard: 'Banner Oferta',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-soft text-center">
          <MousePointer className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{stats?.total || 0}</p>
          <p className="text-xs text-muted-foreground">Total de cliques</p>
        </div>
        <div className="card-soft text-center bg-gradient-to-br from-sage-light to-sage">
          <TrendingUp className="h-5 w-5 text-sage-dark mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{stats?.today || 0}</p>
          <p className="text-xs text-muted-foreground">Hoje</p>
        </div>
        <div className="card-soft text-center">
          <BarChart3 className="h-5 w-5 text-terracotta mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{stats?.last7Days || 0}</p>
          <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="card-soft">
        <h3 className="font-bold text-foreground mb-4">Tendência de Cliques (14 dias)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(95, 25%, 55%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(95, 25%, 55%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 10, fill: 'hsl(150, 10%, 45%)' }}
                tickLine={false}
                axisLine={false}
                interval={1}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(150, 10%, 45%)' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(40, 60%, 99%)',
                  border: '1px solid hsl(40, 25%, 88%)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                labelFormatter={(label) => `Data: ${label}`}
                formatter={(value: number) => [`${value} cliques`, 'Cliques']}
              />
              <Area 
                type="monotone" 
                dataKey="cliques" 
                stroke="hsl(95, 25%, 55%)" 
                strokeWidth={2}
                fill="url(#colorCliques)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="card-soft">
        <h3 className="font-bold text-foreground mb-4">Cliques por Origem</h3>
        <div className="space-y-3">
          {stats?.bySource && Object.entries(stats.bySource)
            .sort((a, b) => b[1] - a[1])
            .map(([source, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      {sourceLabels[source] || source}
                    </span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-sage-dark rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          {(!stats?.bySource || Object.keys(stats.bySource).length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              Nenhum clique registrado ainda
            </p>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div className="card-soft">
        <h3 className="font-bold text-foreground mb-4">Últimos Cliques</h3>
        <div className="space-y-2">
          {recentEvents.map((event) => (
            <div 
              key={event.id} 
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {sourceLabels[event.source_page] || event.source_page}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.created_at), "dd/MM HH:mm", { locale: ptBR })}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                event.is_premium 
                  ? 'bg-sage-light text-sage-dark' 
                  : 'bg-terracotta-light text-terracotta'
              }`}>
                {event.is_premium ? 'Premium' : 'Free'}
              </span>
            </div>
          ))}
          {recentEvents.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Nenhum evento registrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversionAnalytics;
