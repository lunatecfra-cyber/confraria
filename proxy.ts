import { NextRequest, NextResponse } from "next/server";
import { verificarTokenSessao, NOME_COOKIE } from "@/lib/sessao";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(NOME_COOKIE)?.value;
  const sessao = token ? await verificarTokenSessao(token) : null;

  if (!sessao) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const rotaExigePapel = request.nextUrl.pathname.startsWith("/porta-voz") ? "voz" : "editor";

  if (sessao.papel !== "admin" && sessao.papel !== rotaExigePapel) {
    const destino = sessao.papel === "voz" ? "/porta-voz" : "/editor";
    return NextResponse.redirect(new URL(destino, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/porta-voz/:path*", "/editor/:path*", "/perfil/:path*"],
};
