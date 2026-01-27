import { X, Star, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversionTracking } from '@/hooks/useConversionTracking';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProModal = ({ isOpen, onClose }: ProModalProps) => {
  const { handlePaywallClick } = useConversionTracking();

  const handleGetPro = () => {
    handlePaywallClick('pro_modal', 'Quero Acesso Pro Agora');
    window.open('https://pay.kiwify.com.br/vrYjxFv', '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="bg-card rounded-3xl p-6 shadow-elevated relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={28} className="text-primary-foreground" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-2">
                  Desbloqueie o Cardápio Completo
                </h2>
                
                <p className="text-3xl font-extrabold text-primary mb-4">
                  R$ 29,90
                </p>

                {/* Benefits */}
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      📅
                    </div>
                    <span className="text-sm font-medium text-foreground">7 dias de cardápio completo</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      🛒
                    </div>
                    <span className="text-sm font-medium text-foreground">Lista de compras automática</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      ⏱️
                    </div>
                    <span className="text-sm font-medium text-foreground">Receitas de 5 minutos</span>
                  </div>
                </div>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    4.9/5 - Mais de 500 mães satisfeitas
                  </span>
                </div>

                {/* Guarantee */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <Shield size={16} className="text-primary" />
                  <span>Garantia de 7 Dias - Risco Zero</span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleGetPro}
                  className="paywall-cta w-full"
                >
                  <Sparkles size={20} />
                  Quero Acesso Pro Agora
                </button>

                <p className="text-xs text-muted-foreground mt-3">
                  Compra 100% segura via Kiwify
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProModal;
