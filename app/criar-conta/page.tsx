import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { CriarContaForm } from "@/components/criar-conta-form";

export const metadata: Metadata = { title: "Criar conta — Confraria" };

export default function CriarContaPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-14">
      <Link href="/" className="mb-8 flex flex-col items-center text-center">
        <Logo className="w-20" />
        <p className="text-gold-grad mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[0.2em]">
          CONFRARIA
        </p>
      </Link>

      <p className="mb-7 text-center text-xs uppercase tracking-[0.2em] text-muted">Crie sua conta</p>

      <CriarContaForm />
    </main>
  );
}
