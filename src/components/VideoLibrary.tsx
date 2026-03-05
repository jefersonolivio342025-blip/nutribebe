import { useState, useCallback } from 'react';
import { Search, Play, Clock, Filter } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
}

const CATEGORIES = ['Todos', 'Alimentação', 'Segurança', 'Cortes', 'Receitas', 'Comportamento', 'Dicas'];

const ALL_VIDEOS: Video[] = [
  // --- Vídeos existentes ---
  { id: "4oBnVNaN0jU", title: "Cortes Seguros BLW", description: "Aprenda os cortes ideais para cada fase do bebê", category: "Segurança", duration: "8:32" },
  { id: "X6z438GiVVc", title: "Como oferecer Laranja", description: "Técnica segura para servir laranja ao bebê", category: "Cortes", duration: "3:45" },
  { id: "1TeGyXsZA3U", title: "Introdução Alimentar: Começo", description: "Tudo o que você precisa saber para começar", category: "Alimentação", duration: "12:10" },
  { id: "UCIjFewVtGc", title: "Como oferecer Batata", description: "Formas de preparar batata para o bebê", category: "Cortes", duration: "4:20" },
  // --- Novos vídeos placeholder ---
  { id: "dQw4w9WgXcQ", title: "Sinais de Engasgo vs. GAG", description: "Entenda a diferença e saiba quando agir", category: "Segurança", duration: "6:15" },
  { id: "exemplo1", title: "Papinha de Abóbora com Frango", description: "Receita nutritiva e fácil para o almoço", category: "Receitas", duration: "5:40" },
  { id: "exemplo2", title: "Bolinho de Banana e Aveia", description: "Lanche saudável sem açúcar para bebês", category: "Receitas", duration: "4:10" },
  { id: "exemplo3", title: "Bebê Recusa Comida: O que Fazer?", description: "Dicas para lidar com a seletividade alimentar", category: "Comportamento", duration: "7:55" },
  { id: "exemplo4", title: "Como Cortar Manga para BLW", description: "Corte seguro de manga para cada idade", category: "Cortes", duration: "3:20" },
  { id: "exemplo5", title: "Alimentos Proibidos até 1 Ano", description: "Lista do que evitar na introdução alimentar", category: "Alimentação", duration: "9:00" },
  { id: "exemplo6", title: "Risoto de Legumes para Bebê", description: "Receita completa com proteína e vegetais", category: "Receitas", duration: "6:30" },
  { id: "exemplo7", title: "Higiene dos Alimentos", description: "Como higienizar frutas e verduras corretamente", category: "Segurança", duration: "4:50" },
  { id: "exemplo8", title: "Introdução do Ovo ao Bebê", description: "Quando e como oferecer ovo com segurança", category: "Alimentação", duration: "5:15" },
  { id: "exemplo9", title: "Birra na Hora da Refeição", description: "Estratégias para manter a calma à mesa", category: "Comportamento", duration: "8:20" },
  { id: "exemplo10", title: "Suco Natural: Pode ou Não?", description: "O que dizem os pediatras sobre sucos", category: "Dicas", duration: "3:55" },
  { id: "exemplo11", title: "Cadeirão e Postura Correta", description: "Como posicionar o bebê para comer seguro", category: "Segurança", duration: "5:00" },
  { id: "exemplo12", title: "Mingau de Aveia sem Leite", description: "Opção para bebês com APLV", category: "Receitas", duration: "4:30" },
  { id: "exemplo13", title: "Autonomia na Alimentação", description: "Incentive o bebê a comer sozinho", category: "Comportamento", duration: "6:45" },
  { id: "exemplo14", title: "Como Oferecer Peixe ao Bebê", description: "Tipos seguros e formas de preparo", category: "Cortes", duration: "5:30" },
  { id: "exemplo15", title: "Lanches para Passeio", description: "Ideias práticas para levar na bolsa", category: "Dicas", duration: "4:00" },
  { id: "exemplo16", title: "Congelamento de Papinhas", description: "Organize a semana com preparo antecipado", category: "Dicas", duration: "7:10" },
];

const VideoThumbnail = ({ video }: { video: Video }) => {
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback(() => setPlaying(true), []);

  if (playing) {
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
        title={video.title}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }

  return (
    <button onClick={handlePlay} className="relative w-full h-full group cursor-pointer bg-muted">
      <img
        loading="lazy"
        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
          <Play size={24} className="text-foreground ml-1" fill="currentColor" />
        </div>
      </div>
      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
        <Clock size={10} />
        {video.duration}
      </span>
    </button>
  );
};

const VideoLibrary = ({ searchQuery: externalSearch }: { searchQuery?: string }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [internalSearch, setInternalSearch] = useState('');
  const searchQuery = externalSearch ?? internalSearch;
  const filtered = ALL_VIDEOS.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24">
      {/* Category Filters */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filtrar</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-foreground mb-1">Guia em Vídeo</h2>
        <p className="text-xs text-muted-foreground mb-4">{filtered.length} vídeos disponíveis</p>
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((video) => (
            <div key={video.id} className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
              <div className="aspect-video">
                <VideoThumbnail video={video} />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{video.category}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> {video.duration}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{video.description}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Nenhum vídeo encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoLibrary;
