import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Recuperar senha — Oficina Amarela" };

export default function RecuperarPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
      <Link href="/" className="mb-8 flex flex-col items-center">
        <Logo className="w-20" />
        <p className="text-gold-grad mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[0.2em]">
          OFICINA AMARELA
        </p>
      </Link>

      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
        Recuperação de senha
      </h1>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
        Essa função ainda não está disponível. Se você esqueceu sua senha, fale direto com quem administra
        a Oficina Amarela por enquanto.
      </p>

      <Link href="/login" className="mt-8 text-sm font-medium text-gold-hi hover:underline">
        Voltar pro login
      </Link>
    </main>
  );
}
