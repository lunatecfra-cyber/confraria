import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { AgendaView } from "@/components/agenda-view";

export const metadata: Metadata = { title: "Agenda — Oficina Amarela" };

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <AgendaView />
      </main>
    </>
  );
}
