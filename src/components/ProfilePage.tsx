import { useState } from 'react';
import { Baby, Heart, Shield, Sparkles, ChevronRight, Crown, LogOut, HelpCircle, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EditProfileModal from './profile/EditProfileModal';
import DietaryRestrictionsModal from './profile/DietaryRestrictionsModal';
import BLWGuideModal from './profile/BLWGuideModal';
import SupportModal from './profile/SupportModal';

const ProfilePage = () => {
  const { user, profile, isPremium, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [dietaryOpen, setDietaryOpen] = useState(false);
  const [blwGuideOpen, setBlwGuideOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const features = [
    {
      icon: Baby,
      title: 'Guia BLW Completo',
      description: 'Cortes seguros para cada idade',
      color: 'bg-sage-light text-sage-dark',
      onClick: () => setBlwGuideOpen(true),
    },
    {
      icon: Edit,
      title: 'Editar Perfil',
      description: 'Alterar dados do bebê e responsável',
      color: 'bg-peach text-terracotta',
      onClick: () => setEditProfileOpen(true),
    },
    {
      icon: Shield,
      title: 'Restrições Alimentares',
      description: profile?.sem_gluten || profile?.aplv || profile?.vegano 
        ? 'Restrições ativas' 
        : 'Configure as preferências',
      color: 'bg-lavender-light text-lavender',
      onClick: () => setDietaryOpen(true),
    },
    {
      icon: HelpCircle,
      title: 'Suporte',
      description: 'Dúvidas e ajuda',
      color: 'bg-secondary text-muted-foreground',
      onClick: () => setSupportOpen(true),
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
      <button 
        onClick={() => setEditProfileOpen(true)}
        className="card-elevated mb-6 w-full text-left hover:shadow-card transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center">
            <span className="text-3xl">👶</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-foreground">
              {profile?.baby_name || profile?.nome || 'Bebê'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
            {profile?.baby_birth_date && (
              <p className="text-xs text-muted-foreground mt-1">
                🎂 {new Date(profile.baby_birth_date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>
      </button>

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
            onClick={feature.onClick}
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

      {/* Modals */}
      <EditProfileModal isOpen={editProfileOpen} onClose={() => setEditProfileOpen(false)} />
      <DietaryRestrictionsModal isOpen={dietaryOpen} onClose={() => setDietaryOpen(false)} />
      <BLWGuideModal isOpen={blwGuideOpen} onClose={() => setBlwGuideOpen(false)} />
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
};

export default ProfilePage;
