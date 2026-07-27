import type { Metadata } from "next";
import Link from "next/link";
import {
  PAUTAS,
  PORTA_VOZ_ATUAL,
  ROTULO_FORMATO,
  ROTULO_STATUS,
  type StatusPauta,
} from "@/lib/pautas";

export const metadata: Metadata = { title: "Minhas Missões — Confraria" };

function corSelo(status: StatusPauta) {
  switch (status) {
    case "disponivel":
      return "border-line bg-surface-2 text-muted";
    case "reservada":
      return "border-gold-lo/60 bg-gold/10 text-gold-hi";
    case "em_revisao":
      return "border-silver-lo/50 bg-surface-2 text-silver";
    case "entregue":
      return "border-ok/40 bg-ok/10 text-ok";
    default:
      return "border-line bg-surface text-muted-2";
  }
}

export default function PortaVozHome() {
  const minhas = PAUTAS.filter((p) => p.portaVoz === PORTA_VOZ_ATUAL.nome);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text lg:text-3xl">
            Minhas missões
          </h1>
          <p className="mt-1 text-sm text-muted">
            Acompanhe o status de cada vídeo que você mandou pra guilda.
          </p>
        </div>
        <Link href="/porta-voz/nova-pauta" className="btn-gold w-auto px-6">
          + Nova missão
        </Link>
      </div>

      {minhas.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="text-muted">Você ainda não criou nenhuma missão.</p>
          <Link
            href="/porta-voz/nova-pauta"
            className="mt-4 inline-block font-medium text-gold-hi hover:underline"
          >
            Criar a primeira
          </Link>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {minhas.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-surface/60 p-4 lg:p-5"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text">
                  {p.titulo}
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {ROTULO_FORMATO[p.formato]}
                  {p.reservadaPor && p.status === "reservada" && (
                    <> · editor: {p.reservadaPor}</>
                  )}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${corSelo(
                  p.status
                )}`}
              >
                {ROTULO_STATUS[p.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
