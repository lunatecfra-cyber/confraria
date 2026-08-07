import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { EscolherPapelForm } from "@/components/escolher-papel-form";
import { verificarIdentidadePendente } from "@/lib/sessao";

export const metadata: Metadata = { title: "Quase lá — Oficina Amarela" };

export default async function EscolherPapelPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const pendente = t ? await verificarIdentidadePendente(t) : null;

  if (!pendente) {
    redirect(`/login?erro_google=${encodeURIComponent("Sessão expirou, tenta de novo.")}`);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-14">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo className="w-16" />
        <p className="text-gold-grad mt-3 font-[family-name:var(--font-display)] text-xl font-semibold tracking-[0.15em]">
          OFICINA AMARELA
        </p>
      </div>
      <EscolherPapelForm token={t!} nome={pendente.nome} foto={pendente.foto} />
    </main>
  );
}
