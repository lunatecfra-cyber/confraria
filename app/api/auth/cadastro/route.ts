import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { criarConta } from "@/lib/contas";
import { criarTokenSessao, NOME_COOKIE } from "@/lib/sessao";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { nome, apelido, senha, papel } = body ?? {};

  if (typeof nome !== "string" || typeof apelido !== "string" || typeof senha !== "string") {
    return NextResponse.json({ erro: "Preencha todos os campos." }, { status: 400 });
  }
  if (papel !== "voz" && papel !== "editor") {
    return NextResponse.json({ erro: "Escolha se você é porta-voz ou editor." }, { status: 400 });
  }

  const resultado = criarConta({ nome, apelido, senha, papel });
  if (!resultado.ok) {
    return NextResponse.json({ erro: resultado.erro }, { status: 409 });
  }

  const token = await criarTokenSessao(resultado.conta);
  const jar = await cookies();
  jar.set(NOME_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true, ...resultado.conta });
}
