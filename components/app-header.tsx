import Link from "next/link";
import { Logo } from "@/components/logo";
import { EDITOR_ATUAL } from "@/lib/pautas";

export function AppHeader() {
  const editor = EDITOR_ATUAL;
  return (
    <header className="border-b border-line-soft">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/editor" className="flex items-center gap-3">
            <Logo className="w-9" />
            <span className="hidden font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.24em] text-gold sm:inline">
              CONFRARIA
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/editor" className="text-muted transition-colors hover:text-text">
              Fila
            </Link>
            <Link href="/agenda" className="text-muted transition-colors hover:text-text">
              Agenda
            </Link>
            <Link href="/ranking" className="text-muted transition-colors hover:text-text">
              Ranking
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/perfil"
            className="hidden text-right transition-opacity hover:opacity-80 sm:block"
          >
            <p className="text-sm font-medium text-text">{editor.apelido}</p>
            <p className="text-xs text-muted">
              {editor.entregues} entregues
              {editor.nota !== null && ` · nota ${editor.nota}`}
            </p>
          </Link>

          <Link
            href="/perfil"
            className="rounded-full border border-gold-lo/60 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-hi transition-colors hover:bg-gold/20"
          >
            {editor.nivel}
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
  );
}
