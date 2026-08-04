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

-- Campos de perfil que o próprio usuário edita (serve editor e porta-voz).
-- Ficam em users mesmo: são 1-pra-1 com a conta, não justificam tabela nova.
ALTER TABLE users ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS localizacao TEXT;

-- Números do editor. "entregues" é a fonte da verdade; o resto acompanha.
ALTER TABLE users ADD COLUMN IF NOT EXISTS entregues INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reputacao INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INT NOT NULL DEFAULT 0;

-- nota fica NULL até existir avaliação de verdade. Default 5.0 faria um editor
-- sem nenhuma entrega aparecer com nota cheia pro porta-voz que fosse escolher.
ALTER TABLE users ADD COLUMN IF NOT EXISTS nota NUMERIC(3,2);

-- nivel é COLUNA GERADA: o Postgres calcula a partir de entregues, seguindo os
-- mesmos cortes de NIVEIS em lib/perfil.ts (0/10/30/60). Como coluna comum ela
-- divergiria — o editor chegaria a 12 entregas e continuaria "Aspirante".
--
-- É DROP + ADD (e não ADD IF NOT EXISTS) porque o Postgres não deixa alterar a
-- expressão de uma coluna gerada. Recriar é seguro: o valor é 100% derivado de
-- entregues, não há dado próprio pra perder.
ALTER TABLE users DROP COLUMN IF EXISTS nivel;
ALTER TABLE users ADD COLUMN nivel TEXT
  GENERATED ALWAYS AS (
    CASE
      WHEN entregues >= 60 THEN 'Mestre'
      WHEN entregues >= 30 THEN 'Veterano'
      WHEN entregues >= 10 THEN 'Oficial'
      ELSE 'Aspirante'
    END
  ) STORED;

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  formato TEXT NOT NULL CHECK (formato IN ('short','longo')),
  porta_voz TEXT NOT NULL,
  tint TEXT,
  link_video TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conquistas (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  icone TEXT NOT NULL,
  conquistado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio (user_id);
CREATE INDEX IF NOT EXISTS idx_conquistas_user ON conquistas (user_id);

-- Pautas: a demanda que o porta-voz cria e o editor pega.
-- Fica no banco (e não no localStorage) porque quem cria e quem pega são
-- PESSOAS DIFERENTES, em navegadores diferentes — localStorage nunca é
-- compartilhado entre usuários.
CREATE TABLE IF NOT EXISTS pautas (
  id SERIAL PRIMARY KEY,
  porta_voz_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  formato TEXT NOT NULL CHECK (formato IN ('short','longo')),
  brief_tom TEXT,
  brief_cor TEXT,
  brief_fonte TEXT,
  brief_refs TEXT,
  drive_link TEXT,
  status TEXT NOT NULL DEFAULT 'disponivel'
    CHECK (status IN ('disponivel','reservada','em_revisao','reedicao','aprovada')),
  reservada_por_id INT REFERENCES users(id) ON DELETE SET NULL,
  reservada_ate TIMESTAMPTZ,
  entrega_link TEXT,
  notas_inspetor TEXT,
  criada_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pautas_status ON pautas (status);
CREATE INDEX IF NOT EXISTS idx_pautas_porta_voz ON pautas (porta_voz_id);
