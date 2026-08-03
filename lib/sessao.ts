import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const NOME_COOKIE = "confraria_sessao";
const DURACAO = "30d";

function chave() {
  const segredo = process.env.AUTH_SECRET;
  if (!segredo) throw new Error("AUTH_SECRET não configurado (.env.local)");
  return new TextEncoder().encode(segredo);
}

export type Papel = "voz" | "editor" | "admin";

export type SessaoUsuario = {
  id: number;
  apelido: string;
  nome: string;
  papel: Papel;
};

export async function criarTokenSessao(usuario: SessaoUsuario) {
  return new SignJWT({ ...usuario })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(DURACAO)
    .sign(chave());
}

export async function verificarTokenSessao(token: string): Promise<SessaoUsuario | null> {
  try {
    const { payload } = await jwtVerify(token, chave());
    if (
      typeof payload.id === "number" &&
      typeof payload.apelido === "string" &&
      typeof payload.nome === "string" &&
      (payload.papel === "voz" || payload.papel === "editor" || payload.papel === "admin")
    ) {
      return { id: payload.id, apelido: payload.apelido, nome: payload.nome, papel: payload.papel };
    }
    return null;
  } catch {
    return null;
  }
}

export async function lerSessao(): Promise<SessaoUsuario | null> {
  const jar = await cookies();
  const token = jar.get(NOME_COOKIE)?.value;
  if (!token) return null;
  return verificarTokenSessao(token);
}

// estado assinado de curta duração — usado pelo fluxo OAuth do Google como
// "state" (protege contra CSRF) carregando o papel escolhido antes do
// redirecionamento, sem precisar guardar nada no servidor
export async function criarEstadoAssinado(dados: { papel: Papel }) {
  return new SignJWT({ ...dados })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(chave());
}

export async function verificarEstadoAssinado(token: string): Promise<{ papel: Papel } | null> {
  try {
    const { payload } = await jwtVerify(token, chave());
    if (payload.papel === "voz" || payload.papel === "editor") {
      return { papel: payload.papel };
    }
    return null;
  } catch {
    return null;
  }
}

// token de recuperação de senha — assinado, expira em 30min, carrega o id
// da conta. Não precisa guardar nada no banco: o próprio token expira sozinho
export async function criarTokenRecuperacao(userId: number) {
  return new SignJWT({ uso: "recuperar-senha", userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(chave());
}

export async function verificarTokenRecuperacao(token: string): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, chave());
    if (payload.uso === "recuperar-senha" && typeof payload.userId === "number") {
      return { userId: payload.userId };
    }
    return null;
  } catch {
    return null;
  }
}
