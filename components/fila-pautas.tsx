"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PAUTAS,
  ROTULO_FORMATO,
  ROTULO_STATUS,
  type Pauta,
} from "@/lib/pautas";
import { getCandidato, iniciais } from "@/lib/candidatos";
import { LocalProximidade } from "@/components/local-proximidade";
import { PERFIL_EDITOR } from "@/lib/perfil";

const PRAZO_HORAS = 24;

// sistema de match: compatibilidade do editor atual com a pauta, baseado no portfólio dele
// (já editou pra esse porta-voz? já editou nesse formato?)
function pontosMatch(p: Pauta): number {
  const jaEditouPortaVoz = PERFIL_EDITOR.portfolio.some((v) => v.portaVoz === p.portaVoz);
  const jaEditouFormato = PERFIL_EDITOR.portfolio.some((v) => v.formato === p.formato);
  return (jaEditouPortaVoz ? 2 : 0) + (jaEditouFormato ? 1 : 0);
}

function calcularMatch(p: Pauta): { rotulo: string; cor: string } {
  const pontos = pontosMatch(p);
  if (pontos >= 2) return { rotulo: "Match alto", cor: "border-ok/40 bg-ok/[0.08] text-ok" };
  if (pontos === 1) return { rotulo: "Match médio", cor: "border-gold-lo/40 bg-gold/[0.07] text-gold-hi" };
  return { rotulo: "Match novo", cor: "border-line bg-surface-2 text-muted" };
}

export function Selo({ status }: { status: Pauta["status"] }) {
  const cor =
    status === "minha"
      ? "border-gold-lo/60 bg-gold/10 text-gold-hi"
      : status === "disponivel"
        ? "border-line bg-surface-2 text-muted"
        : status === "reservada"
          ? "border-silver-hi/40 bg-silver-hi/5 text-silver-hi"
          : status === "em_revisao"
            ? "border-silver-lo/50 bg-surface-2 text-silver"
            : status === "aprovada"
              ? "border-ok/50 bg-ok/10 text-ok"
              : status === "reedicao"
                ? "border-danger/50 bg-danger/10 text-danger"
                : "border-line bg-surface text-muted-2";

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cor}`}>
      {ROTULO_STATUS[status]}
    </span>
  );
}

function restante(ate: string) {
  const ms = new Date(ate).getTime() - Date.now();
  if (ms <= 0) return "prazo vencido";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}min restantes` : `${m}min restantes`;
}

export function FilaPautas({ pautasReais = [] }: { pautasReais?: Pauta[] }) {
  // pautas criadas de verdade pelos porta-vozes (vindas do banco) entram na
  // frente; as de PAUTAS são demonstração, pra fila não ficar vazia
  const [pautas, setPautas] = useState<Pauta[]>([...pautasReais, ...PAUTAS]);
  const [agora, setAgora] = useState<number | null>(null);
  const [linkEntrega, setLinkEntrega] = useState("");
  const [aviso, setAviso] = useState("");
  const [processando, setProcessando] = useState<string | null>(null);
  const [sorteada, setSorteada] = useState<Pauta | null>(null);
  const [visao, setVisao] = useState<"lista" | "baralho">("lista");
  const [deckIndex, setDeckIndex] = useState(0);

  useEffect(() => {
    setAgora(Date.now());
    const t = setInterval(() => setAgora(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const minha = pautas.find((p) => p.status === "minha");
  const disponiveis = pautas.filter((p) => p.status !== "minha");
  const baralho = pautas
    .filter((p) => p.status === "disponivel")
    .sort((a, b) => pontosMatch(b) - pontosMatch(a));
  const cartaAtual = baralho.length ? baralho[deckIndex % baralho.length] : null;

  function reservar(id: string) {
    if (minha) {
      setAviso("Você já tem uma missão reservada. Entregue ou cancele antes de pegar outra.");
      return;
    }
    setAviso("");
    setProcessando(id);
    const ate = new Date(Date.now() + PRAZO_HORAS * 3_600_000).toISOString();
    setTimeout(() => {
      setPautas((lista) =>
        lista.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "minha",
                reservadaAte: ate,
                driveLink: "https://drive.google.com/file/d/EXEMPLO/view",
              }
            : p
        )
      );
      setProcessando(null);
    }, 400);
  }

  function sortear() {
    if (minha) {
      setAviso("Você já tem uma missão reservada. Entregue ou cancele antes de pegar outra.");
      return;
    }
    const livres = pautas.filter((p) => p.status === "disponivel");
    if (livres.length === 0) {
      setAviso("Não tem nenhuma missão livre pra sortear agora.");
      return;
    }
    setAviso("");
    setSorteada(livres[Math.floor(Math.random() * livres.length)]);
  }

  function cancelar(id: string) {
    setProcessando(id);
    setTimeout(() => {
      setLinkEntrega("");
      setPautas((lista) =>
        lista.map((p) =>
          p.id === id
            ? { ...p, status: "disponivel", reservadaAte: undefined, driveLink: undefined }
            : p
        )
      );
      setProcessando(null);
    }, 400);
  }

  function entregar(id: string) {
    if (!linkEntrega.trim()) {
      setAviso("Cole o link do vídeo pronto antes de confirmar.");
      return;
    }
    setAviso("");
    setProcessando(id);
    const link = linkEntrega.trim();
    setTimeout(() => {
      setLinkEntrega("");
      setPautas((lista) =>
        lista.map((p) =>
          p.id === id ? { ...p, status: "em_revisao", entregaLink: link } : p
        )
      );
      setProcessando(null);
    }, 400);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      {minha && (
        <section className="mb-10 rounded-2xl border border-gold-lo/50 bg-gradient-to-b from-gold/[0.07] to-transparent p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Selo status="minha" />
            <span className="text-xs uppercase tracking-[0.15em] text-gold-hi">
              Missão aceita
            </span>
            {minha.reservadaAte && agora !== null && (
              <span className="ml-auto text-sm text-muted">
                ⏳ {restante(minha.reservadaAte)}
              </span>
            )}
          </div>

          <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-text lg:text-3xl">
            {minha.titulo}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {minha.portaVoz} · {ROTULO_FORMATO[minha.formato]}
          </p>

          <div className="mt-5 rounded-xl border border-line bg-surface/60 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">
              Acesso ao bruto
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text">
              <span className="text-ok">✓</span> Acesso liberado no Drive para seu
              e-mail.
              <a
                href={minha.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold-hi hover:underline"
              >
                Abrir pasta
              </a>
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="entrega"
              className="mb-2 block text-xs uppercase tracking-[0.12em] text-muted"
            >
              Link do vídeo pronto
            </label>
            <input
              id="entrega"
              className="field-input !pl-4"
              placeholder="cole aqui o link do Drive"
              value={linkEntrega}
              onChange={(e) => {
                setLinkEntrega(e.target.value);
                setAviso("");
              }}
            />
          </div>

          {aviso && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {aviso}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              className="btn-gold sm:flex-1"
              onClick={() => entregar(minha.id)}
              disabled={processando === minha.id}
            >
              {processando === minha.id ? "Enviando…" : "Confirmar entrega"}
            </button>
            <button
              className="btn-ghost sm:w-52"
              onClick={() => cancelar(minha.id)}
              disabled={processando === minha.id}
            >
              {processando === minha.id ? "Cancelando…" : "Cancelar reserva"}
            </button>
          </div>
        </section>
      )}

      {sorteada && (
        <section className="mb-8 rounded-2xl border border-gold-lo/50 bg-gradient-to-b from-gold/[0.08] to-transparent p-6 lg:p-8">
          <span className="text-xs uppercase tracking-[0.15em] text-gold-hi">
            🎲 Pauta sorteada
          </span>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
            {sorteada.titulo}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {sorteada.portaVoz} · {ROTULO_FORMATO[sorteada.formato]}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              className="btn-gold sm:flex-1"
              onClick={() => {
                reservar(sorteada.id);
                setSorteada(null);
              }}
              disabled={processando === sorteada.id}
            >
              Reservar essa
            </button>
            <button className="btn-ghost sm:w-44" onClick={sortear}>
              Sortear outra
            </button>
            <button className="btn-ghost sm:w-32" onClick={() => setSorteada(null)}>
              Fechar
            </button>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text lg:text-3xl">
            Missões disponíveis
          </h1>
          <p className="mt-1 text-sm text-muted">
            Escolha apenas 1 missão de cada vez. Prazo de {PRAZO_HORAS}h para entregar.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-xl border border-line bg-surface-2 p-1">
            <button
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                visao === "lista" ? "bg-gold/10 text-gold-hi" : "text-muted hover:text-text"
              }`}
              onClick={() => setVisao("lista")}
            >
              Lista
            </button>
            <button
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                visao === "baralho" ? "bg-gold/10 text-gold-hi" : "text-muted hover:text-text"
              }`}
              onClick={() => setVisao("baralho")}
            >
              🔨 Bancada de Triagem
            </button>
          </div>
          <button className="btn-ghost w-auto px-5" onClick={sortear} disabled={!!minha}>
            🎲 Sortear pauta
          </button>
          <p className="text-sm text-muted">
            {disponiveis.filter((p) => p.status === "disponivel").length} abertas
          </p>
        </div>
      </div>

      {aviso && !minha && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {aviso}
        </p>
      )}

      {visao === "baralho" ? (
        <div className="mt-6 flex flex-col items-center gap-4">
          {cartaAtual ? (
            <CartaBaralho
              key={cartaAtual.id}
              pauta={cartaAtual}
              minha={!!minha}
              processando={processando === cartaAtual.id}
              onPassar={() => setDeckIndex((i) => i + 1)}
              onReservar={() => reservar(cartaAtual.id)}
            />
          ) : (
            <div className="w-full max-w-lg rounded-2xl border border-dashed border-line p-12 text-center text-sm text-muted">
              Nenhuma missão na bancada agora.
            </div>
          )}
          {baralho.length > 0 && (
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              {(deckIndex % baralho.length) + 1} de {baralho.length} · passe pra ver a próxima
            </p>
          )}
        </div>
      ) : (
      <ul className="mt-6 flex flex-col gap-3">
        {disponiveis.map((p) => {
          const livre = p.status === "disponivel";
          const cand = getCandidato(p.portaVoz);
          const match = calcularMatch(p);
          return (
            <li
              key={p.id}
              className={`rounded-2xl border p-4 transition-colors lg:p-5 ${
                livre
                  ? "border-line bg-surface/70 hover:border-gold/40"
                  : "border-line-soft bg-surface/30"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* quem ele vai editar */}
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

                {/* a pauta */}
                <div className="min-w-0 flex-1 lg:border-l lg:border-line lg:pl-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text">
                      {p.titulo}
                    </h3>
                    <Selo status={p.status} />
                    {livre && (
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${match.cor}`}>
                        {match.rotulo}
                      </span>
                    )}
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
                </div>

                {/* pressão + ação */}
                <div className="flex flex-none items-center justify-between gap-3 lg:w-48 lg:flex-col lg:items-stretch">
                  {livre ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gold-lo/40 bg-gold/[0.07] px-2.5 py-1 text-xs text-gold-hi">
                        ⏳ {PRAZO_HORAS}h pra entregar
                      </span>
                      <button
                        className="btn-gold whitespace-nowrap"
                        onClick={() => reservar(p.id)}
                        disabled={!!minha || processando === p.id}
                        title={minha ? "Você já tem uma missão reservada" : undefined}
                      >
                        {processando === p.id ? "Reservando…" : "Reservar"}
                      </button>
                    </>
                  ) : (
                    <p className="w-full text-center text-xs text-muted-2 lg:text-right">
                      {p.status === "reservada"
                        ? `Reservada por ${p.reservadaPor}`
                        : "Aguardando o inspetor"}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
}

function CartaBaralho({
  pauta,
  minha,
  processando,
  onPassar,
  onReservar,
}: {
  pauta: Pauta;
  minha: boolean;
  processando: boolean;
  onPassar: () => void;
  onReservar: () => void;
}) {
  const cand = getCandidato(pauta.portaVoz);
  const match = calcularMatch(pauta);

  return (
    <div className="w-full max-w-lg rounded-2xl border border-gold-lo/40 bg-gradient-to-b from-gold/[0.06] to-surface p-6 lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <Link href={`/candidato/${cand.slug}`} className="group flex items-center gap-3">
          <span
            className="grid h-13 w-13 flex-none place-items-center rounded-xl font-[family-name:var(--font-display)] text-base font-semibold text-black/80"
            style={{ background: cand.tint, width: "3.25rem", height: "3.25rem" }}
          >
            {iniciais(cand.nome)}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-text transition-colors group-hover:text-gold-hi">
              {cand.nome}
            </p>
            <LocalProximidade
              local={cand.local}
              proximidade={cand.proximidade}
              className="text-xs text-muted-2"
            />
          </div>
        </Link>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${match.cor}`}>
          {match.rotulo}
        </span>
      </div>

      <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
        {pauta.titulo}
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded-md border border-line bg-ink-2 px-2 py-0.5 text-muted">
          {ROTULO_FORMATO[pauta.formato]}
        </span>
        {pauta.brief.tom && <Chip k="tom" v={pauta.brief.tom} />}
        {pauta.brief.cor && <Chip k="cor" v={pauta.brief.cor} />}
        {pauta.brief.fonte && <Chip k="fonte" v={pauta.brief.fonte} />}
        {pauta.brief.refs && <Chip k="ref" v={pauta.brief.refs} />}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="btn-ghost flex-1" onClick={onPassar}>
          Passar
        </button>
        <button
          className="btn-gold flex-[1.3]"
          onClick={onReservar}
          disabled={minha || processando}
          title={minha ? "Você já tem uma missão reservada" : undefined}
        >
          {processando ? "Reservando…" : "Reservar essa"}
        </button>
      </div>
    </div>
  );
}

export function Chip({ k, v }: { k: string; v: string }) {
  return (
    <span className="rounded-md border border-line-soft bg-surface px-2 py-0.5 text-muted">
      <span className="text-muted-2">{k}:</span> {v}
    </span>
  );
}
