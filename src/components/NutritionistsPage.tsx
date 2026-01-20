import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Instagram, Lock, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';

interface Nutricionista {
  id: string;
  nome: string;
  crn: string;
  especialidade: string;
  cidade: string;
  bairro: string | null;
  link_whatsapp: string | null;
  instagram: string | null;
}

const NutritionistsPage = () => {
  const { isPremium } = useAuth();
  const [nutricionistas, setNutricionistas] = useState<Nutricionista[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNutricionistas();
  }, []);

  const fetchNutricionistas = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('nutricionistas')
      .select('*')
      .order('cidade', { ascending: true });

    if (!error && data) {
      setNutricionistas(data);
    }
    setIsLoading(false);
  };

  const filteredNutricionistas = nutricionistas.filter(nutri =>
    nutri.cidade.toLowerCase().includes(searchCity.toLowerCase()) ||
    (nutri.bairro && nutri.bairro.toLowerCase().includes(searchCity.toLowerCase()))
  );

  const visibleNutricionistas = isPremium 
    ? filteredNutricionistas 
    : filteredNutricionistas.slice(0, 1);

  const lockedCount = isPremium ? 0 : Math.max(0, filteredNutricionistas.length - 1);

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          Encontrar Nutri 👩‍⚕️
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Profissionais especializados em introdução alimentar perto de você
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por cidade ou bairro..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="pl-12 h-12 rounded-2xl bg-card border-none shadow-soft"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filteredNutricionistas.length === 0 ? (
        <div className="card-elevated text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Nenhum nutricionista encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente buscar por outra cidade
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Visible nutritionists */}
          {visibleNutricionistas.map((nutri) => (
            <div key={nutri.id} className="card-elevated">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👩‍⚕️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{nutri.nome}</h3>
                  <p className="text-xs text-muted-foreground">{nutri.crn}</p>
                  <p className="text-sm text-primary font-medium mt-1">{nutri.especialidade}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin size={14} />
                    <span>{nutri.bairro ? `${nutri.bairro}, ` : ''}{nutri.cidade}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                {nutri.link_whatsapp && (
                  <a
                    href={nutri.link_whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
                  >
                    <Phone size={16} />
                    Agendar Consulta
                  </a>
                )}
                {nutri.instagram && (
                  <a
                    href={`https://instagram.com/${nutri.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  >
                    <Instagram size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Locked nutritionists paywall */}
          {!isPremium && lockedCount > 0 && (
            <div className="card-elevated bg-gradient-to-br from-terracotta-light to-peach border-2 border-terracotta/20">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-terracotta" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  +{lockedCount} Nutricionista{lockedCount > 1 ? 's' : ''} Disponíve{lockedCount > 1 ? 'is' : 'l'}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Desbloqueie toda a rede de profissionais especializados em introdução alimentar da sua região.
                </p>
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
            </div>
          )}
        </div>
      )}

      {/* Footer note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          💚 Profissionais verificados pela equipe NutriBebê
        </p>
      </div>
    </div>
  );
};

export default NutritionistsPage;
