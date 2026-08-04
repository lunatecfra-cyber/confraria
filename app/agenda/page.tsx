import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { AgendaView } from "@/components/agenda-view";
import { lerOnboardingEditor } from "@/lib/perfil-db";
import { exigirSessao } from "@/lib/sessao-servidor";

export const metadata: Metadata = { title: "Agenda — Oficina Amarela" };

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const sessao = await exigirSessao();
  const perfil = await lerOnboardingEditor(sessao.id);
  const doBanco = perfil?.disponibilidade?.length ? perfil.disponibilidade : null;

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <AgendaView doBanco={doBanco} />
      </main>
    </>
  );
}
