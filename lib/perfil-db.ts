// Campos de perfil que o próprio usuário edita, guardados no banco.
// Só roda em Node (Server Component / Route Handler).
import { sql } from "@/lib/db";

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
