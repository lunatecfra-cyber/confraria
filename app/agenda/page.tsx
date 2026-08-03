import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { AgendaView } from "@/components/agenda-view";

export const metadata: Metadata = { title: "Agenda — Oficina Amarela" };

export default function AgendaPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <AgendaView />
      </main>
    </>
  );
}
