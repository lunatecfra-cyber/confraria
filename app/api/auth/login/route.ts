import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { autenticar } from "@/lib/contas";
import { criarTokenSessao, NOME_COOKIE } from "@/lib/sessao";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { apelido, senha } = body ?? {};

  if (typeof apelido !== "string" || typeof senha !== "string") {
    return NextResponse.json({ erro: "Preencha apelido e senha." }, { status: 400 });
  }

  const resultado = await autenticar(apelido, senha);
  if (!resultado.ok) {
    return NextResponse.json({ erro: resultado.erro }, { status: 401 });
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
