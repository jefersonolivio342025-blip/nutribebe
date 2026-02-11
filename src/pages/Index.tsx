import { useState } from "react";
import { Coffee, Sun, Apple, Moon, Clock, ChevronRight, Utensils } from "lucide-react";

const categorias = [
  { id: "manha", nome: "Lanche Manhã", icon: <Coffee className="w-5 h-5" /> },
  { id: "almoco", nome: "Almoço", icon: <Sun className="w-5 h-5" /> },
  { id: "tarde", nome: "Lanche Tarde", icon: <Apple className="w-5 h-5" /> },
  { id: "jantar", nome: "Jantar", icon: <Moon className="w-5 h-5" /> },
];

const receitasData = {
  manha: [
    {
      nome: "Papinha de Abacate com Banana",
      ingredientes: ["1/2 abacate pequeno", "1 banana prata madura"],
      preparo: "Amasse bem a banana e o abacate separadamente. Misture os dois até formar uma pasta homogênea.",
    },
  ],
  almoco: [
    {
      nome: "Purê de Abóbora com Carne",
      ingredientes: ["1 fatia de abóbora", "2 colheres de carne moída", "Salsinha"],
      preparo: "Cozinhe a abóbora e amasse. Misture com a carne já refogada.",
    },
  ],
  tarde: [
    {
      nome: "Muffin de Maçã e Aveia",
      ingredientes: ["1 maçã ralada", "1 ovo", "3 col. aveia", "Canela"],
      preparo: "Misture tudo e leve ao forno (180°C) por 15 min em forminhas.",
    },
    {
      nome: "Iogurte com Pera",
      ingredientes: ["2 col. iogurte natural", "1/2 pera cozida"],
      preparo: "Amasse a pera cozida e misture ao iogurte frio.",
    },
  ],
  jantar: [
    {
      nome: "Sopa de Mandioquinha com Frango",
      ingredientes: ["1 mandioquinha", "30g frango desfiado", "Azeite"],
      preparo: "Cozinhe a mandioquinha, amasse e misture ao frango e azeite.",
    },
  ],
};

const Index = () => {
  const [tabAtiva, setTabAtiva] = useState("manha");

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-10">
      {/* Header do App */}
      <div className="bg-primary p-8 rounded-b-[2.5rem] shadow-md mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Utensils className="text-white w-6 h-6" />
          <h1 className="text-2xl font-black text-white italic">NutriBebê Pro</h1>
        </div>
        <p className="text-white/90 text-center text-sm font-medium">Cardápio Diário Inteligente</p>
      </div>

      {/* Navegação de Categorias */}
      <div className="flex justify-between px-4 mb-8 gap-2">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setTabAtiva(cat.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl w-full transition-all ${
              tabAtiva === cat.id
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-white text-slate-400 border border-slate-100"
            }`}
          >
            {cat.icon}
            <span className="text-[9px] font-black mt-2 uppercase tracking-tighter">{cat.nome}</span>
          </button>
        ))}
      </div>

      {/* Lista de Receitas */}
      <div className="px-5 space-y-6">
        {receitasData[tabAtiva as keyof typeof receitasData].map((rec, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 animate-in fade-in slide-in-from-bottom-4"
          >
            <h3 className="text-xl font-black text-slate-800 mb-4">{rec.nome}</h3>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Ingredientes</span>
                <ul className="mt-2 space-y-1">
                  {rec.ingredientes.map((ing, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" /> {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Preparo</span>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed italic">{rec.preparo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
