import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Calendar, 
  ShoppingCart, 
  Shield, 
  Users,
  Sparkles,
  Baby
} from 'lucide-react';

interface OnboardingScreenProps {
  userId: string;
  onComplete: () => void;
}

interface OnboardingStep {
  id: number;
  emoji: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
}

const steps: OnboardingStep[] = [
  {
    id: 0,
    emoji: '👶🥗',
    title: 'Bem-vinda ao NutriBebê PRO!',
    description: 'Sua jornada para uma introdução alimentar segura e tranquila começa agora. Você garantiu o Acesso Vitalício!',
    icon: <Baby className="h-8 w-8" />,
    highlight: 'Acesso Vitalício',
  },
  {
    id: 1,
    emoji: '📅',
    title: 'Cardápios Semanais Inteligentes',
    description: 'Gere cardápios personalizados para a semana toda com apenas um clique. Nosso algoritmo evita repetições e garante variedade nutricional.',
    icon: <Calendar className="h-8 w-8" />,
    highlight: 'Variedade garantida',
  },
  {
    id: 2,
    emoji: '🛒',
    title: 'Lista de Compras Automática',
    description: 'Sua lista de compras é gerada automaticamente com base no cardápio. Exporte em PDF ou compartilhe no WhatsApp!',
    icon: <ShoppingCart className="h-8 w-8" />,
    highlight: 'Praticidade total',
  },
  {
    id: 3,
    emoji: '🔒',
    title: 'Guias de Segurança BLW',
    description: 'Aprenda os cortes seguros para cada idade (6-9m, 9-12m, 12+). Diga adeus ao medo do engasgo com nossos guias ilustrados.',
    icon: <Shield className="h-8 w-8" />,
    highlight: 'Segurança em primeiro lugar',
  },
  {
    id: 4,
    emoji: '👩‍⚕️',
    title: 'Rede de Nutricionistas',
    description: 'Conecte-se com nutricionistas materno-infantis parceiras da sua região para um acompanhamento personalizado.',
    icon: <Users className="h-8 w-8" />,
    highlight: 'Apoio profissional',
  },
];

const OnboardingScreen = ({ userId, onComplete }: OnboardingScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`nutriBebe_onboarding_${userId}`);
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, [userId]);

  const handleComplete = () => {
    localStorage.setItem(`nutriBebe_onboarding_${userId}`, 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
      },
    },
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-b from-primary/95 to-primary flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {/* Close/Skip button */}
          <motion.button
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors z-10"
            onClick={handleSkip}
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
            className="absolute top-16 left-8 opacity-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            className="absolute top-32 right-12 opacity-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pt-16 pb-4">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-white w-8'
                    : index < currentStep
                    ? 'bg-white/60 w-2'
                    : 'bg-white/30 w-2'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full max-w-md text-center space-y-6"
              >
                {/* Icon/Emoji */}
                <motion.div
                  className="flex justify-center"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 shadow-lg">
                    <span className="text-7xl">{step.emoji}</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  className="text-2xl md:text-3xl font-bold text-white leading-tight px-4"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {step.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  className="text-white/90 text-lg leading-relaxed px-4"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {step.description}
                </motion.p>

                {/* Highlight badge */}
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {step.icon}
                  <span className="text-white font-medium">{step.highlight}</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-primary/50 to-transparent">
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">
              {/* Previous button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: currentStep > 0 ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="text-white hover:bg-white/20 disabled:opacity-0"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Voltar
                </Button>
              </motion.div>

              {/* Next/Finish button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 max-w-[200px]"
              >
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-white/90 font-bold text-lg py-6 rounded-xl shadow-lg"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Baby className="mr-2 h-5 w-5" />
                      Começar!
                    </>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Spacer for alignment when back button is hidden */}
              {currentStep === 0 && <div className="w-[88px]" />}
            </div>

            {/* Skip text */}
            {currentStep < steps.length - 1 && (
              <motion.p
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={handleSkip}
                  className="text-white/60 text-sm hover:text-white/80 transition-colors"
                >
                  Pular introdução
                </button>
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingScreen;
