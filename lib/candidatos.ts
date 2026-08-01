export type Candidato = {
  slug: string;
  nome: string;
  cargo: string;
  disputaPor?: string; // por onde disputa o cargo (ex: "Rio de Janeiro")
  anoEleicao?: string; // ano em que vai ser eleito (ex: "2026")
  canais?: string; // redes sociais / Instagram
  tomComunicacao?: string; // como ele se comunica (vem da análise de perfil)
  local: string;
  proximidade: number; // 0 = longe (cinza), 1 = pertinho (amarelo)
  bio: string;
  tint: string; // fundo do avatar
  foto?: string; // foto de perfil (data URL), quando o candidato monta o próprio perfil
  desde?: string; // na guilda desde quando (porta-voz)
};

// eleição de 2026 é geral (estadual/federal) — sem prefeito/vereador, que são municipais (2028)
export const CARGOS_POLITICOS = [
  "Deputado Estadual",
  "Deputado Federal",
  "Senador",
  "Governador",
] as const;

// vocabulário de tom já usado nos briefs de pauta (lib/pautas.ts) — reaproveitado
// aqui pra análise de perfil virar o tom padrão das missões desse candidato
export const TONS_COMUNICACAO = [
  "Direto e firme",
  "Sóbrio",
  "Empático",
  "Ágil",
  "Leve",
] as const;

// perfil que o próprio candidato monta no primeiro login (sem backend real ainda,
// fica salvo no navegador dele) — sobrepõe os dados fake de CANDIDATOS
const PERFIL_LOCAL_KEY = "confraria_perfil_candidato";

export type PerfilCandidatoLocal = {
  nome: string; // chave interna — sempre PORTA_VOZ_ATUAL.nome, não é o que aparece na tela
  nomeExibicao?: string; // o nome de verdade que o candidato digitou, é esse que aparece
  foto?: string;
  cargo?: string;
  disputaPor?: string;
  anoEleicao?: string;
  canais?: string;
  tomComunicacao?: string;
  local?: string;
  bio?: string;
};

export function salvarPerfilCandidatoLocal(dados: PerfilCandidatoLocal) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PERFIL_LOCAL_KEY, JSON.stringify(dados));
}

export function lerPerfilCandidatoLocal(): PerfilCandidatoLocal | null {
  if (typeof window === "undefined") return null;
  const bruto = window.localStorage.getItem(PERFIL_LOCAL_KEY);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as PerfilCandidatoLocal;
  } catch {
    return null;
  }
}

export function temPerfilCandidatoCompleto(nome: string): boolean {
  const local = lerPerfilCandidatoLocal();
  return local?.nome === nome;
}

// aplica o perfil salvo localmente (se for do mesmo candidato) por cima do dado fake
export function aplicarPerfilLocal(cand: Candidato): Candidato {
  const local = lerPerfilCandidatoLocal();
  if (!local || local.nome !== cand.nome) return cand;
  return {
    ...cand,
    nome: local.nomeExibicao?.trim() || cand.nome,
    foto: local.foto ?? cand.foto,
    cargo: local.cargo ?? cand.cargo,
    disputaPor: local.disputaPor ?? cand.disputaPor,
    anoEleicao: local.anoEleicao ?? cand.anoEleicao,
    canais: local.canais ?? cand.canais,
    tomComunicacao: local.tomComunicacao ?? cand.tomComunicacao,
    local: local.local ?? cand.local,
    bio: local.bio ?? cand.bio,
  };
}

export const CANDIDATOS: Record<string, Candidato> = {
  Busnelo: {
    slug: "busnelo",
    nome: "Busnelo",
    cargo: "Candidato",
    local: "Petrópolis, RJ",
    proximidade: 0.9,
    bio: "Segurança pública e comunidade. Fala direta, muito conteúdo de rua.",
    tint: "linear-gradient(135deg,#f4ce1f,#a9840e)",
    desde: "fevereiro de 2026",
  },
  "Marcia Lima": {
    slug: "marcia-lima",
    nome: "Marcia Lima",
    cargo: "Candidata",
    local: "Nova Friburgo, RJ",
    proximidade: 0.5,
    bio: "Saúde e educação. Tom sóbrio, gosta de entrevista e depoimento.",
    tint: "linear-gradient(135deg,#3a3a42,#12121a)",
  },
};

export function getCandidato(nome: string): Candidato {
  return CANDIDATOS[nome];
}

export function getCandidatoPorSlug(slug: string): Candidato | undefined {
  return Object.values(CANDIDATOS).find((c) => c.slug === slug);
}

export function iniciais(nome: string) {
  return nome
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// cor do indicador de proximidade: amarelo (perto) -> cinza escuro (longe)
export function corProximidade(p: number) {
  const pct = Math.round(Math.min(1, Math.max(0, p)) * 100);
  return `color-mix(in srgb, #f4ce1f ${pct}%, #5a5a64)`;
}
