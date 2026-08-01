"use client";

import { useEffect, useState } from "react";
import { aplicarPerfilLocal, type Candidato } from "@/lib/candidatos";

export function NomeCandidato({
  candidato,
  className = "",
}: {
  candidato: Candidato;
  className?: string;
}) {
  const [cand, setCand] = useState(candidato);

  useEffect(() => {
    setCand(aplicarPerfilLocal(candidato));
  }, [candidato]);

  return <h1 className={className}>{cand.nome}</h1>;
}
