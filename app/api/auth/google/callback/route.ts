import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { trocarCodigoPorPerfil } from "@/lib/oauth-google";
import { autenticarOuCriarContaGoogle } from "@/lib/contas";
import { criarTokenSessao, verificarEstadoAssinado, NOME_COOKIE } from "@/lib/sessao";

function erroRedirect(origin: string, motivo: string) {
  return NextResponse.redirect(`${origin}/login?erro_google=${encodeURIComponent(motivo)}`);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateToken = url.searchParams.get("state");

  if (!code || !stateToken) {
    return erroRedirect(url.origin, "Login com Google cancelado.");
  }

  const estado = await verificarEstadoAssinado(stateToken);
  if (!estado) {
    return erroRedirect(url.origin, "Sessão de login expirou, tenta de novo.");
  }

  const redirectUri = new URL("/api/auth/google/callback", url.origin).toString();
  const perfilGoogle = await trocarCodigoPorPerfil(code, redirectUri);
  if (!perfilGoogle) {
    return erroRedirect(url.origin, "Não deu pra confirmar sua conta Google.");
  }

  const resultado = autenticarOuCriarContaGoogle({
    googleId: perfilGoogle.googleId,
    email: perfilGoogle.email,
    nome: perfilGoogle.nome,
    papel: estado.papel,
  });
  if (!resultado.ok) {
    return erroRedirect(url.origin, resultado.erro);
  }

  const token = await criarTokenSessao(resultado.conta);
  const jar = await cookies();
  jar.set(NOME_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  const destino =
    resultado.conta.papel === "editor"
      ? "/editor"
      : resultado.novo
        ? "/porta-voz/criar-perfil?via=google"
        : "/porta-voz";

  return NextResponse.redirect(new URL(destino, url.origin));
}
