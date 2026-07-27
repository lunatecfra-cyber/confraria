import type { Formato } from "@/lib/pautas";

export type Trabalho = {
  id: string;
  titulo: string;
  portaVoz: string;
  formato: Formato;
  reservadaHaHoras: number; // há quantas horas o editor pegou (demo)
  prazoTotalHoras: number; // tempo total dado até a entrega
  etapa: string;
};

// A barra de progresso = % do PRAZO já decorrido (tempo), não trabalho manual.
// Ex.: pegou segunda, entrega quarta (48h). Na terça (24h depois) = 50%.
export const TRABALHOS: Trabalho[] = [
  {
    id: "t1",
    titulo: "Resposta sobre segurança",
    portaVoz: "Busnelo",
    formato: "short",
    reservadaHaHoras: 18,
    prazoTotalHoras: 24, // faltam ~6h · 75% do prazo
    etapa: "Cortando",
  },
  {
    id: "t2",
    titulo: "Entrevista na rádio",
    portaVoz: "Marcia Lima",
    formato: "longo",
    reservadaHaHoras: 28,
    prazoTotalHoras: 48, // faltam ~20h · 58% do prazo
    etapa: "Assistindo o bruto",
  },
];

export const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const PERIODOS = ["Manhã", "Tarde", "Noite"];

// [periodo][dia] — true = livre pra pegar pauta
export const DISPONIBILIDADE_PADRAO: boolean[][] = [
  [false, true, false, true, false, false, false],
  [true, true, true, true, true, false, false],
  [true, false, true, false, true, true, false],
];
