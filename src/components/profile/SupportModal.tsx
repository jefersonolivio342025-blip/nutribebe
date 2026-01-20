import { X, Mail, MessageCircle, HelpCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal = ({ isOpen, onClose }: SupportModalProps) => {
  if (!isOpen) return null;

  const supportOptions = [
    {
      icon: Mail,
      title: 'E-mail',
      description: 'Envie sua dúvida por e-mail',
      action: 'suporte@nutribebe.app',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Fale conosco pelo WhatsApp',
      action: 'wa.me/5511999999999',
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Perguntas frequentes',
      action: 'faq',
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  const faqs = [
    {
      question: 'Como funciona o cardápio semanal?',
      answer: 'O app gera automaticamente um cardápio balanceado com proteína, carboidrato e vegetal para almoço e jantar.',
    },
    {
      question: 'O que é o método BLW?',
      answer: 'Baby-Led Weaning é uma abordagem de introdução alimentar onde o bebê se alimenta sozinho com alimentos em pedaços.',
    },
    {
      question: 'Como alterar as restrições alimentares?',
      answer: 'Vá em Perfil > Alergias e Restrições e selecione as opções desejadas.',
    },
  ];

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5547991158519', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:suporte@nutribebe.app', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-background p-4 border-b border-border flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-foreground">Suporte</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Contact Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Fale Conosco</h3>
            
            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="card-soft w-full flex items-center gap-4 hover:shadow-card transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <MessageCircle size={22} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Fale conosco pelo WhatsApp</p>
              </div>
            </button>

            {/* Email Button */}
            <button
              onClick={handleEmailClick}
              className="card-soft w-full flex items-center gap-4 hover:shadow-card transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Mail size={22} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">E-mail</p>
                <p className="text-sm text-muted-foreground">Envie sua dúvida por e-mail</p>
              </div>
            </button>
          </div>

          {/* FAQ Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <HelpCircle size={18} />
              Perguntas Frequentes
            </h3>
            {faqs.map((faq, index) => (
              <div key={index} className="card-soft">
                <p className="font-medium text-foreground mb-2">{faq.question}</p>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
