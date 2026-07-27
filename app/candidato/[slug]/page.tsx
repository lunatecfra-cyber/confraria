import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { EDITOR_ATUAL, PAUTAS, ROTULO_FORMATO, ROTULO_STATUS } from "@/lib/pautas";
import { getCandidatoPorSlug, iniciais } from "@/lib/candidatos";
import { LocalProximidade } from "@/components/local-proximidade";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cand = getCandidatoPorSlug(slug);
  return { title: cand ? `${cand.nome} — Confraria` : "Confraria" };
}

export default async function CandidatoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cand = getCandidatoPorSlug(slug);
  if (!cand) notFound();

  const pautas = PAUTAS.filter((p) => p.portaVoz === cand.nome);
  const naFila = pautas.filter((p) => p.status === "disponivel").length;
  const emAndamento = pautas.filter((p) =>
    ["reservada", "minha", "em_revisao", "reedicao"].includes(p.status)
  ).length;

  return (
    <>
      <AppHeader editor={EDITOR_ATUAL} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:px-8 lg:py-10">
          <Link
            href="/editor"
            className="text-sm text-muted transition-colors hover:text-silver-hi"
          >
            ← Fila
          </Link>

          <section className="reveal mt-4 overflow-hidden rounded-2xl border border-line bg-surface/60">
            <div className="relative h-28 lg:h-36">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 160% at 15% 0%, rgba(244,206,31,0.20), transparent 55%), linear-gradient(120deg,#17140a,#0e0e12 60%,#0a0a0b)",
                }}
              />
              <Image
                src="/emblema.png"
                alt=""
                aria-hidden="true"
                width={365}
                height={365}
                className="pointer-events-none absolute -right-4 top-1/2 w-36 -translate-y-1/2 opacity-[0.08] lg:w-48"
              />
            </div>

            <div className="px-5 pb-6 lg:px-8">
              <div className="relative z-10 -mt-12 flex items-end gap-4">
                <span
                  className="grid h-24 w-24 flex-none place-items-center rounded-2xl font-[family-name:var(--font-display)] text-3xl font-semibold text-black/80"
                  style={{
                    background: cand.tint,
                    boxShadow:
                      "0 0 0 4px var(--color-ink), 0 12px 34px rgba(0,0,0,0.6)",
                  }}
                >
                  {iniciais(cand.nome)}
                </span>
              </div>

              <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-text lg:text-3xl">
                {cand.nome}
              </h1>
              <p className="mt-1 text-gold-hi">{cand.cargo}</p>
              <LocalProximidade
                local={cand.local}
                proximidade={cand.proximidade}
                className="mt-1 text-sm text-muted-2"
              />
              <p className="mt-1 text-[11px] text-muted-2">
                <span className="text-gold-hi">●</span> perto de você ·{" "}
                <span className="text-[#5a5a64]">●</span> longe
              </p>
              {cand.bio && (
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
                  {cand.bio}
                </p>
              )}

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                <Stat valor={String(pautas.length)} rotulo="missões" />
                <Stat valor={String(naFila)} rotulo="na fila" />
                <Stat valor={String(emAndamento)} rotulo="em produção" />
              </dl>
            </div>
          </section>

          <section className="reveal mt-6 rounded-2xl border border-line bg-surface/60 p-5 lg:p-6" style={{ animationDelay: "0.05s" }}>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-gold">
              Missões de {cand.nome}
            </h2>
            {pautas.length === 0 ? (
              <p className="text-sm text-muted">Nenhuma missão ainda.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {pautas.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-surface/40 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-text">
                        {p.titulo}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-2">
                        {ROTULO_FORMATO[p.formato]}
                      </p>
                    </div>
                    <span className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted">
                      {ROTULO_STATUS[p.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function Stat({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div>
      <dd className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
        {valor}
      </dd>
      <dt className="text-xs uppercase tracking-[0.1em] text-muted-2">{rotulo}</dt>
    </div>
  );
}
