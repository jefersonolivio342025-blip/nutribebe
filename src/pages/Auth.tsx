import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, ArrowRight, Loader2, Sparkles, Shield, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import babyImage from '@/assets/baby-eating.png';
import { useLeadAuth, getStoredLead } from '@/hooks/useLeadAuth';
import { useToast } from '@/hooks/use-toast';
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
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

  const { registerLead, loading } = useLeadAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already has lead data
  useEffect(() => {
    if (!loading) {
      const lead = getStoredLead();
      if (lead) {
        navigate('/dashboard-usuario');
      }
    }
  }, [loading, navigate]);

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

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value);
    setWhatsapp(formatted);
    if (touched.whatsapp) {
      validateWhatsapp(formatted);
    }
  };

  const validateWhatsapp = (value: string) => {
    try {
      whatsappSchema.parse(value);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors({ whatsapp: e.errors[0].message });
      }
      return false;
    }
  };

  const handleWhatsappBlur = () => {
    setTouched({ whatsapp: true });
    validateWhatsapp(whatsapp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ whatsapp: true });
    if (!validateWhatsapp(whatsapp)) return;

    if (!nome.trim()) {
      toast({
        variant: 'destructive',
        title: 'Nome obrigatório',
        description: 'Por favor, informe o nome do bebê',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerLead(nome.trim(), whatsapp);

      if (result.success) {
        // Track Facebook Pixel Lead event
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead');
        }

        toast({
          title: 'Parabéns! 🎉',
          description: 'Seu guia está sendo liberado...',
        });

        // Small delay for tracking to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to dashboard
        navigate('/dashboard-usuario');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: result.error || 'Erro ao cadastrar. Tente novamente.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

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
        className="p-6 pt-10 text-center relative z-10"
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
            className="w-24 h-24 mx-auto mb-4 rounded-full shadow-elevated ring-4 ring-primary/20"
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

      {/* Form */}
      <main className="flex-1 px-6 py-4 relative z-10">
        <motion.div 
          className="card-elevated max-w-sm mx-auto backdrop-blur-sm bg-card/95"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Headline */}
          <motion.h2 
            className="text-xl font-bold text-foreground text-center mb-6 leading-tight"
            variants={itemVariants}
          >
            Garanta o Guia Prático: Introdução Alimentar Segura e Sem Medo e Evite Engasgos
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Baby Name Field */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome do Bebê
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
                  required
                />
              </div>
            </motion.div>

            {/* WhatsApp Field */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-foreground mb-2 block">
                WhatsApp
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
                  required
                />
              </div>
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="generate-btn w-full"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Gerando seu guia...</span>
                </>
              ) : (
                <>
                  <span>Baixar Guia Grátis</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>

            {/* Trust Badge */}
            <motion.div 
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              variants={itemVariants}
            >
              <Shield size={16} className="text-primary" />
              <span>Seus dados estão seguros. O acesso ao guia é imediato.</span>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div 
            className="mt-6 pt-4 border-t border-border text-center"
            variants={itemVariants}
          >
            <button
              onClick={handleLoginClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <LogIn size={16} />
              Já é cliente Pro? Acesse aqui
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Auth;
