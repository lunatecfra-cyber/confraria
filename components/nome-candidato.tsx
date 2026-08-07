import type { Candidato } from "@/lib/candidatos";

export function NomeCandidato({
  candidato,
  className = "",
}: {
  candidato: Candidato;
  className?: string;
}) {
  return <h1 className={className}>{candidato.nome}</h1>;
}
