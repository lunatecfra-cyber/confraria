import type { Metadata } from "next";
import { CriarPerfilCandidatoForm } from "@/components/criar-perfil-candidato-form";
import { lerOnboardingCandidato } from "@/lib/candidato-db";
import { exigirSessao } from "@/lib/sessao-servidor";

export const metadata: Metadata = { title: "Montar perfil — Oficina Amarela" };

export const dynamic = "force-dynamic";

export default async function CriarPerfilPage() {
  const sessao = await exigirSessao();
  const inicial = (await lerOnboardingCandidato(sessao.id)) ?? {
    nome: sessao.nome,
    fotoUrl: "",
    cargo: "",
    disputaPor: "",
    anoEleicao: "2026",
    localizacao: "",
    bandeiras: [],
    tomComunicacao: "",
    palavrasChave: [],
    redes: {},
    bio: "",
    perfilCompleto: false,
  };

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-12">
      <CriarPerfilCandidatoForm inicial={inicial} />
    </div>
  );
}
