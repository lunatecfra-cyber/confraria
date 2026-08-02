import { NextResponse } from "next/server";
import { googleConfigurado, montarUrlAutorizacao } from "@/lib/oauth-google";
import { criarEstadoAssinado, type Papel } from "@/lib/sessao";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const papelParam = url.searchParams.get("papel");
  const papel: Papel = papelParam === "editor" ? "editor" : "voz";

  if (!googleConfigurado()) {
    return NextResponse.json(
      { erro: "Login com Google ainda não configurado (faltam GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET no .env.local)." },
      { status: 503 }
    );
  }

  const redirectUri = new URL("/api/auth/google/callback", url.origin).toString();
  const state = await criarEstadoAssinado({ papel });

  return NextResponse.redirect(montarUrlAutorizacao(redirectUri, state));
}
