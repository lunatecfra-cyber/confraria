"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ANOS_ELEICAO,
  BANDEIRAS_TEMAS,
  CARGOS_POLITICOS,
  ESTADOS_BRASIL,
  EXEMPLOS_TOM,
  PALAVRAS_CHAVE_SUGERIDAS,
  TONS_COMUNICACAO,
  gerarBioSugerida,
  getCandidato,
  iniciais,
  lerPerfilCandidatoLocal,
  salvarPerfilCandidatoLocal,
  type Candidato,
  type RedesSociais,
} from "@/lib/candidatos";
import { IconInstagram, IconTiktok, IconX, IconYoutube } from "@/components/icones-redes";

type Aba = "objetivo" | "estilo" | "canais";

const ABAS: { chave: Aba; rotulo: string }[] = [
  { chave: "objetivo", rotulo: "Objetivo e Temas" },
  { chave: "estilo", rotulo: "Estilo e Bio" },
  { chave: "canais", rotulo: "Canais e Visual" },
];

function chip(ativo: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
    ativo
      ? "border-gold-lo bg-gold/10 text-gold-hi"
      : "border-line bg-surface text-muted hover:border-gold/30 hover:text-text"
  }`;
}

function CriarPerfilConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viaGoogle = searchParams.get("via") === "google";
  const fileRef = useRef<HTMLInputElement>(null);
  const bioAutoTentada = useRef(false);

  const [nomeConta, setNomeConta] = useState<string | null>(null);
  const [seed, setSeed] = useState<Candidato | null>(null);
  const [aba, setAba] = useState<Aba>("objetivo");

  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [cargo, setCargo] = useState("");
  const [disputaPor, setDisputaPor] = useState("");
  const [anoEleicao, setAnoEleicao] = useState("2026");
  const [local, setLocal] = useState("");
  const [bandeiras, setBandeiras] = useState<string[]>([]);

  const [tom, setTom] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [novaPalavraChave, setNovaPalavraChave] = useState("");
  const [bio, setBio] = useState("");

  const [redes, setRedes] = useState<RedesSociais>({});

  const [erro, setErro] = useState("");

  // busca quem está logado, monta o ponto de partida e, se já tinha montado o
  // perfil antes, pré-preenche por cima (vira modo "editar")
  useEffect(() => {
    fetch("/api/auth/sessao")
      .then((r) => (r.ok ? r.json() : null))
      .then((sessao: { nome: string } | null) => {
        if (!sessao) {
          router.push("/login");
          return;
        }
        const s = getCandidato(sessao.nome);
        setNomeConta(sessao.nome);
        setSeed(s);

        const salvo = lerPerfilCandidatoLocal();
        if (salvo && salvo.nome === sessao.nome) {
          setNome(salvo.nomeExibicao ?? s.nome);
          setFoto(salvo.foto);
          setCargo(salvo.cargo ?? "");
          setDisputaPor(salvo.disputaPor ?? "");
          setAnoEleicao(salvo.anoEleicao ?? "2026");
          setLocal(salvo.local ?? s.local);
          setBandeiras(salvo.bandeiras ?? []);
          setTom(salvo.tomComunicacao ?? "");
          setPalavrasChave(salvo.palavrasChave ?? []);
          setBio(salvo.bio ?? s.bio);
          setRedes(salvo.redes ?? {});
        } else {
          setNome(s.nome);
          setLocal(s.local);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sugestão automática de bio: dispara uma única vez, na primeira vez que a
  // aba "estilo" abre com a bio ainda vazia — nunca sobrescreve texto digitado
  useEffect(() => {
    if (aba === "estilo" && !bioAutoTentada.current && !bio.trim()) {
      bioAutoTentada.current = true;
      const sugestao = gerarBioSugerida({ cargo, disputaPor, local, bandeiras, tom });
      if (sugestao) setBio(sugestao);
    }
  }, [aba, bio, cargo, disputaPor, local, bandeiras, tom]);

  function onEscolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => setFoto(leitor.result as string);
    leitor.readAsDataURL(arquivo);
  }

  function alternarBandeira(b: string) {
    setBandeiras((atual) => (atual.includes(b) ? atual.filter((x) => x !== b) : [...atual, b]));
  }

  function alternarPalavraChave(p: string) {
    setPalavrasChave((atual) => {
      if (atual.includes(p)) return atual.filter((x) => x !== p);
      if (atual.length >= 3) return atual;
      return [...atual, p];
    });
  }

  function adicionarPalavraDigitada() {
    const p = novaPalavraChave.trim();
    if (!p || palavrasChave.length >= 3 || palavrasChave.includes(p)) return;
    setPalavrasChave((atual) => [...atual, p]);
    setNovaPalavraChave("");
  }

  function gerarSugestaoBio() {
    const sugestao = gerarBioSugerida({ cargo, disputaPor, local, bandeiras, tom });
    if (sugestao) setBio(sugestao);
  }

  function atualizarRede(campo: keyof RedesSociais, valor: string) {
    setRedes((atual) => ({ ...atual, [campo]: valor.trim() || undefined }));
  }

  if (!seed) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-12 text-sm text-muted">
        Carregando…
      </div>
    );
  }

  function concluir() {
    if (!nomeConta) return;
    if (!nome.trim()) {
      setErro("Precisa do seu nome pra continuar.");
      setAba("objetivo");
      return;
    }
    if (!cargo) {
      setErro("Escolhe o cargo pra continuar.");
      setAba("objetivo");
      return;
    }
    if (!local.trim()) {
      setErro("Conta mais ou menos onde você fica.");
      setAba("objetivo");
      return;
    }
    setErro("");
    salvarPerfilCandidatoLocal({
      nome: nomeConta,
      nomeExibicao: nome.trim() || undefined,
      foto,
      cargo,
      disputaPor: disputaPor.trim() || undefined,
      anoEleicao: anoEleicao.trim() || undefined,
      redes: Object.values(redes).some(Boolean) ? redes : undefined,
      local: local.trim(),
      bio: bio.trim(),
      tomComunicacao: tom || undefined,
      bandeiras: bandeiras.length > 0 ? bandeiras : undefined,
      palavrasChave: palavrasChave.length > 0 ? palavrasChave : undefined,
    });
    router.push("/porta-voz");
  }

  const checklist = [nome, cargo, disputaPor, local, bio, tom];
  const progresso = Math.round(
    (checklist.filter((c) => c.trim() !== "").length / checklist.length) * 100
  );

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* barra de progresso */}
        <div className="mb-2 flex items-center justify-between text-xs text-muted-2">
          <span>Perfil do candidato</span>
          <span>{progresso}%</span>
        </div>
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-lo to-gold-hi transition-all duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>

        {/* abas */}
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

        {viaGoogle && aba === "objetivo" && (
          <p className="mb-5 rounded-lg border border-gold-lo/40 bg-gold/[0.06] px-3 py-2 text-xs text-gold-hi">
            A foto pode vir da sua conta Google depois. Por ora, confirma seu nome.
          </p>
        )}

        {erro && (
          <p role="alert" className="mb-5 text-sm text-danger">
            {erro}
          </p>
        )}

        {/* ---- aba 1: objetivo e temas ---- */}
        {aba === "objetivo" && (
          <section className="reveal flex flex-col gap-9">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                Quem é você
              </h2>
              <p className="mt-1 text-sm text-muted">
                Nome e foto — é o que editores e o público vão ver primeiro.
              </p>

              <div className="mt-5 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                {!viaGoogle && (
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="group relative grid h-28 w-28 place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface transition-colors hover:border-gold/50"
                    >
                      {foto ? (
                        // eslint-disable-next-line @next/next/no-img-element -- preview local, sem otimização
                        <img src={foto} alt="Sua foto" className="h-full w-full object-cover" />
                      ) : (
                        <span
                          className="grid h-full w-full place-items-center font-[family-name:var(--font-display)] text-3xl font-semibold text-black/80"
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
                      className="mt-2 text-xs font-medium text-gold-hi hover:underline"
                    >
                      {foto ? "Escolher outra" : "Escolher da galeria"}
                    </button>
                  </div>
                )}

                <div className="w-full flex-1">
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
              </div>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                Dados da candidatura
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
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

                <div>
                  <label
                    htmlFor="disputaPor"
                    className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
                  >
                    Estado (opcional)
                  </label>
                  <select
                    id="disputaPor"
                    className="field-input !pl-4"
                    value={disputaPor}
                    onChange={(e) => setDisputaPor(e.target.value)}
                  >
                    <option value="">Selecione…</option>
                    {ESTADOS_BRASIL.map((e) => (
                      <option key={e.uf} value={e.nome}>
                        {e.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ano"
                    className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
                  >
                    Ano da eleição
                  </label>
                  <select
                    id="ano"
                    className="field-input !pl-4"
                    value={anoEleicao}
                    onChange={(e) => setAnoEleicao(e.target.value)}
                  >
                    {ANOS_ELEICAO.map((ano) => (
                      <option key={ano} value={ano}>
                        {ano}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
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
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                Bandeiras sugeridas
              </h2>
              <p className="mt-1 text-sm text-muted">Os temas que mais representam sua atuação.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {BANDEIRAS_TEMAS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => alternarBandeira(b)}
                    aria-pressed={bandeiras.includes(b)}
                    className={chip(bandeiras.includes(b))}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- aba 2: estilo e bio ---- */}
        {aba === "estilo" && (
          <section className="reveal flex flex-col gap-9">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                Como você se comunica
              </h2>
              <p className="mt-1 text-sm text-muted">
                Ajuda a Oficina Amarela a te indicar editores com o tom certo.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {TONS_COMUNICACAO.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTom(t)}
                    aria-pressed={tom === t}
                    className={`group rounded-xl border px-4 py-3 text-left transition-colors ${
                      tom === t
                        ? "border-gold-lo bg-gold/10"
                        : "border-line bg-surface hover:border-gold/30"
                    }`}
                  >
                    <span
                      className={`block text-sm font-medium ${tom === t ? "text-gold-hi" : "text-muted group-hover:text-text"}`}
                    >
                      {t}
                    </span>
                    <span className="mt-1 block text-xs italic leading-snug text-muted-2">
                      "{EXEMPLOS_TOM[t]}"
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                Palavras-chave
              </h2>
              <p className="mt-1 text-sm text-muted">
                Escolha ou digite até 3 palavras que definem sua postura.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {PALAVRAS_CHAVE_SUGERIDAS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => alternarPalavraChave(p)}
                    disabled={palavrasChave.length >= 3 && !palavrasChave.includes(p)}
                    aria-pressed={palavrasChave.includes(p)}
                    className={chip(palavrasChave.includes(p))}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  className="field-input !pl-4"
                  placeholder="Ou digite a sua…"
                  value={novaPalavraChave}
                  disabled={palavrasChave.length >= 3}
                  onChange={(e) => setNovaPalavraChave(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarPalavraDigitada();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-ghost w-auto px-4"
                  disabled={palavrasChave.length >= 3 || !novaPalavraChave.trim()}
                  onClick={adicionarPalavraDigitada}
                >
                  Adicionar
                </button>
              </div>

              {palavrasChave.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {palavrasChave.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gold-lo bg-gold/10 py-1 pl-3 pr-2 text-xs font-medium text-gold-hi"
                    >
                      {p}
                      <button
                        type="button"
                        aria-label={`Remover ${p}`}
                        onClick={() => alternarPalavraChave(p)}
                        className="grid h-4 w-4 place-items-center rounded-full text-gold-hi/70 hover:text-gold-hi"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {palavrasChave.length >= 3 && (
                <p className="mt-2 text-xs text-muted-2">Máximo de 3 palavras.</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                  Sua biografia
                </h2>
                <button
                  type="button"
                  onClick={gerarSugestaoBio}
                  className="text-xs font-medium text-gold-hi hover:underline"
                >
                  ✨ Gerar sugestão
                </button>
              </div>
              <p className="mt-1 text-sm text-muted">
                Já vem com uma sugestão pronta — edite à vontade.
              </p>
              <textarea
                className="field-input !pl-4 mt-3"
                rows={5}
                placeholder="Fale um pouquinho sobre você…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </section>
        )}

        {/* ---- aba 3: canais e visual final ---- */}
        {aba === "canais" && (
          <section className="reveal flex flex-col gap-9">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                Suas redes
              </h2>
              <p className="mt-1 text-sm text-muted">Só o @ ou o link já ajuda.</p>

              <div className="mt-4 flex flex-col gap-3">
                <div className="relative flex items-center">
                  <IconInstagram className="pointer-events-none absolute left-4 h-[17px] w-[17px] text-muted-2" />
                  <input
                    className="field-input"
                    placeholder="Instagram — @seuperfil"
                    value={redes.instagram ?? ""}
                    onChange={(e) => atualizarRede("instagram", e.target.value)}
                  />
                </div>
                <div className="relative flex items-center">
                  <IconYoutube className="pointer-events-none absolute left-4 h-[17px] w-[17px] text-muted-2" />
                  <input
                    className="field-input"
                    placeholder="YouTube — nome do canal"
                    value={redes.youtube ?? ""}
                    onChange={(e) => atualizarRede("youtube", e.target.value)}
                  />
                </div>
                <div className="relative flex items-center">
                  <IconTiktok className="pointer-events-none absolute left-4 h-[17px] w-[17px] text-muted-2" />
                  <input
                    className="field-input"
                    placeholder="TikTok — @seuperfil"
                    value={redes.tiktok ?? ""}
                    onChange={(e) => atualizarRede("tiktok", e.target.value)}
                  />
                </div>
                <div className="relative flex items-center">
                  <IconX className="pointer-events-none absolute left-4 h-[17px] w-[17px] text-muted-2" />
                  <input
                    className="field-input"
                    placeholder="X — @seuperfil"
                    value={redes.x ?? ""}
                    onChange={(e) => atualizarRede("x", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                Confere como ficou
              </h2>
              <p className="mt-1 text-sm text-muted">É assim que vão te ver na Oficina Amarela.</p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface/60">
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
                  <p className="mt-0.5 text-xs text-muted-2">{local || "—"}</p>

                  {(redes.instagram || redes.youtube || redes.tiktok || redes.x) && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-2">
                      {redes.instagram && (
                        <span className="inline-flex items-center gap-1">
                          <IconInstagram className="h-3.5 w-3.5" />
                          {redes.instagram}
                        </span>
                      )}
                      {redes.youtube && (
                        <span className="inline-flex items-center gap-1">
                          <IconYoutube className="h-3.5 w-3.5" />
                          {redes.youtube}
                        </span>
                      )}
                      {redes.tiktok && (
                        <span className="inline-flex items-center gap-1">
                          <IconTiktok className="h-3.5 w-3.5" />
                          {redes.tiktok}
                        </span>
                      )}
                      {redes.x && (
                        <span className="inline-flex items-center gap-1">
                          <IconX className="h-3.5 w-3.5" />
                          {redes.x}
                        </span>
                      )}
                    </div>
                  )}

                  {bio && <p className="mt-3 text-sm leading-relaxed text-muted">{bio}</p>}

                  {(tom || bandeiras.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tom && (
                        <span className="inline-block rounded-full border border-gold-lo/40 bg-gold/[0.07] px-2.5 py-0.5 text-[11px] text-gold-hi">
                          tom: {tom}
                        </span>
                      )}
                      {bandeiras.map((b) => (
                        <span
                          key={b}
                          className="inline-block rounded-full border border-gold-lo/30 bg-gold/10 px-2.5 py-0.5 text-[11px] text-gold-hi"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {palavrasChave.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {palavrasChave.map((p) => (
                        <span
                          key={p}
                          className="inline-block rounded-full border border-line px-2.5 py-0.5 text-[11px] italic text-muted-2"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type="button" className="btn-gold" onClick={concluir}>
              Concluir e ver minhas missões
            </button>
          </section>
        )}
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
