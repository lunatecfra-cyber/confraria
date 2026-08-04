import type { Metadata } from "next";
import { FilaInspetor } from "@/components/fila-inspetor";
import { pautasEmRevisao } from "@/lib/pautas-db";

export const metadata: Metadata = { title: "Controle de Qualidade — Oficina Amarela" };

export const dynamic = "force-dynamic";

export default async function InspetorPage() {
  const pautasReais = await pautasEmRevisao();
  return <FilaInspetor pautasReais={pautasReais} />;
}
