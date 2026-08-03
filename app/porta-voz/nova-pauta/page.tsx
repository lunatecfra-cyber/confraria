import type { Metadata } from "next";
import Link from "next/link";
import { NovaPautaForm } from "@/components/nova-pauta-form";

export const metadata: Metadata = { title: "Nova Missão — Oficina Amarela" };

export default function NovaPautaPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
      <div className="pt-6">
        <Link
          href="/porta-voz"
          className="text-sm text-muted transition-colors hover:text-silver-hi"
        >
          ← Minhas missões
        </Link>
      </div>
      <NovaPautaForm />
    </div>
  );
}
