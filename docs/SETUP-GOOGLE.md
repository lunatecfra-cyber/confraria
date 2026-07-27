# Setup — Google Drive + Supabase

> O que o Vitor precisa fazer uma vez. Depois nunca mais mexe.
> Decisão travada (mudou em 27/07/2026): **sem Drive central** — cada porta-voz usa o **próprio** Drive.

## Como vai funcionar

1. O porta-voz sobe o bruto no **próprio** Google Drive, na pasta que quiser
2. No login com Google, ele autoriza o app a gerenciar permissões dos arquivos que compartilhar (escopo `drive.file`)
3. Editor reserva uma pauta → o site usa **o token do porta-voz** pra liberar acesso ao arquivo pro e-mail do editor
4. Quando a reserva vence ou a pauta é entregue, o site **revoga** o acesso (mesmo token)

> ⚠️ A revogação é tão importante quanto a liberação. Sem ela, todo editor vai acumulando acesso a tudo que já tocou.
> ⚠️ Se o porta-voz desconectar o app do Drive dele, a liberação/revogação para de funcionar pra ele — o site
> precisa avisar ("reconecte seu Drive") nesse caso.

---

## Parte 1 — Google Cloud (libera a API + login)

- [ ] Entrar em <https://console.cloud.google.com> (pode ser com sua conta pessoal — não precisa de conta especial da Confraria)
- [ ] Criar projeto: `confraria`
- [ ] **APIs e Serviços → Biblioteca** → procurar **Google Drive API** → **Ativar**
- [ ] **Tela de consentimento OAuth** → tipo **Externo** → preencher nome do app e e-mail
- [ ] **Escopos** → adicionar `drive.file` (acesso só aos arquivos que o usuário escolher compartilhar com o app —
      não o Drive inteiro dele)
- [ ] **Credenciais → Criar credenciais → ID do cliente OAuth** → tipo **Aplicativo da Web**
  - URI de redirecionamento autorizado: `http://localhost:3000/api/google/callback` (ou o callback do Supabase, ver Parte 2)
  - (depois adiciono o endereço real quando o site subir)
- [ ] Guardar o **Client ID** e o **Client Secret**

## Parte 2 — Supabase (login e banco)

- [ ] Criar conta em <https://supabase.com> (grátis) → novo projeto
- [ ] **Authentication → Providers → Google** → ativar e colar o mesmo Client ID/Secret da Parte 1
- [ ] Em **Authentication → Providers → Google**, adicionar o escopo extra `https://www.googleapis.com/auth/drive.file`
      (assim o login já vem com permissão de Drive junto — um só consentimento pro porta-voz)
- [ ] Copiar em **Project Settings → API**:
  - `Project URL`
  - `anon public key`

## Parte 3 — Me manda

Cria um arquivo `.env.local` na raiz do projeto com isso preenchido
(ou só me manda os valores que eu monto):

```ini
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

⚠️ **Nunca** manda esses valores em print público ou grupo. `.env.local` já está no `.gitignore`.

---

## O que eu faço depois que receber

- Ligo o login com Google de verdade (já pedindo o escopo de Drive)
- Crio as tabelas no Supabase (`usuarios` — com `drive_refresh_token` e `drive_conectado` — `pautas`, `entregas`)
- Ligo a liberação/revogação automática do Drive, usando o token de cada porta-voz
- Ativo o RLS (cada editor só vê o que é dele)
