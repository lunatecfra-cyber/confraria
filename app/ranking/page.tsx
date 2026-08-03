import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { EDITOR_ATUAL } from "@/lib/pautas";
import { EDITORES } from "@/lib/perfil";

export const metadata: Metadata = { title: "Ranking — Oficina Amarela" };

export default function RankingPage() {
  const ordenado = [...EDITORES].sort((a, b) => b.reputacao - a.reputacao);

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-8 lg:px-8 lg:py-12">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text lg:text-3xl">
            Ranking da guilda
          </h1>
          <p className="mt-1 text-sm text-muted">
            Ordenado por XP (reputação). Constância vale mais que um pico isolado.
          </p>

          <ol className="mt-6 flex flex-col gap-2">
            {ordenado.map((e, i) => {
              const eu = e.apelido === EDITOR_ATUAL.apelido;
              const pos = i + 1;
              return (
                <li
                  key={e.apelido}
                  className={`flex items-center gap-4 rounded-xl border p-4 ${
                    eu
                      ? "border-gold-lo/60 bg-gold/[0.07]"
                      : "border-line bg-surface/60"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 flex-none place-items-center rounded-lg font-[family-name:var(--font-display)] text-base font-semibold ${
                      pos === 1
                        ? "bg-gradient-to-b from-gold to-gold-lo text-black/80"
                        : "border border-line bg-ink-2 text-muted"
                    }`}
                  >
                    {pos}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text">
                      {eu ? "Você" : `@${e.apelido}`}
                    </p>
                    <p className="text-xs text-muted-2">
                      {e.nivel} · {e.entregues} entregues
                      {e.streak > 0 && (
                        <>
                          {" "}
                          · <span aria-hidden="true">🔥</span> {e.streak}
                        </>
                      )}
                    </p>
                  </div>

                  <span className="flex-none font-[family-name:var(--font-display)] text-lg font-semibold text-gold-hi">
                    {e.reputacao} XP
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </main>
    </>
  );
}
