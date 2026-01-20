import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Droplets, Snowflake, AlertTriangle, Utensils, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyGuideModal = ({ isOpen, onClose }: SafetyGuideModalProps) => {
  const { isPremium } = useAuth();

  const topics = [
    {
      icon: Droplets,
      title: 'Higiene dos Alimentos',
      color: 'bg-blue-100 text-blue-600',
      content: [
        '🧼 Lave sempre as mãos antes de preparar os alimentos do bebé.',
        '🥬 Frutas e legumes: lave em água corrente e deixe de molho em solução de água com vinagre (1 colher por litro) por 15 minutos.',
        '🍳 Mantenha utensílios e superfícies sempre limpos e secos.',
        '🧽 Troque esponjas frequentemente e lave os panos de prato diariamente.',
      ],
    },
    {
      icon: Snowflake,
      title: 'Conservação Correta',
      color: 'bg-cyan-100 text-cyan-600',
      content: [
        '❄️ Frigorífico: a comida preparada dura até 3 dias em recipiente fechado.',
        '🧊 Congelador: pode guardar porções por até 30 dias. Etiquete com a data!',
        '🔥 Descongelar: sempre no frigorífico na noite anterior ou no micro-ondas. Nunca à temperatura ambiente.',
        '⚠️ Nunca recongele alimentos já descongelados.',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Engasgo vs Reflexo de GAG',
      color: 'bg-amber-100 text-amber-600',
      content: [
        '😮 O reflexo de GAG é normal e protege o bebé. Parece que está a engasgar, mas está a aprender.',
        '✅ No GAG: o bebé fica vermelho, faz caretas, pode tossir, mas consegue respirar.',
        '🚨 No ENGASGO: lábios ficam azuis, não consegue chorar ou tossir, fica em silêncio.',
        '📞 Aprenda manobras de desengasgo e tenha sempre o número de emergência à mão.',
      ],
    },
    {
      icon: Utensils,
      title: 'Utensílios Recomendados',
      color: 'bg-green-100 text-green-600',
      content: [
        '🥄 Colheres de silicone: macias para as gengivas sensíveis.',
        '🍽️ Pratos com ventosa: ficam presos à mesa e evitam acidentes.',
        '🥛 Copos de treino: com alças e tampa antiderrame.',
        '🪑 Cadeirão seguro: com cinto de 5 pontos e bandeja removível.',
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            🛡️ Guia de Segurança e Higiene
          </DialogTitle>
        </DialogHeader>

        {isPremium ? (
          <div className="space-y-4 mt-4">
            {topics.map((topic) => (
              <div key={topic.title} className="card-soft">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${topic.color} flex items-center justify-center`}>
                    <topic.icon size={20} />
                  </div>
                  <h3 className="font-bold text-foreground">{topic.title}</h3>
                </div>
                <ul className="space-y-2">
                  {topic.content.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                💚 Conteúdo exclusivo NutriBebê PRO
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-terracotta-light flex items-center justify-center mx-auto mb-4">
              <Lock size={36} className="text-terracotta" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Conteúdo Exclusivo NutriBebê PRO
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm mx-auto">
              Adquira seu Acesso Vitalício agora e tenha acesso ao guia completo de segurança e higiene alimentar.
            </p>
            
            <div className="space-y-2 mb-6 text-left max-w-xs mx-auto">
              {topics.map((topic) => (
                <div key={topic.title} className="flex items-center gap-2 text-muted-foreground">
                  <Lock size={14} />
                  <span className="text-sm">{topic.title}</span>
                </div>
              ))}
            </div>

            <a 
              href="https://pay.kiwify.com.br/vrYjxfv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="paywall-cta inline-flex"
            >
              <Sparkles size={20} />
              Liberar Acesso Vitalício ⭐
            </a>
            <p className="text-xs text-muted-foreground mt-3">
              Compra segura. Acesso vitalício sem mensalidades.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SafetyGuideModal;
