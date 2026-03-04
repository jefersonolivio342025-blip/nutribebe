import { useState } from "react";
import { ChefHat, Clock, Heart, ChevronDown, Download, Bookmark, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";

interface Tip {
  emoji: string;
  title: string;
  text: string;
}

interface Topic {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  tips: Tip[];
}

const topics: Topic[] = [
  {
    id: "kitchen",
    icon: <ChefHat size={22} />,
    title: "Organização da Cozinha",
    subtitle: "Ambiente prático e seguro",
    color: "hsl(var(--sage))",
    tips: [
      { emoji: "🧊", title: "Congele em porções", text: "Prepare purês e sopas no fim de semana e congele em forminhas de gelo de silicone. Cada cubo equivale a ~30 ml — ideal para controlar porções." },
      { emoji: "🏷️", title: "Etiquete tudo", text: "Cole etiquetas com o nome do alimento e a data de preparo. Alimentos caseiros duram até 3 meses no congelador." },
      { emoji: "📦", title: "Kit de emergência", text: "Tenha sempre à mão: banana, abacate e aveia. São alimentos que não precisam de preparo e salvam qualquer refeição." },
      { emoji: "🍽️", title: "Canto do bebê", text: "Reserve uma gaveta baixa com os utensílios do bebê (pratinho, colher, babador). Facilita a rotina e incentiva a autonomia." },
    ],
  },
  {
    id: "prep",
    icon: <Clock size={22} />,
    title: "Preparação Antecipada",
    subtitle: "Ganhe tempo na semana",
    color: "hsl(var(--terracotta))",
    tips: [
      { emoji: "📅", title: "Prep Day", text: "Escolha 1 dia da semana para cozinhar legumes no vapor: batata-doce, cenoura, abobrinha e brócolos. Armazene em potes de vidro na geladeira por até 3 dias." },
      { emoji: "🥩", title: "Proteínas prontas", text: "Cozinhe frango desfiado e carne moída em lote. Tempere apenas com alho e cebola (sem sal até 1 ano). Congele em porções individuais." },
      { emoji: "🍌", title: "Frutas pré-cortadas", text: "Lave e corte frutas como manga, melão e pera no formato BLW. Guarde em potes herméticos na geladeira para o lanche." },
      { emoji: "⏰", title: "Rotina de 15 min", text: "Todas as noites, separe 15 minutos para deixar o prato do dia seguinte montado ou semi-pronto. Isso reduz o stress da manhã." },
    ],
  },
  {
    id: "expectations",
    icon: <Heart size={22} />,
    title: "Gestão de Expectativas",
    subtitle: "Menos pressão, mais conexão",
    color: "hsl(var(--lavender))",
    tips: [
      { emoji: "🧠", title: "Nem sempre vai comer", text: "É normal o bebê recusar alimentos 10-15 vezes antes de aceitar. Não force — ofereça novamente noutro dia, de forma diferente." },
      { emoji: "🎨", title: "A sujeira faz parte", text: "Tocar, amassar e espalhar comida é como o bebê aprende sobre texturas. Coloque um tapete lavável debaixo da cadeirinha." },
      { emoji: "📉", title: "Quantidade não é tudo", text: "Até 1 ano, o leite (materno ou fórmula) continua sendo a principal fonte de nutrientes. A comida é complementar — relaxe sobre quantidade." },
      { emoji: "💪", title: "Você está fazendo bem", text: "Não existe mãe perfeita. Se o bebê está crescendo e explorar comida com curiosidade, está no caminho certo." },
    ],
  },
];

const RotinaSemCaos = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Removido dos favoritos" : "Guardado nos favoritos ⭐",
      description: saved ? "As dicas foram removidas." : "Pode aceder a qualquer momento.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "PDF a caminho 📄",
      description: "O guia será descarregado em breve.",
    });

    // Simple text-based PDF generation
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Rotina Sem Caos - NutriBebê", 20, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Guia prático para a introdução alimentar", 20, 33);

      let y = 48;
      topics.forEach((topic) => {
        if (y > 260) { doc.addPage(); y = 25; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(topic.title, 20, y);
        y += 8;
        topic.tips.forEach((tip) => {
          if (y > 265) { doc.addPage(); y = 25; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(`${tip.emoji} ${tip.title}`, 24, y);
          y += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          const lines = doc.splitTextToSize(tip.text, 160);
          doc.text(lines, 24, y);
          y += lines.length * 5 + 6;
        });
        y += 6;
      });

      doc.save("rotina-sem-caos.pdf");
    });
  };

  return (
    <div className="page-container relative">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Guia Prático</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground leading-tight">Rotina Sem Caos</h1>
        <p className="text-sm text-muted-foreground mt-1">Dicas reais para simplificar a introdução alimentar.</p>
      </div>

      {/* Accordion Cards */}
      <Accordion type="multiple" className="space-y-3">
        {topics.map((topic, idx) => (
          <AccordionItem
            key={topic.id}
            value={topic.id}
            className="border-none animate-slide-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="card-elevated overflow-hidden !p-0">
              <AccordionTrigger className="px-5 py-4 hover:no-underline gap-3">
                <div className="flex items-center gap-3 text-left">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${topic.color}20`, color: topic.color }}
                  >
                    {topic.icon}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-[15px] leading-tight">{topic.title}</p>
                    <p className="text-xs text-muted-foreground">{topic.subtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-0">
                <div className="space-y-3">
                  {topic.tips.map((tip, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/60">
                      <span className="text-xl shrink-0 mt-0.5">{tip.emoji}</span>
                      <div>
                        <p className="font-bold text-foreground text-sm">{tip.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{tip.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>

      {/* FAB */}
      <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={handleSave}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90"
          style={{ background: saved ? "hsl(var(--primary))" : "hsl(var(--card))", color: saved ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }}
          aria-label="Guardar nos favoritos"
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleDownload}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 bg-primary text-primary-foreground"
          aria-label="Descarregar PDF"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};

export default RotinaSemCaos;
