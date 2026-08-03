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
  await sql`UPDATE users SET senha_hash = ${senha_hash} WHERE id = ${userId}`;
  return { ok: true };
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
