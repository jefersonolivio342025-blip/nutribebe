import { useState } from 'react';
import { Phone, User, ArrowRight, Loader2, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import babyImage from '@/assets/baby-eating.png';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

const whatsappSchema = z.string().min(14, 'WhatsApp inválido').max(15, 'WhatsApp inválido');

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const formFieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
};

const Auth = () => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ whatsapp?: string }>({});
  const [touched, setTouched] = useState<{ whatsapp?: boolean }>({});

  const { toast } = useToast();

  // Format WhatsApp with Brazilian mask (00) 00000-0000
  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers.length > 0 ? `(${numbers}` : '';
    }
    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validateWhatsapp = (value: string) => {
    if (!touched.whatsapp) return;
    try {
      whatsappSchema.parse(value);
      setErrors(prev => ({ ...prev, whatsapp: undefined }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, whatsapp: e.errors[0].message }));
      }
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value);
    setWhatsapp(formatted);
    validateWhatsapp(formatted);
  };

  const handleWhatsappBlur = () => {
    setTouched(prev => ({ ...prev, whatsapp: true }));
    validateWhatsapp(whatsapp);
  };

  const validateForm = () => {
    const newErrors: { whatsapp?: string } = {};

    try {
      whatsappSchema.parse(whatsapp);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.whatsapp = e.errors[0].message;
      }
    }

    setTouched({ whatsapp: true });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Clean WhatsApp number before sending (remove formatting)
      const cleanWhatsapp = whatsapp.replace(/\D/g, '');

      // Get UTM params from sessionStorage
      const utmSource = sessionStorage.getItem('utm_source');
      const utmMedium = sessionStorage.getItem('utm_medium');
      const utmCampaign = sessionStorage.getItem('utm_campaign');
      const utmContent = sessionStorage.getItem('utm_content');

      // Insert lead into database
      const { error } = await supabase.from('leads').insert({
        nome: nome || null,
        whatsapp: cleanWhatsapp,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível processar. Tente novamente.',
        });
        return;
      }

      // Track Facebook Pixel Lead event
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead');
      }

      toast({
        title: 'Sucesso! 🎉',
        description: 'Seu guia está abrindo...',
      });

      // Redirect to ebook
      window.location.href = 'https://drive.google.com/file/d/1zLyhp8CXuQSXEgTOcs2coGMZq5BLrXqF/view?usp=drive_link';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="p-6 pt-12 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.img 
            src={babyImage} 
            alt="Bebê comendo" 
            className="w-28 h-28 mx-auto mb-4 rounded-full shadow-elevated ring-4 ring-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-3xl font-extrabold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            NutriBebê
          </h1>
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 relative z-10">
        <motion.div 
          className="card-elevated max-w-sm mx-auto backdrop-blur-sm bg-card/95"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Hero Title */}
          <motion.h2
            className="text-xl font-bold text-center text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Garanta o{' '}
            <span className="text-primary">Guia de Cortes Seguros</span>{' '}
            e Evite Engasgos
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              variants={formFieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome do bebê
              </label>
              <div className="relative group">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:ring-0 focus:border-primary/50 outline-none transition-all duration-300"
                />
              </div>
            </motion.div>

            <motion.div
              variants={formFieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <label className="text-sm font-medium text-foreground mb-2 block">
                WhatsApp <span className="text-destructive">*</span>
              </label>
              <div className="relative group">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  onBlur={handleWhatsappBlur}
                  placeholder="(00) 00000-0000"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all duration-300 ${
                    errors.whatsapp ? 'border-destructive' : touched.whatsapp && !errors.whatsapp ? 'border-primary/50' : 'border-transparent focus:border-primary/50'
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Enviaremos o guia e dicas de alimentação por aqui
              </p>
              <AnimatePresence>
                {errors.whatsapp && (
                  <motion.p 
                    className="text-xs text-destructive mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {errors.whatsapp}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="generate-btn w-full mt-6 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Baixar Guia Grátis</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </>
              )}
            </motion.button>

            <motion.div
              className="flex items-center justify-center gap-1.5 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Shield size={14} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Seus dados estão seguros. O acesso ao guia é imediato após o cadastro.
              </p>
            </motion.div>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="p-6 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-sm text-muted-foreground">
          NutriBebê v1.0 • Feito com 💚
        </p>
      </motion.footer>
    </div>
  );
};

export default Auth;
