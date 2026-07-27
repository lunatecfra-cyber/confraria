import type { Metadata } from "next";
import { FilaInspetor } from "@/components/fila-inspetor";

export const metadata: Metadata = { title: "Revisão — Confraria" };

export default function InspetorPage() {
  return <FilaInspetor />;
}
