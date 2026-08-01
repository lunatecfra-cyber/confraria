import { corProximidade } from "@/lib/candidatos";

export function LocalProximidade({
  local,
  proximidade,
  className,
}: {
  local: string;
  proximidade: number;
  className?: string;
}) {
  const cor = corProximidade(proximidade);
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <span
        className="h-2 w-2 flex-none rounded-full"
        style={{ background: cor, boxShadow: `0 0 6px color-mix(in srgb, ${cor} 47%, transparent)` }}
        title={`Proximidade: ${Math.round(proximidade * 100)}%`}
        aria-hidden="true"
      />
      {local}
    </span>
  );
}
