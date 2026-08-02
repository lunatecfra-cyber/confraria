import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { Papel } from "@/lib/sessao";

export type ContaUsuario = {
  id: number;
  apelido: string;
  nome: string;
  email: string;
  papel: Papel;
};

type LinhaUsuario = ContaUsuario & { senha_hash: string | null };

const RE_APELIDO = /^[a-z0-9._]{3,24}$/i;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function apelidoValido(apelido: string) {
  return RE_APELIDO.test(apelido.trim());
}

export function criarConta(dados: {
  nome: string;
  apelido: string;
  email: string;
  senha: string;
  papel: Papel;
}): { ok: true; conta: ContaUsuario } | { ok: false; erro: string } {
  const nome = dados.nome.trim();
  const apelido = dados.apelido.trim();
  const email = dados.email.trim();

  if (!nome) return { ok: false, erro: "Digite seu nome." };
  if (!apelidoValido(apelido)) {
    return { ok: false, erro: "Apelido deve ter 3-24 letras, números, ponto ou underline." };
  }
  if (!RE_EMAIL.test(email)) return { ok: false, erro: "Digite um e-mail válido." };
  if (dados.senha.length < 6) return { ok: false, erro: "Senha precisa de pelo menos 6 caracteres." };

  const apelidoEmUso = db.prepare("SELECT id FROM users WHERE apelido = ?").get(apelido);
  if (apelidoEmUso) return { ok: false, erro: "Esse apelido já está em uso." };

  const emailEmUso = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (emailEmUso) return { ok: false, erro: "Esse e-mail já está cadastrado." };

  const senha_hash = bcrypt.hashSync(dados.senha, 10);
  const info = db
    .prepare("INSERT INTO users (apelido, nome, email, senha_hash, papel) VALUES (?, ?, ?, ?, ?)")
    .run(apelido, nome, email, senha_hash, dados.papel);

  return { ok: true, conta: { id: Number(info.lastInsertRowid), apelido, nome, email, papel: dados.papel } };
}

export function autenticar(
  apelido: string,
  senha: string
): { ok: true; conta: ContaUsuario } | { ok: false; erro: string } {
  const linha = db
    .prepare("SELECT id, apelido, nome, email, papel, senha_hash FROM users WHERE apelido = ?")
    .get(apelido.trim()) as LinhaUsuario | undefined;

  if (!linha || !linha.senha_hash || !bcrypt.compareSync(senha, linha.senha_hash)) {
    return { ok: false, erro: "Apelido ou senha incorretos." };
  }

  return {
    ok: true,
    conta: { id: linha.id, apelido: linha.apelido, nome: linha.nome, email: linha.email, papel: linha.papel },
  };
}

export function autenticarOuCriarContaGoogle(dados: {
  googleId: string;
  email: string;
  nome: string;
  papel: Papel;
}): { ok: true; conta: ContaUsuario; novo: boolean } | { ok: false; erro: string } {
  const porGoogleId = db
    .prepare("SELECT id, apelido, nome, email, papel FROM users WHERE google_id = ?")
    .get(dados.googleId) as ContaUsuario | undefined;
  if (porGoogleId) return { ok: true, conta: porGoogleId, novo: false };

  const porEmail = db.prepare("SELECT id FROM users WHERE email = ?").get(dados.email);
  if (porEmail) {
    return { ok: false, erro: "Esse e-mail já tem conta na Confraria — entra com apelido e senha." };
  }

  const apelido = gerarApelidoUnico(dados.email);
  const info = db
    .prepare("INSERT INTO users (apelido, nome, email, google_id, papel) VALUES (?, ?, ?, ?, ?)")
    .run(apelido, dados.nome, dados.email, dados.googleId, dados.papel);

  return {
    ok: true,
    novo: true,
    conta: {
      id: Number(info.lastInsertRowid),
      apelido,
      nome: dados.nome,
      email: dados.email,
      papel: dados.papel,
    },
  };
}

function gerarApelidoUnico(email: string): string {
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 20) || "usuario";
  let apelido = base;
  let n = 1;
  while (db.prepare("SELECT id FROM users WHERE apelido = ?").get(apelido)) {
    n += 1;
    apelido = `${base}${n}`;
  }
  return apelido;
}
