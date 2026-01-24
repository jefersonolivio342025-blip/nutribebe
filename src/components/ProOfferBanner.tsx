import { Gift, Sparkles } from 'lucide-react';
import { useConversionTracking } from '@/hooks/useConversionTracking';

const ProOfferBanner = () => {
  const { trackConversionClick } = useConversionTracking();

  const handleClick = async () => {
    // Track the banner click event
    await trackConversionClick({
      sourcePage: 'dashboard',
      buttonText: 'Oferta R$ 29,90',
      eventType: 'banner_click',
    });

    // Open checkout in new tab
    window.open('https://pay.kiwify.com.br/vrYjxFv', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full mb-4 p-4 rounded-2xl bg-gradient-to-r from-terracotta to-terracotta-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-pulse-soft"
    >
      <Gift size={20} className="flex-shrink-0" />
      <span className="text-center leading-tight">
        🎁 Libere seu acesso Pro com o Guia de Cortes Seguros por apenas R$ 29,90! Clique aqui para garantir.
      </span>
      <Sparkles size={18} className="flex-shrink-0" />
    </button>
  );
};

export default ProOfferBanner;
