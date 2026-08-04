"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DIAS, PERIODOS } from "@/lib/agenda";
import { ESTILOS, MAX_ESTILOS, SOFTWARES } from "@/lib/perfil";
import { CelulaDisponibilidade } from "@/components/disponibilidade-cell";
import type { OnboardingEditor } from "@/lib/perfil-db";

type Aba = "identidade" | "arte" | "forja";

const ABAS: { chave: Aba; rotulo: string }[] = [
  { chave: "identidade", rotulo: "Identidade" },
  { chave: "arte", rotulo: "Arte" },
  { chave: "forja", rotulo: "Forja" },
];

function chip(ativo: boolean, bloqueado = false) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
    bloqueado ? "cursor-not-allowed opacity-40" : ""
  } ${
    ativo
      ? "border-gold-lo bg-gold/10 text-gold-hi"
      : "border-line bg-surface text-muted hover:border-gold/30 hover:text-text"
  }`;
}

const gradeVazia = () => PERIODOS.map(() => DIAS.map(() => false));

export function CriarPerfilEditorForm({ inicial }: { inicial: OnboardingEditor }) {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("identidade");

  const [nome, setNome] = useState(inicial.nome);
  const [localizacao, setLocalizacao] = useState(inicial.localizacao);
  const [headline, setHeadline] = useState(inicial.headline);
  const [softwares, setSoftwares] = useState<string[]>(inicial.softwares);

  const [estilos, setEstilos] = useState<string[]>(inicial.estilos);
  const [portfolioLink, setPortfolioLink] = useState(inicial.portfolioLink);

  const [disp, setDisp] = useState<boolean[][]>(
    inicial.disponibilidade.length === PERIODOS.length ? inicial.disponibilidade : gradeVazia()
  );

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function alternarSoftware(s: string) {
    setSoftwares((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));
  }

  function alternarEstilo(e: string) {
    setEstilos((a) => {
      if (a.includes(e)) return a.filter((x) => x !== e);
      if (a.length >= MAX_ESTILOS) return a; // teto de 3
      return [...a, e];
    });
  }

  const toggleHorario = (p: number, d: number) =>
    setDisp((atual) =>
      atual.map((linha, i) => (i === p ? linha.map((v, j) => (j === d ? !v : v)) : linha))
    );

  const blocosLivres = disp.flat().filter(Boolean).length;

  // progresso por campo preenchido, não por aba visitada
  const checklist = [
    nome.trim() !== "",
    localizacao.trim() !== "",
    softwares.length > 0,
    estilos.length > 0,
    blocosLivres > 0,
  ];
  const progresso = Math.round((checklist.filter(Boolean).length / checklist.length) * 100);

  async function concluir() {
    if (!nome.trim()) {
      setErro("Precisa do seu nome pra continuar.");
      setAba("identidade");
      return;
    }
    setErro("");
    setSalvando(true);

    const resp = await fetch("/api/editor/perfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        localizacao,
        headline,
        softwares,
        estilos,
        portfolioLink,
        disponibilidade: disp,
      }),
    });
    setSalvando(false);

    if (!resp.ok) {
      const dados = await resp.json().catch(() => null);
      setErro(dados?.erro ?? "Não deu pra salvar. Tenta de novo.");
      return;
    }

    router.push("/editor");
    router.refresh();
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-2">
        <span>Perfil do editor</span>
        <span>{progresso}%</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-lo to-gold-hi transition-all duration-300"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="mb-6 flex items-center gap-1 rounded-xl border border-line bg-surface-2 p-1">
        {ABAS.map((a) => (
          <button
            key={a.chave}
            type="button"
            onClick={() => setAba(a.chave)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              aba === a.chave ? "bg-gold/10 text-gold-hi" : "text-muted hover:text-text"
            }`}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      {erro && (
        <p role="alert" className="mb-5 text-sm text-danger">
          {erro}
        </p>
      )}

      {/* ---- aba 1: identidade ---- */}
      {aba === "identidade" && (
        <section className="reveal flex flex-col gap-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
              Quem é você
            </h2>
            <p className="mt-1 text-sm text-muted">
              É o que o porta-voz vê antes de escolher quem edita.
            </p>

            <div className="mt-5">
              <label
                htmlFor="nome"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Nome
              </label>
              <input
                id="nome"
                className="field-input !pl-4"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setErro("");
                }}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="localizacao"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Cidade
              </label>
              <input
                id="localizacao"
                className="field-input !pl-4"
                placeholder="Ex: Petrópolis, RJ"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="headline"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Headline
              </label>
              <input
                id="headline"
                className="field-input !pl-4"
                placeholder="Ex: Editor de vídeo · cortes de impacto"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
              Sua bancada
            </h2>
            <p className="mt-1 text-sm text-muted">Onde você edita. Pode marcar mais de um.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOFTWARES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => alternarSoftware(s)}
                  aria-pressed={softwares.includes(s)}
                  className={chip(softwares.includes(s))}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- aba 2: arte ---- */}
      {aba === "arte" && (
        <section className="reveal flex flex-col gap-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
              Seu estilo
            </h2>
            <p className="mt-1 text-sm text-muted">
              Até {MAX_ESTILOS}. É o que casa você com o tom da pauta na hora do match.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ESTILOS.map((e) => {
                const ativo = estilos.includes(e);
                const bloqueado = !ativo && estilos.length >= MAX_ESTILOS;
                return (
                  <button
                    key={e}
                    type="button"
                    onClick={() => alternarEstilo(e)}
                    disabled={bloqueado}
                    aria-pressed={ativo}
                    className={chip(ativo, bloqueado)}
                  >
                    {e}
                  </button>
                );
              })}
            </div>
            {estilos.length >= MAX_ESTILOS && (
              <p className="mt-2 text-xs text-muted-2">Máximo de {MAX_ESTILOS} estilos.</p>
            )}
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
              Portfólio
            </h2>
            <p className="mt-1 text-sm text-muted">
              Um link com trabalho seu — YouTube, Vimeo, Drive, o que tiver.
            </p>
            <input
              id="portfolio"
              className="field-input !pl-4 mt-3"
              placeholder="https://…"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
            />
            <p className="mt-2 text-xs text-muted-2">
              Depois da primeira entrega aprovada, seu portfólio aqui dentro se preenche sozinho.
            </p>
          </div>
        </section>
      )}

      {/* ---- aba 3: forja ---- */}
      {aba === "forja" && (
        <section className="reveal flex flex-col gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
              Ritmo da forja
            </h2>
            <p className="mt-1 text-sm text-muted">
              Quando você fica livre pra pegar trabalho. Dá pra mudar depois na agenda.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-line bg-surface/60 p-4 lg:p-5">
            <div className="min-w-[420px]">
              <div className="mb-2 grid grid-cols-[64px_repeat(7,1fr)] gap-1.5">
                <span />
                {DIAS.map((d) => (
                  <span key={d} className="text-center text-xs font-medium text-muted">
                    {d}
                  </span>
                ))}
              </div>

              {PERIODOS.map((periodo, p) => (
                <div
                  key={periodo}
                  className="mb-1.5 grid grid-cols-[64px_repeat(7,1fr)] items-center gap-1.5"
                >
                  <span className="text-xs text-muted-2">{periodo}</span>
                  {DIAS.map((d, j) => (
                    <CelulaDisponibilidade
                      key={d}
                      livre={disp[p][j]}
                      onClick={() => toggleHorario(p, j)}
                      label={`${periodo} de ${d}: ${disp[p][j] ? "livre" : "ocupado"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-2">
            {blocosLivres} {blocosLivres === 1 ? "bloco livre" : "blocos livres"} · toque pra alternar
          </p>

          <button type="button" className="btn-gold" onClick={concluir} disabled={salvando}>
            {salvando ? "Salvando…" : "Concluir e ver a fila"}
          </button>
        </section>
      )}
    </div>
  );
}
