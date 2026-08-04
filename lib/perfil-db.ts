// Perfil do editor vindo do banco.
//
// Fica AQUI e não em lib/perfil.ts porque aquele arquivo é importado por
// componentes "use client" (fila-pautas, desafios-dia) — puxar o driver do
// Postgres pra lá jogaria o banco dentro do bundle do navegador e quebraria
// o build. lib/perfil.ts continua sendo só tipos + dados de demonstração.
import { sql } from "@/lib/db";
import type { ItemPortfolio, Nivel, PerfilEditor } from "@/lib/perfil";

export type PerfilEditavel = {
  headline: string | null;
  bio: string | null;
  localizacao: string | null;
};

export async function lerPerfilEditavel(userId: number): Promise<PerfilEditavel | null> {
  const [linha] = await sql`
    SELECT headline, bio, localizacao FROM users WHERE id = ${userId}
  `;
  if (!linha) return null;
  return {
    headline: linha.headline ?? null,
    bio: linha.bio ?? null,
    localizacao: linha.localizacao ?? null,
  };
}

export async function salvarPerfilEditavel(
  userId: number,
  dados: { headline?: string; bio?: string; localizacao?: string }
): Promise<void> {
  await sql`
    UPDATE users SET
      headline = ${dados.headline?.trim() || null},
      bio = ${dados.bio?.trim() || null},
      localizacao = ${dados.localizacao?.trim() || null}
    WHERE id = ${userId}
  `;
}

export type OnboardingEditor = {
  nome: string;
  localizacao: string;
  headline: string;
  softwares: string[];
  estilos: string[];
  portfolioLink: string;
  disponibilidade: boolean[][];
  perfilCompleto: boolean;
};

/**
 * Devolve a grade sempre como boolean[][], ou [] se não der.
 * Aceita string porque linhas gravadas antes da correção do sql.json ficaram
 * com JSON duplamente codificado no banco.
 */
function normalizarGrade(valor: unknown): boolean[][] {
  let g = valor;
  if (typeof g === "string") {
    try {
      g = JSON.parse(g);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(g)) return [];
  return g.map((linha) => (Array.isArray(linha) ? linha.map(Boolean) : []));
}

export async function lerOnboardingEditor(userId: number): Promise<OnboardingEditor | null> {
  const [l] = await sql`
    SELECT nome, localizacao, headline, softwares, estilos, portfolio_link,
           disponibilidade, perfil_completo
    FROM users WHERE id = ${userId}
  `;
  if (!l) return null;
  return {
    nome: l.nome ?? "",
    localizacao: l.localizacao ?? "",
    headline: l.headline ?? "",
    softwares: l.softwares ?? [],
    estilos: l.estilos ?? [],
    portfolioLink: l.portfolio_link ?? "",
    disponibilidade: normalizarGrade(l.disponibilidade),
    perfilCompleto: l.perfil_completo ?? false,
  };
}

export async function salvarOnboardingEditor(
  userId: number,
  dados: {
    nome: string;
    localizacao?: string;
    headline?: string;
    softwares?: string[];
    estilos?: string[];
    portfolioLink?: string;
    disponibilidade?: boolean[][];
  }
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const nome = dados.nome.trim();
  if (!nome) return { ok: false, erro: "Digite seu nome." };

  // corta no teto em vez de recusar: o formulário já impede passar disso, e
  // recusar aqui só perderia o resto do que a pessoa preencheu
  const estilos = (dados.estilos ?? []).slice(0, 3);

  await sql`
    UPDATE users SET
      nome = ${nome},
      localizacao = ${dados.localizacao?.trim() || null},
      headline = ${dados.headline?.trim() || null},
      softwares = ${dados.softwares ?? []},
      estilos = ${estilos},
      portfolio_link = ${dados.portfolioLink?.trim() || null},
      -- sql.json e nao JSON.stringify: com a string, o Postgres guardava um
      -- JSON *string* dentro do jsonb (duplamente codificado) e a grade
      -- voltava como texto, nao como array
      disponibilidade = ${sql.json(dados.disponibilidade ?? [])},
      perfil_completo = true
    WHERE id = ${userId}
  `;
  return { ok: true };
}

/** Perfil completo do editor: conta + números + portfólio + conquistas. */
export async function lerPerfilEditor(userId: number): Promise<PerfilEditor | null> {
  const [conta] = await sql`
    SELECT apelido, nome, headline, bio, localizacao, criado_em,
           entregues, reputacao, streak, nota, nivel
    FROM users WHERE id = ${userId}
  `;
  if (!conta) return null;

  const [itens, medalhas] = await Promise.all([
    sql`SELECT id, titulo, formato, porta_voz, tint, link_video
        FROM portfolio WHERE user_id = ${userId} ORDER BY criado_em DESC`,
    sql`SELECT nome, icone FROM conquistas WHERE user_id = ${userId}
        ORDER BY conquistado_em DESC`,
  ]);

  const portfolio: ItemPortfolio[] = itens.map((i) => ({
    id: `pf-${i.id}`,
    titulo: i.titulo,
    formato: i.formato,
    portaVoz: i.porta_voz,
    tint: i.tint ?? "linear-gradient(135deg,#3a3a42,#12121a)",
  }));

  return {
    apelido: conta.apelido,
    nome: conta.nome,
    headline: conta.headline ?? "",
    local: conta.localizacao ?? "",
    desde: new Date(conta.criado_em).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    }),
    bio: conta.bio ?? "",
    entregues: conta.entregues,
    // nota é NULL até existir avaliação — a tela decide como mostrar isso
    nota: conta.nota === null ? null : Number(conta.nota),
    reputacao: conta.reputacao,
    streak: conta.streak,
    nivel: conta.nivel as Nivel,
    portfolio,
    conquistas: medalhas.map((m) => ({ icone: m.icone, nome: m.nome })),
    historico: [], // só existe quando houver entregas de verdade
  };
}
