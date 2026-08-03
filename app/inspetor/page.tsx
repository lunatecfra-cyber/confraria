import type { Metadata } from "next";
import { FilaInspetor } from "@/components/fila-inspetor";

export const metadata: Metadata = { title: "Revisão — Oficina Amarela" };

export default function InspetorPage() {
  return <FilaInspetor />;
}
