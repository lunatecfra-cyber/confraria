import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { AgendaView } from "@/components/agenda-view";
import { EDITOR_ATUAL } from "@/lib/pautas";

export const metadata: Metadata = { title: "Agenda — Confraria" };

export default function AgendaPage() {
  return (
    <>
      <AppHeader editor={EDITOR_ATUAL} />
      <main className="flex-1">
        <AgendaView />
      </main>
    </>
  );
}
