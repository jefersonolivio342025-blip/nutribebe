import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ShoppingCart, Clock, Lock, ExternalLink, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CountdownTimer from '@/components/CountdownTimer';
import ProModal from '@/components/ProModal';
import FloatingSupportButton from '@/components/FloatingSupportButton';
import { getStoredLead } from '@/hooks/useLeadAuth';
import { useViewContentTracking } from '@/hooks/useConversionTracking';

const EBOOK_URL = 'https://drive.google.com/file/d/1zLyhp8CXuQSXEgTOcs2coGMZq5BLrXqF/view?usp=sharing';

const weekDays = [
  { name: 'Segunda', emoji: '🥗', unlocked: true },
  { name: 'Terça', emoji: '🍝', unlocked: true },
  { name: 'Quarta', emoji: '🥘', unlocked: false },
  { name: 'Quinta', emoji: '🍲', unlocked: false },
  { name: 'Sexta', emoji: '🥙', unlocked: false },
  { name: 'Sábado', emoji: '🍛', unlocked: false },
  { name: 'Domingo', emoji: '🥗', unlocked: false },
];

const benefits = [
  {
    icon: Calendar,
    emoji: '📅',
    title: 'Cardápio Completo',
    description: '7 dias de refeições planejadas.',
  },
  {
    icon: ShoppingCart,
    emoji: '🛒',
    title: 'Lista de Compras',
    description: 'Gerada automaticamente para facilitar seu mercado.',
  },
  {
    icon: Clock,
    emoji: '⏱️',
    title: 'Receitas de 5 Min',
    description: 'Pratos nutritivos e ultra-rápidos.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DashboardUsuario = () => {
  const navigate = useNavigate();
  const [showProModal, setShowProModal] = useState(false);
  const [babyName, setBabyName] = useState('seu bebê');

  useViewContentTracking('Dashboard Usuário', 'Freemium');

  useEffect(() => {
    const lead = getStoredLead();
    if (!lead) {
      navigate('/auth');
      return;
    }
    if (lead.nome) {
      setBabyName(lead.nome);
    }
  }, [navigate]);

  const handleLockedClick = () => {
    setShowProModal(true);
  };

  const handleEbookClick = () => {
    window.open(EBOOK_URL, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/30">
      {/* Urgency Banner */}
      <motion.div
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center justify-center gap-2 text-center">
          <Flame size={18} className="animate-pulse" />
          <span className="text-sm font-semibold">
            🔥 OFERTA DE LANÇAMENTO: Plano Pro com 55% OFF termina em{' '}
            <CountdownTimer initialMinutes={15} />
          </span>
        </div>
      </motion.div>

      <div className="px-4 pt-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-2xl font-extrabold text-foreground">
              👶 Bem-vinda!
            </h1>
            <p className="text-lg text-muted-foreground">
              Este é o cantinho do(a) <span className="font-bold text-primary">{babyName}</span>
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3 mb-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {benefit.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* E-book Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleEbookClick}
            className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-lg shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            📚 Baixar Guia de Cortes Seguros
            <ExternalLink size={20} />
          </motion.button>

          {/* Weekly Menu Preview */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-foreground mb-3">
              📅 Cardápio Semanal
            </h2>
            <div className="space-y-3">
              {weekDays.map((day, index) => (
                <motion.div
                  key={day.name}
                  variants={itemVariants}
                  whileTap={!day.unlocked ? { scale: 0.98 } : undefined}
                >
                  <Card
                    onClick={!day.unlocked ? handleLockedClick : undefined}
                    className={`border-none cursor-pointer transition-all ${
                      day.unlocked
                        ? 'shadow-soft'
                        : 'shadow-soft opacity-60 grayscale'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{day.emoji}</span>
                          <div>
                            <h3 className="font-bold text-foreground">{day.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {day.unlocked ? 'Clique para ver as receitas' : 'Conteúdo Pro'}
                            </p>
                          </div>
                        </div>
                        {!day.unlocked && (
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <Lock size={18} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pro CTA */}
          <motion.div variants={itemVariants} className="mt-6">
            <button
              onClick={() => setShowProModal(true)}
              className="paywall-cta w-full"
            >
              🚀 Desbloquear Acesso Pro - R$ 29,90
            </button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Acesso vitalício • Garantia de 7 dias
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Support Button */}
      <FloatingSupportButton />

      {/* Pro Modal */}
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
};

export default DashboardUsuario;
