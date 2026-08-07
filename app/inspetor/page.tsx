import type { Metadata } from "next";
import { FilaInspetor } from "@/components/fila-inspetor";
import { pautasEmRevisao } from "@/lib/pautas-db";
import { lerCandidatosPorApelidos } from "@/lib/candidato-db";

export const metadata: Metadata = { title: "Controle de Qualidade — Oficina Amarela" };

export const dynamic = "force-dynamic";

export default async function InspetorPage() {
  const pautasReais = await pautasEmRevisao();
  const apelidos = pautasReais.filter((p) => p.portaVozApelido).map((p) => p.portaVozApelido!);
  const candidatosMapa = await lerCandidatosPorApelidos([...new Set(apelidos)]);
  const candidatosPorApelido = Object.fromEntries(candidatosMapa);
  return <FilaInspetor pautasReais={pautasReais} candidatosPorApelido={candidatosPorApelido} />;
}
