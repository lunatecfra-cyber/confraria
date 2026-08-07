import { NextResponse } from "next/server";
import { googleConfigurado, montarUrlAutorizacao } from "@/lib/oauth-google";
import { criarEstadoAssinado } from "@/lib/sessao";

// não pergunta mais o papel aqui — quem já tem conta entra direto no papel
// que já tem, e quem é novo escolhe depois, em /escolher-papel (ver callback)
export async function GET(request: Request) {
  const url = new URL(request.url);

  if (!googleConfigurado()) {
    return NextResponse.json(
      { erro: "Login com Google ainda não configurado (faltam GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET no .env.local)." },
      { status: 503 }
    );
  }

  const redirectUri = new URL("/api/auth/google/callback", url.origin).toString();
  const state = await criarEstadoAssinado();

  return NextResponse.redirect(montarUrlAutorizacao(redirectUri, state));
}
