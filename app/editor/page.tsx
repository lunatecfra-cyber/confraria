import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { FilaPautas } from "@/components/fila-pautas";
import { EDITOR_ATUAL } from "@/lib/pautas";

export const metadata: Metadata = { title: "Fila — Confraria" };

export default function EditorPage() {
  return (
    <>
      <AppHeader editor={EDITOR_ATUAL} />
      <main className="flex-1">
        <FilaPautas />
      </main>
    </>
  );
}
