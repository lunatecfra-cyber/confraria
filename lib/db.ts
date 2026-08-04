import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __confrariaSql: ReturnType<typeof postgres> | undefined;
}

// conexão preguiçosa: só constrói o client (e só aí exige DATABASE_URL) na
// primeira query de verdade, não na hora de importar o módulo — isso evita
// que "npm run build" quebre sem a variável configurada
function obterClient() {
  if (globalThis.__confrariaSql) return globalThis.__confrariaSql;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurado (.env.local)");

  // prepare:false é obrigatório com o pooler do Supabase em modo "transaction"
  const client = postgres(url, { prepare: false });
  globalThis.__confrariaSql = client;
  return client;
}

// wrapper de template literal — mesma ergonomia de `sql\`SELECT...\`` do
// postgres.js, mas conectando só na hora do uso
export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const client = obterClient() as unknown as (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => postgres.PendingQuery<postgres.Row[]>;
  return client(strings, ...values);
}

/**
 * Marca um valor como JSONB. Precisa existir aqui porque `sql` é wrapper e
 * não carrega os helpers do postgres.js.
 *
 * Usar isto em vez de JSON.stringify(x) + ::jsonb — com a string, o Postgres
 * guarda um JSON *string* dentro do jsonb (duplamente codificado) e o valor
 * volta como texto em vez de objeto/array.
 */
sql.json = (valor: unknown) => obterClient().json(valor as never);
