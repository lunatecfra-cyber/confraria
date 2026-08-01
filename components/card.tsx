export function Card({
  titulo,
  delay = 0,
  children,
}: {
  titulo: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="reveal rounded-2xl border border-line bg-surface/60 p-5 lg:p-6"
      style={{ animationDelay: `${delay}s` }}
    >
      <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-gold">
        {titulo}
      </h2>
      {children}
    </section>
  );
}
