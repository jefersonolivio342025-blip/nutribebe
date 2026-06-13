// Maps food names (PT-BR, normalized) to realistic photo imports.
// Falls back to undefined → component shows emoji instead.

import banana from "@/assets/foods/banana.jpg";
import maca from "@/assets/foods/maca.jpg";
import abacate from "@/assets/foods/abacate.jpg";
import brocolis from "@/assets/foods/brocolis.jpg";
import cenoura from "@/assets/foods/cenoura.jpg";
import ovo from "@/assets/foods/ovo.jpg";
import frango from "@/assets/foods/frango.jpg";
import batataDoce from "@/assets/foods/batata-doce.jpg";
import arroz from "@/assets/foods/arroz.jpg";
import feijao from "@/assets/foods/feijao.jpg";
import mamao from "@/assets/foods/mamao.jpg";
import batata from "@/assets/foods/batata.jpg";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const map: Record<string, string> = {
  banana: banana,
  "maca": maca,
  "maca cozida": maca,
  abacate: abacate,
  brocolis: brocolis,
  cenoura: cenoura,
  ovo: ovo,
  "ovo cozido": ovo,
  frango: frango,
  "frango desfiado": frango,
  "batata doce": batataDoce,
  "batata-doce": batataDoce,
  arroz: arroz,
  feijao: feijao,
  "feijao preto": feijao,
  mamao: mamao,
  batata: batata,
};

export const getFoodImage = (name: string): string | undefined => {
  return map[normalize(name)];
};
