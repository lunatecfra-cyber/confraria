import type { Metadata } from "next";
import { FilaInspetor } from "@/components/fila-inspetor";

export const metadata: Metadata = { title: "Controle de Qualidade — Oficina Amarela" };

export default function InspetorPage() {
  return <FilaInspetor />;
}
