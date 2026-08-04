// Pautas de verdade, no Postgres. Só roda em Node (Server Components e
// Route Handlers) — nunca importar isto de componente "use client".
//
// Por que banco e não localStorage: quem cria a pauta (porta-voz) e quem pega
// (editor) são pessoas diferentes, em navegadores diferentes. localStorage é
// isolado por navegador, então nunca chegaria de um pro outro.
import { sql } from "@/lib/db";
import type { Formato, Pauta, StatusPauta } from "@/lib/pautas";

type LinhaPauta = {
  id: number;
  porta_voz_nome: string;
  titulo: string;
  formato: Formato;
  brief_tom: string | null;
  brief_cor: string | null;
  brief_fonte: string | null;
  brief_refs: string | null;
  drive_link: string | null;
  status: StatusPauta;
  reservada_por_apelido: string | null;
  reservada_ate: string | null;
  entrega_link: string | null;
  notas_inspetor: string | null;
  criada_em: string;
};

// converte a linha do banco pro mesmo formato que as telas já usam,
// assim nada de interface precisa ser reescrito
function paraPauta(l: LinhaPauta): Pauta {
  return {
    id: `db-${l.id}`,
    portaVoz: l.porta_voz_nome,
    titulo: l.titulo,
    formato: l.formato,
    brief: {
      tom: l.brief_tom ?? undefined,
      cor: l.brief_cor ?? undefined,
      fonte: l.brief_fonte ?? undefined,
      refs: l.brief_refs ?? undefined,
    },
    status: l.status,
    criadaEm: new Date(l.criada_em).toISOString(),
    reservadaPor: l.reservada_por_apelido ?? undefined,
    reservadaAte: l.reservada_ate ? new Date(l.reservada_ate).toISOString() : undefined,
    driveLink: l.drive_link ?? undefined,
    entregaLink: l.entrega_link ?? undefined,
    notasInspetor: l.notas_inspetor ?? undefined,
  };
}

const SELECT_BASE = sql`
  SELECT p.id, u.nome AS porta_voz_nome, p.titulo, p.formato,
         p.brief_tom, p.brief_cor, p.brief_fonte, p.brief_refs,
         p.drive_link, p.status, p.reservada_ate, p.entrega_link,
         p.notas_inspetor, p.criada_em,
         e.apelido AS reservada_por_apelido
  FROM pautas p
  JOIN users u ON u.id = p.porta_voz_id
  LEFT JOIN users e ON e.id = p.reservada_por_id
`;

export async function criarPauta(dados: {
  portaVozId: number;
  titulo: string;
  formato: Formato;
  driveLink?: string;
  tom?: string;
  cor?: string;
  fonte?: string;
  refs?: string;
}): Promise<{ ok: true; id: number } | { ok: false; erro: string }> {
  const titulo = dados.titulo.trim();
  if (!titulo) return { ok: false, erro: "Dê um título pra pauta." };
  if (dados.formato !== "short" && dados.formato !== "longo") {
    return { ok: false, erro: "Escolha o formato." };
  }

  const [linha] = await sql`
    INSERT INTO pautas (porta_voz_id, titulo, formato, drive_link,
                        brief_tom, brief_cor, brief_fonte, brief_refs)
    VALUES (${dados.portaVozId}, ${titulo}, ${dados.formato},
            ${dados.driveLink?.trim() || null},
            ${dados.tom?.trim() || null}, ${dados.cor?.trim() || null},
            ${dados.fonte?.trim() || null}, ${dados.refs?.trim() || null})
    RETURNING id
  `;
  return { ok: true, id: linha.id };
}

/** As pautas de um porta-voz específico (a home dele). */
export async function pautasDoPortaVoz(portaVozId: number): Promise<Pauta[]> {
  const linhas = await sql`
    ${SELECT_BASE} WHERE p.porta_voz_id = ${portaVozId} ORDER BY p.criada_em DESC
  `;
  return (linhas as unknown as LinhaPauta[]).map(paraPauta);
}

/** Tudo que está livre pra qualquer editor pegar (a fila). */
export async function pautasDisponiveis(): Promise<Pauta[]> {
  const linhas = await sql`
    ${SELECT_BASE} WHERE p.status = 'disponivel' ORDER BY p.criada_em ASC
  `;
  return (linhas as unknown as LinhaPauta[]).map(paraPauta);
}
