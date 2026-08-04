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
