import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Crown, Gift, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadData {
  nome: string;
  whatsapp: string;
  createdAt: string;
}

const LeadDashboard = () => {
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if lead is "logged in" via localStorage
    const storedLead = localStorage.getItem('nutribebe_lead');
    
    if (!storedLead) {
      navigate('/auth');
      return;
    }

    try {
      const parsed = JSON.parse(storedLead);
      setLeadData(parsed);
    } catch {
      navigate('/auth');
    }
  }, [navigate]);

  const handleViewGuide = () => {
    window.open('https://drive.google.com/file/d/1zLyhp8CXuQSXEgTOcs2coGMZq5BLrXqF/view?usp=drive_link', '_blank');
  };

  const handleCheckout = () => {
    // Track Facebook Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout');
    }
    window.open('https://pay.kiwify.com.br/vrYjxFv', '_blank');
  };

  if (!leadData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const babyName = leadData.nome || 'seu bebê';

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-cream)' }}>
      <div className="page-container max-w-md mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-sage-light to-sage flex items-center justify-center">
            <span className="text-4xl">👶</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            Bem-vinda! 💚
          </h1>
          <p className="text-lg text-muted-foreground">
            Este é o cantinho do(a) <span className="font-bold text-primary">{babyName}</span>
          </p>
        </motion.header>

        {/* Guide Access Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-light to-sage flex items-center justify-center">
              <BookOpen className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Seu Guia Grátis</h2>
              <p className="text-sm text-muted-foreground">Cortes seguros para cada idade</p>
            </div>
          </div>
          
          <Button
            onClick={handleViewGuide}
            className="w-full py-6 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 gap-2"
          >
            <BookOpen size={20} />
            Visualizar Guia de Cortes
            <ExternalLink size={16} />
          </Button>
        </motion.div>

        {/* Premium Offer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, hsl(15 55% 60%), hsl(25 65% 65%))',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 opacity-20">
            <Gift size={60} />
          </div>
          <div className="absolute bottom-2 left-2 opacity-20">
            <Crown size={40} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="text-white" size={24} />
              <span className="text-white/90 text-sm font-medium">Oferta Especial</span>
            </div>
            
            <h3 className="text-xl font-extrabold text-white mb-2">
              Garanta o Cardápio Completo
            </h3>
            
            <p className="text-white/90 text-sm mb-4">
              7 dias de refeições prontas, nutritivas e seguras para {babyName} 👶
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/60 line-through text-lg">R$ 67</span>
              <span className="text-3xl font-extrabold text-white">R$ 29,90</span>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full py-6 text-lg font-bold rounded-xl bg-white text-terracotta hover:bg-white/90 gap-2"
              style={{ color: 'hsl(15 55% 45%)' }}
            >
              <Crown size={20} />
              Quero o Cardápio Completo
            </Button>

            <p className="text-center text-white/70 text-xs mt-3">
              ✅ Acesso imediato após a compra
            </p>
          </div>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 card-soft"
        >
          <h3 className="font-bold text-foreground mb-3">O que você recebe:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Cardápio semanal completo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Lista de compras automatizada
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Instruções de preparo passo a passo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Guia de cortes para cada idade
            </li>
          </ul>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-xs text-muted-foreground pb-8"
        >
          <p>NutriBebê © 2025 - Alimentação segura para seu bebê</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default LeadDashboard;
