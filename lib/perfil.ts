import type { Formato } from "@/lib/pautas";

// mesmos cortes da coluna gerada "nivel" em supabase/schema.sql — se mudar
// aqui, mudar lá também
export type Nivel = "Aprendiz" | "Oficial" | "Artífice" | "Mestre-Artesão";

export const NIVEIS: { nome: Nivel; minimo: number }[] = [
  { nome: "Aprendiz", minimo: 0 },
  { nome: "Oficial", minimo: 10 },
  { nome: "Artífice", minimo: 30 },
  { nome: "Mestre-Artesão", minimo: 60 },
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
  nota: number | null; // null = ainda não foi avaliado (não é nota zero)
  nivel?: Nivel; // vem calculado do banco a partir de entregues
  reputacao: number;
  streak: number; // dias seguidos ativo (entregou ou interagiu)
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
  streak: 5,
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

export type Desafio = {
  id: string;
  titulo: string;
  descricao: string;
  xp: number;
  dificuldade: 1 | 2 | 3;
  cumprido: boolean;
};

// desafios de engajamento do dia — NÃO confundir com "Missão" (que é a pauta/trabalho em si)
export const DESAFIOS_HOJE: Desafio[] = [
  {
    id: "d1",
    titulo: "Entregue uma missão hoje",
    descricao: "Termine e entregue qualquer pauta que você já reservou.",
    xp: 40,
    dificuldade: 2,
    cumprido: false,
  },
  {
    id: "d2",
    titulo: "Mantenha a sequência",
    descricao: "Acesse a Oficina Amarela hoje pra não perder o streak.",
    xp: 10,
    dificuldade: 1,
    cumprido: true,
  },
  {
    id: "d3",
    titulo: "Suba no ranking",
    descricao: "Entregue com qualidade — cada aprovação soma XP.",
    xp: 25,
    dificuldade: 2,
    cumprido: false,
  },
];

export type EditorRanking = {
  apelido: string;
  nivel: Nivel;
  reputacao: number;
  entregues: number;
  streak: number;
};

// dados fake pro ranking — jr.eneias é o EDITOR_ATUAL (mesmos números de PERFIL_EDITOR)
export const EDITORES: EditorRanking[] = [
  { apelido: "duda.corte", nivel: "Artífice", reputacao: 810, entregues: 34, streak: 12 },
  { apelido: "gui.frames", nivel: "Artífice", reputacao: 705, entregues: 31, streak: 3 },
  { apelido: "jr.eneias", nivel: "Oficial", reputacao: 340, entregues: 12, streak: 5 },
  { apelido: "bia.cortez", nivel: "Oficial", reputacao: 290, entregues: 11, streak: 8 },
  { apelido: "theo.edits", nivel: "Oficial", reputacao: 205, entregues: 9, streak: 1 },
  { apelido: "manu.rc", nivel: "Aprendiz", reputacao: 60, entregues: 3, streak: 0 },
];
