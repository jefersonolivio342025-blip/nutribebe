import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Baby, Sparkles, X } from 'lucide-react';

interface WelcomeScreenProps {
  userId: string;
  isInstalled: boolean;
  onComplete: () => void;
}

const WelcomeScreen = ({ userId, isInstalled, onComplete }: WelcomeScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if installed as PWA and hasn't seen welcome screen yet
    const hasSeenWelcome = localStorage.getItem(`nutriBebe_welcome_${userId}`);
    if (isInstalled && !hasSeenWelcome) {
      setIsVisible(true);
    }
  }, [userId, isInstalled]);

  const handleComplete = () => {
    localStorage.setItem(`nutriBebe_welcome_${userId}`, 'true');
    setIsVisible(false);
    onComplete();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 0.2,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 150,
        damping: 10,
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-b from-primary/95 to-primary flex flex-col items-center justify-center p-6 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Close button */}
          <motion.button
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            onClick={handleComplete}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5 text-white" />
          </motion.button>

          {/* Decorative sparkles */}
          <motion.div
            className="absolute top-10 left-10"
            variants={sparkleVariants}
          >
            <Sparkles className="h-12 w-12 text-white" />
          </motion.div>
          <motion.div
            className="absolute top-20 right-8"
            variants={sparkleVariants}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-6"
            variants={sparkleVariants}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <motion.div
            className="absolute bottom-48 right-12"
            variants={sparkleVariants}
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>

          <div className="max-w-md w-full text-center space-y-8">
            {/* Baby icon */}
            <motion.div className="flex justify-center" variants={iconVariants}>
              <motion.div
                className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-6xl">👶🥗</span>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div className="space-y-3" variants={itemVariants}>
              <h1 className="text-3xl font-bold text-white leading-tight">
                Bem-vinda ao NutriBebê PRO! 🥗👶
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                Sua jornada para uma introdução alimentar segura e tranquila começa agora. 
                Você acaba de garantir o <span className="font-semibold">Acesso Vitalício</span>, 
                o que significa que estaremos com você em cada nova descoberta do seu bebê.
              </p>
            </motion.div>

            {/* Features list */}
            <motion.div
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 space-y-4 text-left"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-start gap-4"
                variants={featureVariants}
              >
                <motion.div
                  className="bg-white/20 rounded-full p-2 mt-0.5"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Segurança</h3>
                  <p className="text-white/80 text-sm">
                    Guia de cortes BLW para evitar o medo do engasgo.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                variants={featureVariants}
              >
                <motion.div
                  className="bg-white/20 rounded-full p-2 mt-0.5"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Praticidade</h3>
                  <p className="text-white/80 text-sm">
                    Cardápios inteligentes e lista de compras que economizam seu tempo.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                variants={featureVariants}
              >
                <motion.div
                  className="bg-white/20 rounded-full p-2 mt-0.5"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Apoio</h3>
                  <p className="text-white/80 text-sm">
                    Nossa rede de nutris parceiras à sua disposição.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-white/90 font-bold text-lg py-6 rounded-xl shadow-lg"
                >
                  <Baby className="mr-2 h-5 w-5" />
                  Começar minha jornada!
                </Button>
              </motion.div>
            </motion.div>

            {/* Footer text */}
            <motion.p
              className="text-white/60 text-xs"
              variants={itemVariants}
            >
              Feito com 💚 para mamães como você
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
