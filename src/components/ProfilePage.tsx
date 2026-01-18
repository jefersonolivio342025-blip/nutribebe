import { Baby, Heart, Shield, Sparkles, ChevronRight, Crown, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, profile, isPremium, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const features = [
    {
      icon: Baby,
      title: 'Guia BLW Completo',
      description: 'Cortes seguros para cada idade',
      color: 'bg-sage-light text-sage-dark',
    },
    {
      icon: Heart,
      title: 'Receitas Favoritas',
      description: 'Salve suas preferidas',
      color: 'bg-terracotta-light text-terracotta',
    },
    {
      icon: Shield,
      title: 'Alergias e Restrições',
      description: 'Configure as preferências',
      color: 'bg-lavender-light text-lavender',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Até logo! 👋',
      description: 'Você saiu da sua conta',
    });
    navigate('/auth');
  };

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          Meu Perfil 👤
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configurações e preferências
        </p>
      </header>

      {/* Profile Card */}
      <div className="card-elevated mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center">
            <span className="text-3xl">👶</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-foreground">
              {profile?.nome || 'Bebê'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <button className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Premium Card */}
      <div className={`card-elevated mb-6 ${
        isPremium 
          ? 'bg-gradient-to-br from-sage-light to-sage border-2 border-sage-dark/20'
          : 'bg-gradient-to-br from-terracotta-light to-peach border-2 border-terracotta/20'
      }`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center">
            <Crown size={24} className={isPremium ? 'text-sage-dark' : 'text-terracotta'} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">
              {isPremium ? 'Plano Premium ⭐' : 'Plano Gratuito'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isPremium 
                ? 'Acesso completo a todos os dias da semana'
                : 'Acesso ao cardápio de domingo a terça-feira'
              }
            </p>
            {!isPremium && (
              <button className="paywall-cta w-full">
                <Sparkles size={18} />
                Assinar Plano Completo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <h2 className="section-title">Configurações</h2>
      <div className="space-y-3">
        {features.map((feature) => (
          <button
            key={feature.title}
            className="card-soft w-full flex items-center gap-4 hover:shadow-card transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}>
              <feature.icon size={22} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">{feature.title}</p>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="card-soft w-full flex items-center gap-4 mt-3 hover:shadow-card transition-shadow text-destructive"
      >
        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
          <LogOut size={22} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold">Sair da Conta</p>
          <p className="text-sm text-muted-foreground">Encerrar sessão</p>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </button>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          NutriBebê v1.0 • Feito com 💚
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
