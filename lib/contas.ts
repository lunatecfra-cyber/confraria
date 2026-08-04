import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import type { Papel } from "@/lib/sessao";

export type ContaUsuario = {
  id: number;
  apelido: string;
  nome: string;
  email: string;
  papel: Papel;
};

const RE_APELIDO = /^[a-z0-9._]{3,24}$/i;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function apelidoValido(apelido: string) {
  return RE_APELIDO.test(apelido.trim());
}

export async function criarConta(dados: {
  nome: string;
  apelido: string;
  email: string;
  senha: string;
  papel: Papel;
}): Promise<{ ok: true; conta: ContaUsuario } | { ok: false; erro: string }> {
  const nome = dados.nome.trim();
  const apelido = dados.apelido.trim();
  const email = dados.email.trim();

  if (!nome) return { ok: false, erro: "Digite seu nome." };
  if (!apelidoValido(apelido)) {
    return { ok: false, erro: "Apelido deve ter 3-24 letras, números, ponto ou underline." };
  }
  if (!RE_EMAIL.test(email)) return { ok: false, erro: "Digite um e-mail válido." };
  if (dados.senha.length < 6) return { ok: false, erro: "Senha precisa de pelo menos 6 caracteres." };

  const [apelidoEmUso] = await sql`SELECT id FROM users WHERE lower(apelido) = lower(${apelido})`;
  if (apelidoEmUso) return { ok: false, erro: "Esse apelido já está em uso." };

  const [emailEmUso] = await sql`SELECT id FROM users WHERE lower(email) = lower(${email})`;
  if (emailEmUso) return { ok: false, erro: "Esse e-mail já está cadastrado." };

  const senha_hash = bcrypt.hashSync(dados.senha, 10);
  const [linha] = await sql`
    INSERT INTO users (apelido, nome, email, senha_hash, papel)
    VALUES (${apelido}, ${nome}, ${email}, ${senha_hash}, ${dados.papel})
    RETURNING id
  `;

  return { ok: true, conta: { id: linha.id, apelido, nome, email, papel: dados.papel } };
}

export async function autenticar(
  apelido: string,
  senha: string
): Promise<{ ok: true; conta: ContaUsuario } | { ok: false; erro: string }> {
  const [linha] = await sql`
    SELECT id, apelido, nome, email, papel, senha_hash
    FROM users
    WHERE lower(apelido) = lower(${apelido.trim()})
  `;

  if (!linha || !linha.senha_hash || !bcrypt.compareSync(senha, linha.senha_hash)) {
    return { ok: false, erro: "Apelido ou senha incorretos." };
  }

  return {
    ok: true,
    conta: { id: linha.id, apelido: linha.apelido, nome: linha.nome, email: linha.email, papel: linha.papel },
  };
}

export async function autenticarOuCriarContaGoogle(dados: {
  googleId: string;
  email: string;
  nome: string;
  papel: Papel;
}): Promise<{ ok: true; conta: ContaUsuario; novo: boolean } | { ok: false; erro: string }> {
  const [porGoogleId] = await sql`
    SELECT id, apelido, nome, email, papel FROM users WHERE google_id = ${dados.googleId}
  `;
  if (porGoogleId) return { ok: true, conta: porGoogleId as ContaUsuario, novo: false };

  const [porEmail] = await sql`SELECT id FROM users WHERE lower(email) = lower(${dados.email})`;
  if (porEmail) {
    return { ok: false, erro: "Esse e-mail já tem conta na Oficina Amarela — entra com apelido e senha." };
  }

  const apelido = await gerarApelidoUnico(dados.email);
  const [linha] = await sql`
    INSERT INTO users (apelido, nome, email, google_id, papel)
    VALUES (${apelido}, ${dados.nome}, ${dados.email}, ${dados.googleId}, ${dados.papel})
    RETURNING id
  `;

  return {
    ok: true,
    novo: true,
    conta: { id: linha.id, apelido, nome: dados.nome, email: dados.email, papel: dados.papel },
  };
}

export async function buscarContaPorEmail(email: string): Promise<ContaUsuario | null> {
  const [linha] = await sql`
    SELECT id, apelido, nome, email, papel FROM users WHERE lower(email) = lower(${email.trim()})
  `;
  return (linha as ContaUsuario) ?? null;
}

export async function atualizarSenha(
  userId: number,
  novaSenha: string
): Promise<{ ok: true } | { ok: false; erro: string }> {
  if (novaSenha.length < 6) return { ok: false, erro: "Senha precisa de pelo menos 6 caracteres." };
  const senha_hash = bcrypt.hashSync(novaSenha, 10);
  // sessoes_validas_apos = now() derruba todos os cookies emitidos antes daqui
  // (quem confere isso é lerSessao() em lib/sessao-servidor.ts)
  await sql`
    UPDATE users
    SET senha_hash = ${senha_hash}, sessoes_validas_apos = now()
    WHERE id = ${userId}
  `;
  return { ok: true };
}

// ---- trava de força bruta no login ----------------------------------------
// Guardada no Postgres de propósito: em memória não funciona na Vercel, porque
// cada instância serverless tem a própria memória (basta cair noutra instância
// pra zerar a contagem).

const MAX_TENTATIVAS = 5;
const MINUTOS_TRAVA = 15;
const MINUTOS_JANELA = 15; // tentativas velhas que isso são esquecidas

export async function loginTravado(apelido: string): Promise<{ travado: boolean; minutos: number }> {
  const chave = apelido.trim().toLowerCase();
  const [linha] = await sql`SELECT travado_ate FROM tentativas_login WHERE chave = ${chave}`;
  if (!linha?.travado_ate) return { travado: false, minutos: 0 };

  const restanteMs = new Date(linha.travado_ate).getTime() - Date.now();
  if (restanteMs <= 0) return { travado: false, minutos: 0 };

  return { travado: true, minutos: Math.max(1, Math.ceil(restanteMs / 60000)) };
}

export async function registrarFalhaLogin(apelido: string): Promise<void> {
  const chave = apelido.trim().toLowerCase();

  // ON CONFLICT resolve a corrida entre duas tentativas simultâneas: o banco
  // serializa, então o contador não se perde.
  const [linha] = await sql`
    INSERT INTO tentativas_login (chave, tentativas, primeira_em)
    VALUES (${chave}, 1, now())
    ON CONFLICT (chave) DO UPDATE SET
      tentativas = CASE
        WHEN tentativas_login.primeira_em < now() - (${MINUTOS_JANELA} || ' minutes')::interval
          THEN 1
        ELSE tentativas_login.tentativas + 1
      END,
      primeira_em = CASE
        WHEN tentativas_login.primeira_em < now() - (${MINUTOS_JANELA} || ' minutes')::interval
          THEN now()
        ELSE tentativas_login.primeira_em
      END
    RETURNING tentativas
  `;

  if (linha && linha.tentativas >= MAX_TENTATIVAS) {
    await sql`
      UPDATE tentativas_login
      SET travado_ate = now() + (${MINUTOS_TRAVA} || ' minutes')::interval,
          tentativas = 0,
          primeira_em = now()
      WHERE chave = ${chave}
    `;
  }
}

export async function limparTentativasLogin(apelido: string): Promise<void> {
  await sql`DELETE FROM tentativas_login WHERE chave = ${apelido.trim().toLowerCase()}`;
}

async function gerarApelidoUnico(email: string): Promise<string> {
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 20) || "usuario";
  let apelido = base;
  let n = 1;
  while (true) {
    const [existente] = await sql`SELECT id FROM users WHERE lower(apelido) = lower(${apelido})`;
    if (!existente) return apelido;
    n += 1;
    apelido = `${base}${n}`;
  }
}
