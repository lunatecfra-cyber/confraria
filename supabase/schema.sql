-- rodar uma vez contra o banco Postgres do Supabase (não roda automático a
-- cada request, ao contrário do que o SQLite fazia)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  apelido TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  senha_hash TEXT,
  google_id TEXT,
  papel TEXT NOT NULL CHECK (papel IN ('voz','editor','admin')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_apelido ON users (lower(apelido));
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id) WHERE google_id IS NOT NULL;

-- migração pra bancos criados antes de "admin" existir como papel — não é
-- self-service (ninguém cria conta admin pelo /criar-conta), só via script
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_papel_check;
ALTER TABLE users ADD CONSTRAINT users_papel_check CHECK (papel IN ('voz','editor','admin'));
