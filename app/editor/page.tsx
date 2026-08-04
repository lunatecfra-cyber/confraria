import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { DesafiosDia } from "@/components/desafios-dia";
import { FilaPautas } from "@/components/fila-pautas";
import { exigirSessao } from "@/lib/sessao-servidor";

export const metadata: Metadata = { title: "Fila — Oficina Amarela" };

export default async function EditorPage() {
  await exigirSessao();

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 pt-8 lg:px-8 lg:pt-12">
          <DesafiosDia />
        </div>
        <FilaPautas />
      </main>
    </>
  );
}
