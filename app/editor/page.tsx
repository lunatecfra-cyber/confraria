import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { DesafiosDia } from "@/components/desafios-dia";
import { FilaPautas } from "@/components/fila-pautas";
import { pautasDisponiveis } from "@/lib/pautas-db";
import { exigirSessao } from "@/lib/sessao-servidor";

export const metadata: Metadata = { title: "Fila — Oficina Amarela" };

// a fila precisa mostrar pauta criada agora, então não pode vir de cache
export const dynamic = "force-dynamic";

export default async function EditorPage() {
  await exigirSessao();
  const pautasReais = await pautasDisponiveis();

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 pt-8 lg:px-8 lg:pt-12">
          <DesafiosDia />
        </div>
        <FilaPautas pautasReais={pautasReais} />
      </main>
    </>
  );
}
