import type { Formato } from "@/lib/pautas";

export type Nivel = "Aspirante" | "Confrade" | "Veterano" | "Mestre";

export const NIVEIS: { nome: Nivel; minimo: number }[] = [
  { nome: "Aspirante", minimo: 0 },
  { nome: "Confrade", minimo: 10 },
  { nome: "Veterano", minimo: 30 },
  { nome: "Mestre", minimo: 60 },
];

export function progressoNivel(entregues: number) {
  let atual = NIVEIS[0];
  let proximo: (typeof NIVEIS)[number] | null = null;
  for (let i = 0; i < NIVEIS.length; i++) {
    if (entregues >= NIVEIS[i].minimo) {
      atual = NIVEIS[i];
      proximo = NIVEIS[i + 1] ?? null;
    }
  }
  if (!proximo) return { atual, proximo: null, pct: 100, faltam: 0 };
  const faixa = proximo.minimo - atual.minimo;
  const feito = entregues - atual.minimo;
  return {
    atual,
    proximo,
    pct: Math.round((feito / faixa) * 100),
    faltam: proximo.minimo - entregues,
  };
}

export type ItemPortfolio = {
  id: string;
  titulo: string;
  formato: Formato;
  portaVoz: string;
  tint: string; // gradiente do thumbnail
};

export type ItemHistorico = {
  id: string;
  titulo: string;
  portaVoz: string;
  data: string;
  resultado: "aprovada" | "reedicao";
};

export type PerfilEditor = {
  apelido: string;
  nome: string;
  headline: string;
  local: string;
  desde: string;
  bio: string;
  entregues: number;
  nota: number;
  reputacao: number;
  portfolio: ItemPortfolio[];
  historico: ItemHistorico[];
  conquistas: { icone: string; nome: string }[];
};

export const PERFIL_EDITOR: PerfilEditor = {
  apelido: "jr.eneias",
  nome: "Jr. Eneias",
  headline: "Editor de vídeo · cortes de impacto",
  local: "Petrópolis, RJ",
  desde: "março de 2026",
  bio: "Corto rápido e no ritmo. Especialidade em short de reação e clipe de fala forte. Gosto de tom direto, legenda bold e áudio limpo.",
  entregues: 12,
  nota: 4.8,
  reputacao: 340,
  portfolio: [
    { id: "v1", titulo: "Resposta sobre segurança", formato: "short", portaVoz: "Busnelo", tint: "linear-gradient(135deg,#f4ce1f,#a9840e)" },
    { id: "v2", titulo: "Clipe da caminhada", formato: "short", portaVoz: "Busnelo", tint: "linear-gradient(135deg,#3a3a42,#12121a)" },
    { id: "v3", titulo: "Entrevista na rádio", formato: "longo", portaVoz: "Marcia Lima", tint: "linear-gradient(135deg,#c79c12,#5a4708)" },
    { id: "v4", titulo: "Bastidores do evento", formato: "short", portaVoz: "Busnelo", tint: "linear-gradient(135deg,#2a2a32,#0e0e12)" },
    { id: "v5", titulo: "Depoimento da feira", formato: "longo", portaVoz: "Marcia Lima", tint: "linear-gradient(135deg,#f3dc9a,#c79c12)" },
    { id: "v6", titulo: "Corte sobre saúde", formato: "short", portaVoz: "Marcia Lima", tint: "linear-gradient(135deg,#1c1c22,#f4ce1f)" },
  ],
  historico: [
    { id: "h1", titulo: "Resposta sobre segurança", portaVoz: "Busnelo", data: "20 jul 2026", resultado: "aprovada" },
    { id: "h2", titulo: "Clipe da caminhada", portaVoz: "Busnelo", data: "16 jul 2026", resultado: "aprovada" },
    { id: "h3", titulo: "Entrevista na rádio", portaVoz: "Marcia Lima", data: "11 jul 2026", resultado: "reedicao" },
    { id: "h4", titulo: "Bastidores do evento", portaVoz: "Busnelo", data: "9 jul 2026", resultado: "aprovada" },
  ],
  conquistas: [
    { icone: "⚡", nome: "Entrega relâmpago" },
    { icone: "🎯", nome: "10 aprovadas seguidas" },
    { icone: "🔥", nome: "Sequência de 5 dias" },
  ],
};
