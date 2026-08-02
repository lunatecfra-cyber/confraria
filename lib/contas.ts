import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { Papel } from "@/lib/sessao";

export type ContaUsuario = {
  id: number;
  apelido: string;
  nome: string;
  papel: Papel;
};

type LinhaUsuario = ContaUsuario & { senha_hash: string };

const RE_APELIDO = /^[a-z0-9._]{3,24}$/i;

export function apelidoValido(apelido: string) {
  return RE_APELIDO.test(apelido.trim());
}

export function criarConta(dados: {
  nome: string;
  apelido: string;
  senha: string;
  papel: Papel;
}): { ok: true; conta: ContaUsuario } | { ok: false; erro: string } {
  const nome = dados.nome.trim();
  const apelido = dados.apelido.trim();

  if (!nome) return { ok: false, erro: "Digite seu nome." };
  if (!apelidoValido(apelido)) {
    return { ok: false, erro: "Apelido deve ter 3-24 letras, números, ponto ou underline." };
  }
  if (dados.senha.length < 6) return { ok: false, erro: "Senha precisa de pelo menos 6 caracteres." };

  const existente = db.prepare("SELECT id FROM users WHERE apelido = ?").get(apelido);
  if (existente) return { ok: false, erro: "Esse apelido já está em uso." };

  const senha_hash = bcrypt.hashSync(dados.senha, 10);
  const info = db
    .prepare("INSERT INTO users (apelido, nome, senha_hash, papel) VALUES (?, ?, ?, ?)")
    .run(apelido, nome, senha_hash, dados.papel);

  return { ok: true, conta: { id: Number(info.lastInsertRowid), apelido, nome, papel: dados.papel } };
}

export function autenticar(
  apelido: string,
  senha: string
): { ok: true; conta: ContaUsuario } | { ok: false; erro: string } {
  const linha = db
    .prepare("SELECT id, apelido, nome, papel, senha_hash FROM users WHERE apelido = ?")
    .get(apelido.trim()) as LinhaUsuario | undefined;

  if (!linha || !bcrypt.compareSync(senha, linha.senha_hash)) {
    return { ok: false, erro: "Apelido ou senha incorretos." };
  }

  return { ok: true, conta: { id: linha.id, apelido: linha.apelido, nome: linha.nome, papel: linha.papel } };
}
