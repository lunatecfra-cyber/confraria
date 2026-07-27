export type Candidato = {
  slug: string;
  nome: string;
  cargo: string;
  local: string;
  proximidade: number; // 0 = longe (cinza), 1 = pertinho (amarelo)
  bio: string;
  tint: string; // fundo do avatar
  desde?: string; // na guilda desde quando (porta-voz)
};

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
  return (
    CANDIDATOS[nome] ?? {
      slug: nome.toLowerCase().replace(/\s+/g, "-"),
      nome,
      cargo: "Candidato",
      local: "—",
      proximidade: 0.3,
      bio: "",
      tint: "linear-gradient(135deg,#2a2a32,#0e0e12)",
    }
  );
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
  const perto = { r: 0xf4, g: 0xce, b: 0x1f };
  const longe = { r: 0x5a, g: 0x5a, b: 0x64 };
  const q = Math.min(1, Math.max(0, p));
  const mix = (a: number, b: number) => Math.round(b + (a - b) * q);
  return `rgb(${mix(perto.r, longe.r)},${mix(perto.g, longe.g)},${mix(perto.b, longe.b)})`;
}
