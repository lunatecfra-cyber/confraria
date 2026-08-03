"use client";

import { useState } from "react";
import Link from "next/link";

export function RecuperarForm() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setErro("Digite seu e-mail.");
      return;
    }
    setErro("");
    setEnviando(true);
    const resp = await fetch("/api/auth/recuperar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const dados = await resp.json();
    setEnviando(false);

    if (!resp.ok) {
      setErro(dados.erro ?? "Não deu pra enviar. Tenta de novo.");
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-[15px] leading-relaxed text-muted">
          Se esse e-mail tiver uma conta, mandamos um link de recuperação pra ele. Confere sua caixa de
          entrada (e o spam, por garantia).
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-gold-hi hover:underline">
          Voltar pro login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-5">
          <label htmlFor="email" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field-input !pl-4"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
          {enviando ? "Enviando…" : "Mandar link de recuperação"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-gold-hi hover:underline">
          Voltar pro login
        </Link>
      </p>
    </div>
  );
}
