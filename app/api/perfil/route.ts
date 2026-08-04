import { NextResponse } from "next/server";
import { salvarPerfilEditavel } from "@/lib/perfil-db";
import { lerSessao } from "@/lib/sessao-servidor";

export async function POST(request: Request) {
  const sessao = await lerSessao();
  if (!sessao) {
    return NextResponse.json({ erro: "Faça login primeiro." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { headline, bio, localizacao } = body ?? {};

  await salvarPerfilEditavel(sessao.id, {
    headline: typeof headline === "string" ? headline : undefined,
    bio: typeof bio === "string" ? bio : undefined,
    localizacao: typeof localizacao === "string" ? localizacao : undefined,
  });

  return NextResponse.json({ ok: true });
}
