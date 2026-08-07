import { iniciais, type Candidato } from "@/lib/candidatos";

export function AvatarCandidato({
  candidato: cand,
  className = "h-24 w-24 text-3xl",
}: {
  candidato: Candidato;
  className?: string;
}) {
  if (cand.foto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- foto do Google ou data URL de upload, sem otimização de servidor
      <img
        src={cand.foto}
        alt={cand.nome}
        className={`flex-none rounded-2xl object-cover ${className}`}
        style={{
          boxShadow: "0 0 0 4px var(--color-ink), 0 0 0 5px rgba(244,206,31,0.55), 0 12px 34px rgba(0,0,0,0.6)",
        }}
      />
    );
  }

  return (
    <span
      className={`grid flex-none place-items-center rounded-2xl font-[family-name:var(--font-display)] font-semibold text-black/80 ${className}`}
      style={{
        background: cand.tint,
        boxShadow: "0 0 0 4px var(--color-ink), 0 0 0 5px rgba(244,206,31,0.55), 0 12px 34px rgba(0,0,0,0.6)",
      }}
    >
      {iniciais(cand.nome)}
    </span>
  );
}
