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

-- corte de sessão: qualquer token emitido ANTES desse instante é recusado.
-- Atualizado ao trocar a senha, o que derruba sessões antigas de verdade
-- (a checagem acontece em lib/sessao-servidor.ts, não só grava por gravar).
ALTER TABLE users ADD COLUMN IF NOT EXISTS sessoes_validas_apos TIMESTAMPTZ NOT NULL DEFAULT now();

-- trava de força bruta no login. Fica no Postgres (e não em memória) porque
-- na Vercel cada instância serverless tem memória própria — trava em memória
-- é contornada só trocando de instância.
CREATE TABLE IF NOT EXISTS tentativas_login (
  chave TEXT PRIMARY KEY,          -- apelido tentado (minúsculo)
  tentativas INT NOT NULL DEFAULT 0,
  primeira_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  travado_ate TIMESTAMPTZ
);
