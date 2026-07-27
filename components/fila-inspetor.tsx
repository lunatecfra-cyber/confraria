"use client";

import { useState } from "react";
import Link from "next/link";
import { PAUTAS, ROTULO_FORMATO, type Pauta } from "@/lib/pautas";
import { getCandidato, iniciais } from "@/lib/candidatos";
import { LocalProximidade } from "@/components/local-proximidade";
import { Selo, Chip } from "@/components/fila-pautas";

export function FilaInspetor() {
  const [pautas, setPautas] = useState<Pauta[]>(PAUTAS);

  const emRevisao = pautas.filter((p) => p.status === "em_revisao");

  function aprovar(id: string) {
    setPautas((lista) =>
      lista.map((p) =>
        p.id === id ? { ...p, status: "aprovada", notasInspetor: undefined } : p
      )
    );
  }

  function pedirReedicao(id: string, nota: string) {
    setPautas((lista) =>
      lista.map((p) =>
        p.id === id ? { ...p, status: "reedicao", notasInspetor: nota } : p
      )
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text lg:text-3xl">
            Fila de revisão
          </h1>
          <p className="mt-1 text-sm text-muted">
            Aprove ou peça reedição das missões entregues.
          </p>
        </div>
        <p className="text-sm text-muted">{emRevisao.length} aguardando</p>
      </div>

      {emRevisao.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line-soft bg-surface/40 p-10 text-center text-sm text-muted">
          Nada pra revisar agora.
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {emRevisao.map((p) => (
            <CardRevisao
              key={p.id}
              pauta={p}
              onAprovar={() => aprovar(p.id)}
              onPedirReedicao={(nota) => pedirReedicao(p.id, nota)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CardRevisao({
  pauta: p,
  onAprovar,
  onPedirReedicao,
}: {
  pauta: Pauta;
  onAprovar: () => void;
  onPedirReedicao: (nota: string) => void;
}) {
  const [abrindoReedicao, setAbrindoReedicao] = useState(false);
  const [nota, setNota] = useState("");
  const [aviso, setAviso] = useState("");
  const cand = getCandidato(p.portaVoz);

  function confirmarReedicao() {
    if (!nota.trim()) {
      setAviso("Escreve o que precisa mudar antes de devolver.");
      return;
    }
    onPedirReedicao(nota.trim());
  }

  return (
    <li className="rounded-2xl border border-line bg-surface/70 p-4 lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <Link
          href={`/candidato/${cand.slug}`}
          className="group flex flex-none items-center gap-3 lg:w-56"
        >
          <span
            className="grid h-12 w-12 flex-none place-items-center rounded-xl font-[family-name:var(--font-display)] text-sm font-semibold text-black/80"
            style={{ background: cand.tint }}
          >
            {iniciais(cand.nome)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-text transition-colors group-hover:text-gold-hi">
              {cand.nome}
            </p>
            <p className="truncate text-xs text-muted">{cand.cargo}</p>
            <LocalProximidade
              local={cand.local}
              proximidade={cand.proximidade}
              className="text-xs text-muted-2"
            />
          </div>
        </Link>

        <div className="min-w-0 flex-1 lg:border-l lg:border-line lg:pl-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text">
              {p.titulo}
            </h3>
            <Selo status={p.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="rounded-md border border-line bg-ink-2 px-2 py-0.5 text-muted">
              {ROTULO_FORMATO[p.formato]}
            </span>
            {p.brief.tom && <Chip k="tom" v={p.brief.tom} />}
            {p.brief.cor && <Chip k="cor" v={p.brief.cor} />}
            {p.brief.fonte && <Chip k="fonte" v={p.brief.fonte} />}
            {p.brief.refs && <Chip k="ref" v={p.brief.refs} />}
          </div>
          <p className="mt-2 text-xs text-muted">
            Entregue por <span className="text-text">{p.reservadaPor}</span>
            {p.entregaLink && (
              <>
                {" "}
                ·{" "}
                <a
                  href={p.entregaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold-hi hover:underline"
                >
                  Abrir vídeo entregue
                </a>
              </>
            )}
          </p>
        </div>

        {!abrindoReedicao && (
          <div className="flex flex-none items-center gap-2 lg:w-56 lg:flex-col lg:items-stretch">
            <button className="btn-gold whitespace-nowrap" onClick={onAprovar}>
              Aprovar
            </button>
            <button
              className="btn-ghost whitespace-nowrap"
              onClick={() => setAbrindoReedicao(true)}
            >
              Pedir reedição
            </button>
          </div>
        )}
      </div>

      {abrindoReedicao && (
        <div className="mt-4 rounded-xl border border-line bg-surface/60 p-4">
          <label
            htmlFor={`nota-${p.id}`}
            className="mb-2 block text-xs uppercase tracking-[0.12em] text-muted"
          >
            O que precisa mudar
          </label>
          <textarea
            id={`nota-${p.id}`}
            className="field-input !pl-4 min-h-24 resize-y"
            placeholder="ex.: cortar os 10s iniciais, trocar a trilha, ajustar a legenda..."
            value={nota}
            onChange={(e) => {
              setNota(e.target.value);
              setAviso("");
            }}
          />
          {aviso && (
            <p role="alert" className="mt-2 text-sm text-danger">
              {aviso}
            </p>
          )}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button className="btn-gold sm:flex-1" onClick={confirmarReedicao}>
              Confirmar reedição
            </button>
            <button
              className="btn-ghost sm:w-40"
              onClick={() => {
                setAbrindoReedicao(false);
                setNota("");
                setAviso("");
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
