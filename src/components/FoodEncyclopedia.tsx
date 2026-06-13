import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getFoodImage } from "@/lib/foodImages";
import { Baby, AlertTriangle, ChefHat, Sparkles, Scissors, ShieldCheck } from "lucide-react";

export interface EncyclopediaFood {
  nome: string;
  emoji?: string;
  tipo?: string; // proteina | carboidrato | vegetal | fruit
  preparo?: string | null;
  corte_6_9m?: string | null;
  corte_9_12m?: string | null;
  corte_12_mais?: string | null;
}

const tipoBeneficios: Record<string, string> = {
  proteina:
    "Fonte essencial de proteína, ferro e zinco — fundamentais para o crescimento, desenvolvimento muscular e cerebral do bebê.",
  carboidrato:
    "Fornece a energia que o bebê precisa para brincar, explorar e crescer. Combine com proteína e legume para um prato equilibrado.",
  vegetal:
    "Rico em vitaminas, minerais e fibras. Ajuda na imunidade, digestão e no desenvolvimento do paladar do bebê.",
  fruit:
    "Fonte natural de vitaminas, fibras e açúcares naturais. Excelente para lanches e introdução de novos sabores.",
};

const tipoCuidados: Record<string, string[]> = {
  proteina: [
    "Cozinhe muito bem — nunca ofereça cru ou mal passado.",
    "Retire todos os ossos, peles duras e gordura visível.",
    "Observe sinais de alergia (vermelhidão, inchaço, vômito) ao introduzir.",
  ],
  carboidrato: [
    "Ofereça em texturas adequadas para a idade — evite pedaços duros.",
    "Não acrescente sal, açúcar ou temperos industrializados.",
    "Cuidado com a temperatura: sempre teste antes de servir.",
  ],
  vegetal: [
    "Higienize bem com água corrente antes de cozinhar.",
    "Cozinhe até ficar macio (esmagável entre os dedos).",
    "Cuidado com formatos redondos — corte sempre ao meio para evitar engasgo.",
  ],
  fruit: [
    "Sempre lave bem antes de descascar e cortar.",
    "Frutas redondas (uva, tomate-cereja) devem ser cortadas em 4 partes.",
    "Observe reações alérgicas, especialmente em frutas cítricas e morango.",
  ],
};

const tipoLabel: Record<string, string> = {
  proteina: "Proteína",
  carboidrato: "Carboidrato",
  vegetal: "Legume",
  fruit: "Fruta",
};

interface Props {
  food: EncyclopediaFood | null;
  onClose: () => void;
}

const FoodEncyclopedia = ({ food, onClose }: Props) => {
  if (!food) return null;
  const img = getFoodImage(food.nome);
  const emoji = food.emoji || "🍽️";
  const tipo = food.tipo || "vegetal";
  const beneficios = tipoBeneficios[tipo] || tipoBeneficios.vegetal;
  const cuidados = tipoCuidados[tipo] || tipoCuidados.vegetal;

  return (
    <Dialog open={!!food} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/10 to-transparent px-6 pt-8 pb-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-3xl bg-white shadow-md flex items-center justify-center overflow-hidden mb-3 border border-border/40">
              {img ? (
                <img
                  src={img}
                  alt={food.nome}
                  width={256}
                  height={256}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">{emoji}</span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">{food.nome}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                <ShieldCheck size={12} />
                Liberado a partir dos 6 meses
              </span>
              {tipoLabel[tipo] && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary text-foreground text-[11px] font-bold">
                  {tipoLabel[tipo]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-6">
          <Tabs defaultValue="guia" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-secondary/70 rounded-2xl">
              <TabsTrigger value="guia" className="text-[11px] font-bold rounded-xl py-2">
                💡 Guia
              </TabsTrigger>
              <TabsTrigger value="cortar" className="text-[11px] font-bold rounded-xl py-2">
                🔪 Cortar
              </TabsTrigger>
              <TabsTrigger value="cuidados" className="text-[11px] font-bold rounded-xl py-2">
                ⚠️ Cuidados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guia" className="mt-4 space-y-3">
              <div className="rounded-2xl bg-primary/8 border border-primary/15 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles size={14} className="text-primary" />
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Por que oferecer?
                  </p>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{beneficios}</p>
              </div>
              {food.preparo && (
                <div className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ChefHat size={14} className="text-foreground/70" />
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Como introduzir
                    </p>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{food.preparo}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cortar" className="mt-4 space-y-2">
              <div className="flex items-center gap-2 px-1 mb-1">
                <Scissors size={14} className="text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Cortes seguros por idade
                </p>
              </div>
              {food.corte_6_9m && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/8 border border-primary/15">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Baby size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-wide">
                      6-9 meses · formato palito
                    </p>
                    <p className="text-sm text-foreground/90 mt-0.5">{food.corte_6_9m}</p>
                  </div>
                </div>
              )}
              {food.corte_9_12m && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-accent/10 border border-accent/20">
                  <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Baby size={16} className="text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-accent-foreground uppercase tracking-wide">
                      9-12 meses · pinça
                    </p>
                    <p className="text-sm text-foreground/90 mt-0.5">{food.corte_9_12m}</p>
                  </div>
                </div>
              )}
              {food.corte_12_mais && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary border border-border">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Baby size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                      +12 meses · pedaços
                    </p>
                    <p className="text-sm text-foreground/90 mt-0.5">{food.corte_12_mais}</p>
                  </div>
                </div>
              )}
              {!food.corte_6_9m && !food.corte_9_12m && !food.corte_12_mais && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Informações de corte em breve.
                </p>
              )}
            </TabsContent>

            <TabsContent value="cuidados" className="mt-4">
              <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-orange-600" />
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    Atenção e segurança
                  </p>
                </div>
                <ul className="space-y-2">
                  {cuidados.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90 leading-relaxed">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-3 px-2">
                Em caso de qualquer reação, suspenda o alimento e consulte o pediatra.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodEncyclopedia;
