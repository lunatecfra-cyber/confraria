"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CARGOS_POLITICOS,
  TONS_COMUNICACAO,
  getCandidato,
  iniciais,
  lerPerfilCandidatoLocal,
  salvarPerfilCandidatoLocal,
} from "@/lib/candidatos";
import { PORTA_VOZ_ATUAL } from "@/lib/pautas";

type Chave =
  | "identidade"
  | "cargo"
  | "candidatura"
  | "local"
  | "apresentacao"
  | "analise"
  | "revisao";

const PASSOS: Chave[] = [
  "identidade",
  "cargo",
  "candidatura",
  "local",
  "apresentacao",
  "analise",
  "revisao",
];

function CriarPerfilConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viaGoogle = searchParams.get("via") === "google";
  const fileRef = useRef<HTMLInputElement>(null);
  const seed = getCandidato(PORTA_VOZ_ATUAL.nome);
  const passos = PASSOS;

  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [cargo, setCargo] = useState("");
  const [disputaPor, setDisputaPor] = useState("");
  const [anoEleicao, setAnoEleicao] = useState("2026");
  const [canais, setCanais] = useState("");
  const [local, setLocal] = useState("");
  const [bio, setBio] = useState("");
  const [tom, setTom] = useState("");
  const [erro, setErro] = useState("");

  // se já tinha montado o perfil antes, pré-preenche (vira modo "editar")
  useEffect(() => {
    const salvo = lerPerfilCandidatoLocal();
    if (salvo && salvo.nome === PORTA_VOZ_ATUAL.nome) {
      setNome(salvo.nomeExibicao ?? seed.nome);
      setFoto(salvo.foto);
      setCargo(salvo.cargo ?? "");
      setDisputaPor(salvo.disputaPor ?? "");
      setAnoEleicao(salvo.anoEleicao ?? "2026");
      setCanais(salvo.canais ?? "");
      setLocal(salvo.local ?? seed.local);
      setBio(salvo.bio ?? seed.bio);
      setTom(salvo.tomComunicacao ?? "");
    } else {
      setNome(seed.nome);
      setLocal(seed.local);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onEscolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => setFoto(leitor.result as string);
    leitor.readAsDataURL(arquivo);
  }

  const etapa = passos[passo];

  function validarPasso(): boolean {
    if (etapa === "identidade" && !nome.trim()) {
      setErro("Precisa do seu nome pra continuar.");
      return false;
    }
    if (etapa === "cargo" && !cargo) {
      setErro("Escolhe o cargo pra continuar.");
      return false;
    }
    if (etapa === "local" && !local.trim()) {
      setErro("Conta mais ou menos onde você fica.");
      return false;
    }
    setErro("");
    return true;
  }

  function avancar() {
    if (!validarPasso()) return;
    setErro("");
    setPasso((p) => Math.min(p + 1, passos.length - 1));
  }

  function voltar() {
    setErro("");
    setPasso((p) => Math.max(p - 1, 0));
  }

  function concluir() {
    salvarPerfilCandidatoLocal({
      nome: PORTA_VOZ_ATUAL.nome,
      nomeExibicao: nome.trim() || undefined,
      foto,
      cargo,
      disputaPor: disputaPor.trim() || undefined,
      anoEleicao: anoEleicao.trim() || undefined,
      canais: canais.trim() || undefined,
      local: local.trim(),
      bio: bio.trim(),
      tomComunicacao: tom || undefined,
    });
    router.push("/porta-voz");
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* barra de progresso */}
        <div className="mb-2 flex items-center justify-between text-xs text-muted-2">
          <span>
            Passo {passo + 1} de {passos.length}
          </span>
          <span>{Math.round(((passo + 1) / passos.length) * 100)}%</span>
        </div>
        <div className="mb-9 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-lo to-gold-hi transition-all duration-300"
            style={{ width: `${((passo + 1) / passos.length) * 100}%` }}
          />
        </div>

        {viaGoogle && passo === 0 && (
          <p className="mb-5 rounded-lg border border-gold-lo/40 bg-gold/[0.06] px-3 py-2 text-xs text-gold-hi">
            A foto pode vir da sua conta Google depois. Por ora, confirma seu nome.
          </p>
        )}

        {/* ---- identidade: nome + foto (foto só no caminho manual) ---- */}
        {etapa === "identidade" && (
          <section className="reveal">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
              Quem é você?
            </h1>
            <p className="mt-2 text-sm text-muted">
              {viaGoogle
                ? "Confirma seu nome — é assim que vão te chamar na Confraria."
                : "Seu nome e uma foto — é o que editores e o público vão ver primeiro."}
            </p>

            {!viaGoogle && (
              <div className="mt-8 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="group relative grid h-36 w-36 place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface transition-colors hover:border-gold/50"
                >
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- preview local, sem otimização
                    <img src={foto} alt="Sua foto" className="h-full w-full object-cover" />
                  ) : (
                    <span
                      className="grid h-full w-full place-items-center font-[family-name:var(--font-display)] text-4xl font-semibold text-black/80"
                      style={{ background: seed.tint }}
                    >
                      {iniciais(nome || seed.nome)}
                    </span>
                  )}
                  <span className="absolute inset-0 hidden items-center justify-center bg-ink/60 text-xs font-medium text-silver-hi group-hover:flex">
                    {foto ? "Trocar" : "Enviar foto"}
                  </span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onEscolherFoto}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 text-sm font-medium text-gold-hi hover:underline"
                >
                  {foto ? "Escolher outra foto" : "Escolher da galeria"}
                </button>
              </div>
            )}

            <div className="mt-7">
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
          </section>
        )}

        {/* ---- cargo ---- */}
        {etapa === "cargo" && (
          <section className="reveal">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
              Por qual cargo você disputa?
            </h1>
            <p className="mt-2 text-sm text-muted">
              O cargo que você já ocupa, ou vai disputar.
            </p>

            <div className="mt-7">
              <label
                htmlFor="cargo"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Cargo
              </label>
              <select
                id="cargo"
                className="field-input !pl-4"
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value);
                  setErro("");
                }}
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {CARGOS_POLITICOS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label
                htmlFor="disputaPor"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Por onde (opcional)
              </label>
              <input
                id="disputaPor"
                className="field-input !pl-4"
                placeholder="Ex: Rio de Janeiro"
                value={disputaPor}
                onChange={(e) => setDisputaPor(e.target.value)}
              />
            </div>
          </section>
        )}

        {/* ---- candidatura: ano + canais ---- */}
        {etapa === "candidatura" && (
          <section className="reveal">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
              Sobre a sua candidatura
            </h1>
            <p className="mt-2 text-sm text-muted">Ano da eleição e onde te encontram.</p>

            <div className="mt-7">
              <label
                htmlFor="ano"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Ano em que vai ser eleito
              </label>
              <input
                id="ano"
                className="field-input !pl-4"
                placeholder="Ex: 2026"
                inputMode="numeric"
                value={anoEleicao}
                onChange={(e) => setAnoEleicao(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="canais"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Canais (opcional)
              </label>
              <input
                id="canais"
                className="field-input !pl-4"
                placeholder="Ex: @seuinstagram"
                value={canais}
                onChange={(e) => setCanais(e.target.value)}
              />
            </div>
          </section>
        )}

        {/* ---- local ---- */}
        {etapa === "local" && (
          <section className="reveal">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
              Onde você fica?
            </h1>
            <p className="mt-2 text-sm text-muted">
              Mais ou menos — cidade e estado já ajudam.
            </p>

            <div className="mt-7">
              <label
                htmlFor="local"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Região
              </label>
              <input
                id="local"
                className="field-input !pl-4"
                placeholder="Ex: Petrópolis, RJ"
                value={local}
                onChange={(e) => {
                  setLocal(e.target.value);
                  setErro("");
                }}
              />
            </div>
          </section>
        )}

        {/* ---- apresentação ---- */}
        {etapa === "apresentacao" && (
          <section className="reveal">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
              Uma breve apresentação
            </h1>
            <p className="mt-2 text-sm text-muted">
              Duas ou três frases sobre você — é o que aparece no seu perfil.
            </p>

            <div className="mt-7">
              <textarea
                className="field-input !pl-4"
                rows={5}
                placeholder="Fale um pouquinho sobre você…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </section>
        )}

        {/* ---- análise simples de perfil ---- */}
        {etapa === "analise" && (
          <section className="reveal">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
              Como você se comunica?
            </h1>
            <p className="mt-2 text-sm text-muted">
              Ajuda a Confraria a te indicar editores com o tom certo.
            </p>

            <div className="mt-7 flex flex-col gap-2.5">
              {TONS_COMUNICACAO.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTom(t)}
                  aria-pressed={tom === t}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    tom === t
                      ? "border-gold-lo bg-gold/10 text-gold-hi"
                      : "border-line bg-surface text-muted hover:border-gold/30 hover:text-text"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ---- revisão ---- */}
        {etapa === "revisao" && (
          <section className="reveal">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
              Confere como ficou
            </h1>
            <p className="mt-2 text-sm text-muted">É assim que vão te ver na Confraria.</p>

            <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-surface/60">
              <div
                className="h-16"
                style={{
                  background:
                    "radial-gradient(120% 160% at 15% 0%, rgba(244,206,31,0.22), transparent 55%), linear-gradient(120deg,#17140a,#0e0e12 60%,#0a0a0b)",
                }}
              />
              <div className="px-5 pb-5">
                <div className="-mt-9">
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- preview local
                    <img
                      src={foto}
                      alt={nome || seed.nome}
                      className="h-16 w-16 rounded-xl object-cover"
                      style={{ boxShadow: "0 0 0 3px var(--color-ink), 0 0 0 4px rgba(244,206,31,0.55)" }}
                    />
                  ) : (
                    <span
                      className="grid h-16 w-16 place-items-center rounded-xl font-[family-name:var(--font-display)] text-xl font-semibold text-black/80"
                      style={{
                        background: seed.tint,
                        boxShadow: "0 0 0 3px var(--color-ink), 0 0 0 4px rgba(244,206,31,0.55)",
                      }}
                    >
                      {iniciais(nome || seed.nome)}
                    </span>
                  )}
                </div>
                <p className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold text-text">
                  {nome || seed.nome}
                </p>
                <p className="text-sm text-gold-hi">
                  {cargo || "—"}
                  {disputaPor && <span className="text-muted-2"> — {disputaPor}</span>}
                  {anoEleicao && <span className="text-muted-2"> · {anoEleicao}</span>}
                </p>
                <p className="mt-0.5 text-xs text-muted-2">
                  {local || "—"}
                  {canais && <span> · {canais}</span>}
                </p>
                {bio && <p className="mt-3 text-sm leading-relaxed text-muted">{bio}</p>}
                {tom && (
                  <p className="mt-3 inline-block rounded-full border border-gold-lo/40 bg-gold/[0.07] px-2.5 py-0.5 text-[11px] text-gold-hi">
                    tom: {tom}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {erro && (
          <p role="alert" className="mt-4 text-sm text-danger">
            {erro}
          </p>
        )}

        <div className="mt-8 flex gap-3">
          {passo > 0 && (
            <button type="button" className="btn-ghost w-32" onClick={voltar}>
              Voltar
            </button>
          )}
          {passo < passos.length - 1 ? (
            <button type="button" className="btn-gold flex-1" onClick={avancar}>
              {etapa === "identidade" && !viaGoogle && !foto ? "Continuar sem foto" : "Continuar"}
            </button>
          ) : (
            <button type="button" className="btn-gold flex-1" onClick={concluir}>
              Concluir e ver minhas missões
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CriarPerfilPage() {
  return (
    <Suspense fallback={null}>
      <CriarPerfilConteudo />
    </Suspense>
  );
}
