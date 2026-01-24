import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import babyImage from '@/assets/baby-eating.png';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');
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

const formFieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3
    }
  }
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; whatsapp?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; whatsapp?: boolean }>({});

  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Real-time email validation
  const validateEmail = (value: string) => {
    if (!touched.email) return;
    try {
      emailSchema.parse(value);
      setErrors(prev => ({ ...prev, email: undefined }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, email: e.errors[0].message }));
      }
    }
  };

  // Real-time password validation
  const validatePassword = (value: string) => {
    if (!touched.password) return;
    try {
      passwordSchema.parse(value);
      setErrors(prev => ({ ...prev, password: undefined }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, password: e.errors[0].message }));
      }
    }
  };

  // Real-time whatsapp validation
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
    validateWhatsapp(formatted);
  };

  const handleWhatsappBlur = () => {
    setTouched(prev => ({ ...prev, whatsapp: true }));
    validateWhatsapp(whatsapp);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    validatePassword(password);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; whatsapp?: string } = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    // Validate WhatsApp only on signup
    if (!isLogin) {
      try {
        whatsappSchema.parse(whatsapp);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.whatsapp = e.errors[0].message;
        }
      }
    }

    setTouched({ email: true, password: true, whatsapp: !isLogin });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: 'destructive',
              title: 'Erro ao entrar',
              description: 'Email ou senha incorretos',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Erro ao entrar',
              description: error.message,
            });
          }
        } else {
          toast({
            title: 'Bem-vindo! 👶',
            description: 'Login realizado com sucesso',
          });
          navigate('/');
        }
      } else {
        // Clean WhatsApp number before sending (remove formatting)
        const cleanWhatsapp = whatsapp.replace(/\D/g, '');
        const { error } = await signUp(email, password, nome, cleanWhatsapp);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: 'destructive',
              title: 'Erro ao cadastrar',
              description: 'Este email já está cadastrado',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Erro ao cadastrar',
              description: error.message,
            });
          }
        } else {
          // Track Facebook Pixel CompleteRegistration event
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'CompleteRegistration');
          }
          toast({
            title: 'Conta criada! 🎉',
            description: 'Bem-vindo ao NutriBebê',
          });
          navigate('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
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
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground mt-2 text-base"
        >
          Alimentação saudável para o seu bebê
        </motion.p>
      </motion.header>

      {/* Form */}
      <main className="flex-1 px-6 py-6 relative z-10">
        <motion.div 
          className="card-elevated max-w-sm mx-auto backdrop-blur-sm bg-card/95"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Tabs */}
          <div className="flex rounded-xl bg-secondary p-1.5 mb-6 relative">
            <motion.div 
              className="absolute inset-y-1.5 rounded-lg bg-card shadow-soft"
              initial={false}
              animate={{ 
                x: isLogin ? 4 : '100%',
                width: 'calc(50% - 8px)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors relative z-10 ${
                isLogin ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors relative z-10 ${
                !isLogin ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="nome-field"
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
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
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="whatsapp-field"
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
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
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Usaremos para enviar seu guia e suporte nutricional
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
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="seu@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all duration-300 ${
                    errors.email ? 'border-destructive' : touched.email && !errors.email ? 'border-primary/50' : 'border-transparent focus:border-primary/50'
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    className="text-xs text-destructive mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-sm font-medium text-foreground mb-2 block">
                Senha
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all duration-300 ${
                    errors.password ? 'border-destructive' : touched.password && !errors.password ? 'border-primary/50' : 'border-transparent focus:border-primary/50'
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    className="text-xs text-destructive mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {errors.password}
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
              transition={{ delay: 0.6 }}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="p-6 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-muted-foreground">
          NutriBebê v1.0 • Feito com 💚
        </p>
      </motion.footer>
    </div>
  );
};

export default Auth;
