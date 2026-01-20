import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Search, Loader2, Users, Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NutricionistasManager from '@/components/admin/NutricionistasManager';
interface UserProfile {
  id: string;
  user_id: string;
  nome: string | null;
  is_premium: boolean;
  is_admin: boolean;
  baby_name: string | null;
  created_at: string;
  email?: string;
}

const Admin = () => {
  const { user, profile, loading, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  // Check if user is admin
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
    if (isAdmin && session) {
      fetchUsers();
      fetchUserEmails();
    }
  }, [isAdmin, session]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchUserEmails = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-user-emails');
      
      if (error) {
        console.error('Error fetching emails:', error);
        return;
      }
      
      if (data?.emails) {
        setUserEmails(data.emails);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    setUpdatingUser(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(u => 
        u.user_id === userId 
          ? { ...u, is_premium: !currentStatus }
          : u
      ));

      toast({
        title: currentStatus ? 'Premium removido' : 'Premium ativado! 🎉',
        description: currentStatus 
          ? 'Usuário agora está no plano gratuito'
          : 'Usuário agora tem acesso completo',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o usuário',
        variant: 'destructive',
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const email = userEmails[u.user_id] || '';
    return (
      u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.baby_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.user_id.includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="page-container">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Painel Admin 👑
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerenciar usuários e nutricionistas
            </p>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="users" className="flex-1 gap-2">
              <Users size={16} />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="nutris" className="flex-1 gap-2">
              <Stethoscope size={16} />
              Nutricionistas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="card-soft">
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total de usuários</p>
              </div>
              <div className="card-soft bg-gradient-to-br from-sage-light to-sage">
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.is_premium).length}
                </p>
                <p className="text-sm text-muted-foreground">Usuários premium</p>
              </div>
            </div>

            {/* Users List */}
            <h2 className="section-title">Usuários ({filteredUsers.length})</h2>
            
            {isLoadingUsers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3 pb-8">
                {filteredUsers.map((userProfile) => (
                  <div 
                    key={userProfile.id}
                    className="card-soft flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center">
                      <span className="text-xl">
                        {userProfile.is_premium ? '⭐' : '👶'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {userProfile.baby_name || userProfile.nome || 'Sem nome'}
                      </p>
                      <p className="text-xs text-primary truncate">
                        {userEmails[userProfile.user_id] || 'Email não disponível'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Criado em: {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {updatingUser === userProfile.user_id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <>
                          <Crown 
                            size={18} 
                            className={userProfile.is_premium ? 'text-sage-dark' : 'text-muted-foreground'} 
                          />
                          <Switch
                            checked={userProfile.is_premium}
                            onCheckedChange={() => togglePremium(userProfile.user_id, userProfile.is_premium)}
                            disabled={updatingUser !== null}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nutris">
            <NutricionistasManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
