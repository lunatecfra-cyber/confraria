import Link from "next/link";
import { Logo } from "@/components/logo";
import { PORTA_VOZ_ATUAL } from "@/lib/pautas";

export default function PortaVozLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-line-soft">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/porta-voz" className="flex items-center gap-3">
            <Logo className="w-9" />
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.24em] text-gold">
              CONFRARIA
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/porta-voz/perfil"
              className="hidden text-sm text-muted transition-colors hover:text-text sm:block"
            >
              {PORTA_VOZ_ATUAL.nome} · porta-voz
            </Link>
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-silver-hi"
            >
              Sair
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
