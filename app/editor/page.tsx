import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { DesafiosDia } from "@/components/desafios-dia";
import { FilaPautas } from "@/components/fila-pautas";
import { entregasAprovadas, pautaReservadaPor, pautasDisponiveis } from "@/lib/pautas-db";
import { lerCandidatosPorApelidos } from "@/lib/candidato-db";
import { exigirSessao } from "@/lib/sessao-servidor";

export const metadata: Metadata = { title: "Fila — Oficina Amarela" };

// a fila precisa mostrar pauta criada agora, então não pode vir de cache
export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const sessao = await exigirSessao();
  const [pautasReais, minhaAtual, entregas] = await Promise.all([
    pautasDisponiveis(),
    pautaReservadaPor(sessao.id),
    entregasAprovadas(sessao.id),
  ]);

  // perfil real de cada porta-voz que aparece na fila, buscado de uma vez só
  const apelidos = [...pautasReais, minhaAtual]
    .filter((p): p is NonNullable<typeof p> => !!p?.portaVozApelido)
    .map((p) => p.portaVozApelido!);
  const candidatosMapa = await lerCandidatosPorApelidos([...new Set(apelidos)]);
  const candidatosPorApelido = Object.fromEntries(candidatosMapa);

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 pt-8 lg:px-8 lg:pt-12">
          <DesafiosDia />
        </div>
        <FilaPautas
          pautasReais={pautasReais}
          minhaAtual={minhaAtual}
          entregas={entregas}
          candidatosPorApelido={candidatosPorApelido}
        />
      </main>
    </>
  );
}
