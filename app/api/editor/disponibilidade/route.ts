import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { lerSessao } from "@/lib/sessao-servidor";

/** Salva só a grade de horários (usado ao clicar direto na agenda). */
export async function POST(request: Request) {
  const sessao = await lerSessao();
  if (!sessao) return NextResponse.json({ erro: "Faça login primeiro." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const grade = body?.disponibilidade;

  const valida =
    Array.isArray(grade) &&
    grade.length === 3 &&
    grade.every((l: unknown) => Array.isArray(l) && l.length === 7);

  if (!valida) return NextResponse.json({ erro: "Grade inválida." }, { status: 400 });

  // sql.json, não JSON.stringify: com a string o Postgres guarda um JSON
  // *string* dentro do jsonb e a grade volta como texto
  await sql`
    UPDATE users SET disponibilidade = ${sql.json(
      grade.map((l: unknown[]) => l.map(Boolean))
    )} WHERE id = ${sessao.id}
  `;
  return NextResponse.json({ ok: true });
}
