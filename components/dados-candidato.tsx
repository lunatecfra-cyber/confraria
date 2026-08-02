"use client";

import { useEffect, useState } from "react";
import { aplicarPerfilLocal, type Candidato } from "@/lib/candidatos";
import { LocalProximidade } from "@/components/local-proximidade";
import { IconInstagram, IconTiktok, IconX, IconYoutube } from "@/components/icones-redes";

export function DadosCandidato({ candidato }: { candidato: Candidato }) {
  const [cand, setCand] = useState(candidato);

  useEffect(() => {
    setCand(aplicarPerfilLocal(candidato));
  }, [candidato]);

  const redes = cand.redes;
  const temRedes = !!(redes?.instagram || redes?.youtube || redes?.tiktok || redes?.x);

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
      {temRedes && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-2">
          {redes?.instagram && (
            <span className="inline-flex items-center gap-1">
              <IconInstagram className="h-3.5 w-3.5" />
              {redes.instagram}
            </span>
          )}
          {redes?.youtube && (
            <span className="inline-flex items-center gap-1">
              <IconYoutube className="h-3.5 w-3.5" />
              {redes.youtube}
            </span>
          )}
          {redes?.tiktok && (
            <span className="inline-flex items-center gap-1">
              <IconTiktok className="h-3.5 w-3.5" />
              {redes.tiktok}
            </span>
          )}
          {redes?.x && (
            <span className="inline-flex items-center gap-1">
              <IconX className="h-3.5 w-3.5" />
              {redes.x}
            </span>
          )}
        </div>
      )}
      {cand.bio && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">{cand.bio}</p>
      )}
      {(cand.tomComunicacao || (cand.bandeiras && cand.bandeiras.length > 0)) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cand.tomComunicacao && (
            <span className="inline-block rounded-full border border-gold-lo/40 bg-gold/[0.07] px-2.5 py-0.5 text-[11px] text-gold-hi">
              tom: {cand.tomComunicacao}
            </span>
          )}
          {cand.bandeiras?.map((b) => (
            <span
              key={b}
              className="inline-block rounded-full border border-gold-lo/30 bg-gold/10 px-2.5 py-0.5 text-[11px] text-gold-hi"
            >
              {b}
            </span>
          ))}
        </div>
      )}
      {cand.palavrasChave && cand.palavrasChave.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {cand.palavrasChave.map((p) => (
            <span
              key={p}
              className="inline-block rounded-full border border-line px-2.5 py-0.5 text-[11px] italic text-muted-2"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
