"use client";

import { useRouter } from "next/navigation";

export function BotaoSair({ className }: { className?: string }) {
  const router = useRouter();

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={sair} className={className}>
      Sair
    </button>
  );
}
