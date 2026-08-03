import postgres from "postgres";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.join(aqui, "..", "supabase", "schema.sql"), "utf8");

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurado");

const sql = postgres(url, { prepare: false });

try {
  await sql.unsafe(schema);
  console.log("schema aplicado com sucesso");
} finally {
  await sql.end();
}
