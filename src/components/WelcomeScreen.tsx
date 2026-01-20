import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Baby, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  userId: string;
  onComplete: () => void;
}

const WelcomeScreen = ({ userId, onComplete }: WelcomeScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`nutriBebe_welcome_${userId}`);
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, [userId]);

  const handleComplete = () => {
    localStorage.setItem(`nutriBebe_welcome_${userId}`, 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-primary/95 to-primary flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Sparkles className="h-12 w-12 text-white" />
      </div>
      <div className="absolute top-20 right-8 opacity-20">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <div className="absolute bottom-32 left-6 opacity-20">
        <Sparkles className="h-6 w-6 text-white" />
      </div>

      <div className="max-w-md w-full text-center space-y-8">
        {/* Baby icon */}
        <div className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-lg">
            <span className="text-6xl">👶🥗</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Bem-vinda ao NutriBebê PRO! 🥗👶
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            Sua jornada para uma introdução alimentar segura e tranquila começa agora. 
            Você acaba de garantir o <span className="font-semibold">Acesso Vitalício</span>, 
            o que significa que estaremos com você em cada nova descoberta do seu bebê.
          </p>
        </div>

        {/* Features list */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 space-y-4 text-left">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-2 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Segurança</h3>
              <p className="text-white/80 text-sm">
                Guia de cortes BLW para evitar o medo do engasgo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-2 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Praticidade</h3>
              <p className="text-white/80 text-sm">
                Cardápios inteligentes e lista de compras que economizam seu tempo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-2 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Apoio</h3>
              <p className="text-white/80 text-sm">
                Nossa rede de nutris parceiras à sua disposição.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleComplete}
          size="lg"
          className="w-full bg-white text-primary hover:bg-white/90 font-bold text-lg py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Baby className="mr-2 h-5 w-5" />
          Começar minha jornada!
        </Button>

        {/* Footer text */}
        <p className="text-white/60 text-xs">
          Feito com 💚 para mamães como você
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
