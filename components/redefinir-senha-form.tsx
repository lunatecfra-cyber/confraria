"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RedefinirSenhaConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setErro("Link inválido — peça a recuperação de novo.");
      return;
    }
    if (senha.length < 6) {
      setErro("Senha precisa de pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não são iguais.");
      return;
    }

    setErro("");
    setEnviando(true);
    const resp = await fetch("/api/auth/redefinir-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, senha }),
    });
    const dados = await resp.json();
    setEnviando(false);

    if (!resp.ok) {
      setErro(dados.erro ?? "Não deu pra redefinir. Tenta pedir o link de novo.");
      return;
    }
    setSucesso(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-danger">Esse link está incompleto ou inválido.</p>
        <Link href="/recuperar" className="mt-6 inline-block text-sm font-medium text-gold-hi hover:underline">
          Pedir um novo link
        </Link>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-[15px] text-muted">Senha alterada. Te levando pro login…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="senha" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            Nova senha
          </label>
          <input
            id="senha"
            type="password"
            className="field-input !pl-4"
            placeholder="mínimo 6 caracteres"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="confirmar" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            Confirmar nova senha
          </label>
          <input
            id="confirmar"
            type="password"
            className="field-input !pl-4"
            placeholder="repita a senha"
            autoComplete="new-password"
            value={confirmar}
            onChange={(e) => {
              setConfirmar(e.target.value);
              setErro("");
            }}
          />
        </div>

        {erro && (
          <p role="alert" className="mb-4 text-center text-sm text-danger">
            {erro}
          </p>
        )}

        <button type="submit" className="btn-gold" disabled={enviando}>
          {enviando ? "Salvando…" : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}

export function RedefinirSenhaForm() {
  return (
    <Suspense fallback={null}>
      <RedefinirSenhaConteudo />
    </Suspense>
  );
}
