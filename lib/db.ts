import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "confraria.db");

declare global {
  // eslint-disable-next-line no-var
  var __confrariaDb: Database.Database | undefined;
}

export const db = globalThis.__confrariaDb ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  globalThis.__confrariaDb = db;
}

db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    apelido TEXT NOT NULL UNIQUE COLLATE NOCASE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE,
    senha_hash TEXT NOT NULL,
    papel TEXT NOT NULL CHECK (papel IN ('voz','editor')),
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// migration pra bancos criados antes do campo email existir
const colunas = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
if (!colunas.some((c) => c.name === "email")) {
  db.exec(`ALTER TABLE users ADD COLUMN email TEXT COLLATE NOCASE;`);
}
db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
