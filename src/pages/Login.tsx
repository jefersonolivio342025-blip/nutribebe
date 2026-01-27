import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import babyImage from '@/assets/baby-eating.png';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch {
      return;
    }

    setIsSubmitting(true);

    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="p-6 pt-10 text-center relative z-10">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <img 
            src={babyImage} 
            alt="Bebê comendo" 
            className="w-20 h-20 mx-auto mb-4 rounded-full shadow-elevated ring-4 ring-primary/20"
          />
        </motion.div>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-extrabold text-foreground">NutriBebê Pro</h1>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <p className="text-muted-foreground mt-2">Acesse sua conta</p>
      </header>

      {/* Form */}
      <main className="flex-1 px-6 py-4 relative z-10">
        <motion.div 
          className="card-elevated max-w-sm mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                  onBlur={() => { setTouched(p => ({...p, email: true})); validateEmail(email); }}
                  placeholder="seu@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all ${
                    errors.email ? 'border-destructive' : 'border-transparent focus:border-primary/50'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Senha</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                  onBlur={() => { setTouched(p => ({...p, password: true})); validatePassword(password); }}
                  placeholder="••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all ${
                    errors.password ? 'border-destructive' : 'border-transparent focus:border-primary/50'
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="generate-btn w-full"
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Back to signup */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <button
              onClick={() => navigate('/auth')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar para cadastro
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
