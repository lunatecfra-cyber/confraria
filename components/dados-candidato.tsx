"use client";

import { useEffect, useState } from "react";
import { aplicarPerfilLocal, type Candidato } from "@/lib/candidatos";
import { LocalProximidade } from "@/components/local-proximidade";

export function DadosCandidato({ candidato }: { candidato: Candidato }) {
  const [cand, setCand] = useState(candidato);

  useEffect(() => {
    setCand(aplicarPerfilLocal(candidato));
  }, [candidato]);

  return (
    <>
      <p className="mt-1 text-gold-hi">
        {cand.cargo}
        {cand.disputaPor && <span className="text-muted-2"> — {cand.disputaPor}</span>}
        {cand.anoEleicao && <span className="text-muted-2"> · {cand.anoEleicao}</span>}
      </p>
      <LocalProximidade
        local={cand.local}
        proximidade={cand.proximidade}
        className="mt-1 text-sm text-muted-2"
      />
      {cand.canais && <p className="mt-1 text-sm text-muted-2">{cand.canais}</p>}
      {cand.bio && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">{cand.bio}</p>
      )}
      {cand.tomComunicacao && (
        <div className="mt-3">
          <span className="inline-block rounded-full border border-gold-lo/40 bg-gold/[0.07] px-2.5 py-0.5 text-[11px] text-gold-hi">
            tom: {cand.tomComunicacao}
          </span>
        </div>
      )}
    </>
  );
}
