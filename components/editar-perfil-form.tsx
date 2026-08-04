"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PerfilEditavel } from "@/lib/perfil-db";

export function EditarPerfilForm({ inicial }: { inicial: PerfilEditavel }) {
  const router = useRouter();
  const [headline, setHeadline] = useState(inicial.headline ?? "");
  const [localizacao, setLocalizacao] = useState(inicial.localizacao ?? "");
  const [bio, setBio] = useState(inicial.bio ?? "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    const resp = await fetch("/api/perfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline, bio, localizacao }),
    });
    setSalvando(false);

    if (!resp.ok) {
      const dados = await resp.json().catch(() => null);
      setErro(dados?.erro ?? "Não deu pra salvar. Tenta de novo.");
      return;
    }

    router.push("/perfil");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg" noValidate>
      <div className="mb-4">
        <label
          htmlFor="headline"
          className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
        >
          Headline
        </label>
        <input
          id="headline"
          className="field-input !pl-4"
          placeholder="Ex: Editor de vídeo · cortes de impacto"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
        <p className="mt-1.5 text-xs text-muted-2">Uma linha, aparece embaixo do seu nome.</p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="localizacao"
          className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
        >
          Onde você fica
        </label>
        <input
          id="localizacao"
          className="field-input !pl-4"
          placeholder="Ex: Petrópolis, RJ"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="bio"
          className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
        >
          Sobre você
        </label>
        <textarea
          id="bio"
          className="field-input !pl-4"
          rows={5}
          placeholder="Como você edita, o que curte pegar, seu ritmo…"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {erro && (
        <p role="alert" className="mb-4 text-center text-sm text-danger">
          {erro}
        </p>
      )}

      <div className="flex gap-3">
        <Link href="/perfil" className="btn-ghost grid w-32 place-items-center">
          Cancelar
        </Link>
        <button type="submit" className="btn-gold flex-1" disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar perfil"}
        </button>
      </div>
    </form>
  );
}
