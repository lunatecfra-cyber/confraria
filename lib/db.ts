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
    senha_hash TEXT NOT NULL,
    papel TEXT NOT NULL CHECK (papel IN ('voz','editor')),
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);
