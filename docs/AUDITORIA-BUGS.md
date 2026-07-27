# Confraria — Auditoria (bugs e melhorias)

> Gerado pelo loop de auditoria noturno (só leitura — nada aqui foi corrigido, é lista pro Vitor decidir).
> Rodada 1 — 27/07/2026, 00:27. Meta da noite (5 bugs + 5 melhorias) batida nesta rodada.

## 🐛 Bugs (5)

1. ~~`components/agenda-view.tsx` — disponibilidade não persiste~~ **✅ Corrigido (rodada 8, 03:39),
   com `localStorage`.** Diferente do bug #5 (que precisa mesmo do Supabase, é Server Component lendo de
   outro lado), aqui só existe um componente client-side lendo esse dado — então `localStorage` resolve
   de verdade, sem esperar backend. Testado: toggle sobrevive a reload **e** a navegação SPA (fui pra
   `/editor` e voltei). Guardado na chave `confraria:disponibilidade`.

2. ~~`app/candidato/[slug]/page.tsx` — stat "em produção" não conta `reedicao`~~ **✅ Corrigido
   (rodada 6, 02:39).** Testado de verdade: mudei temporariamente uma pauta pra `reedicao`, confirmei que
   a stat ia pra 1 (com o fix) em vez de 0 (sem o fix), e desfiz o dado de teste depois.

3. **Links quebrados pra rotas que não existem ainda.** `/criar-conta` (login-form.tsx, "Crie uma conta"),
   `/recuperar` (login-form.tsx, "Esqueci a senha"), `/perfil/editar` (app/perfil/page.tsx, "Editar perfil")
   e `/porta-voz/perfil/editar` (app/porta-voz/perfil/page.tsx, mesmo botão) — nenhuma dessas 4 rotas existe
   hoje. Clicar em qualquer uma dá 404. Esperado nessa fase (interface fake), mas vale ter a lista quando for
   ligar o backend de verdade.

4. ~~Dado fake inconsistente: nota do editor atual~~ **✅ Corrigido (rodada 7, 03:09).**
   `EDITOR_ATUAL.nota` era `null`, `PERFIL_EDITOR.nota` era `4.8` — mesma pessoa, dados discordando.
   Igualei os dois pra `4.8`. Testado: o header agora mostra "12 entregues · nota 4.8" (antes não mostrava
   nota nenhuma, por causa do `null`). Não mexe em critério de cálculo de nota — só sincroniza o dado fake.

5. **A "Nova missão" não persiste em lugar nenhum — o fluxo principal é um beco sem saída na demo.**
   `components/nova-pauta-form.tsx`, função `enviar()`, só faz `setEnviado(true)` (tela de sucesso) — não
   adiciona nada a lugar nenhum. Preencha o wizard, veja "Missão enviada!", vá em `/porta-voz` ou `/editor`:
   a missão não aparece.
   ⚠️ **Testado nesta noite (rodada 2): não é um simples "esqueceu o `PAUTAS.push()`".** Tentei essa
   correção óbvia e ela **não funciona** — `nova-pauta-form.tsx` é Client Component (`"use client"`),
   enquanto `app/porta-voz/page.tsx` e a fila do editor renderizam como Server Component. Cada lado tem sua
   própria cópia do módulo `lib/pautas.ts`; mutar o array no navegador não é visto pelo servidor. Correção
   de verdade precisa de um dos dois caminhos: (a) esperar o Supabase real (F6) — a solução definitiva; ou
   (b) se quiser algo fake-mas-funcional antes disso, um estado compartilhado client-side (ex.: `localStorage`
   + os componentes que leem `PAUTAS` virando Client Components também). Isso é uma decisão de arquitetura,
   não um fix de uma linha — fica registrado aqui em vez de decidido sozinho numa rodada de loop.

## 💡 Melhorias (5)

1. ~~Usar `next/image` em vez de `<img>` cru~~ **✅ Corrigido (rodada 5, 02:09).** `components/logo.tsx`
   e as 3 capas/marca-d'água (`/perfil`, `/porta-voz/perfil`, `/candidato/[slug]`) convertidos, com
   `width={365} height={365}` (dimensão real do `emblema.png`). Testado nas 5 rotas, build limpo,
   screenshots conferidos — sem regressão visual.

2. ~~Selo de "reservada" sem cor própria~~ **✅ Corrigido (rodada 3, 01:09).** Agora usa `silver-hi`,
   visualmente distinto de "Em revisão" (silver/cinza). Testado com screenshot em `/editor`.

3. ~~Botão de "Enviar missão" sem estado de carregamento~~ **✅ Corrigido (rodada 4, 01:39).** Agora tem
   `enviando`/disabled + texto "Enviando…", com um delay simulado de 500ms (mesmo padrão do login-form.tsx).
   Testado: botão desabilita, texto muda, depois mostra a tela de sucesso.

4. **E-mail de contato ainda é placeholder** — `/termos` e `/privacidade` têm `[preencher e-mail de
   contato]` visível pro usuário final. Baixo esforço, alto valor assim que o Vitor decidir o e-mail.

5. ~~Nenhuma página individual define seu próprio `<title>`~~ **✅ Corrigido (rodada 2, 00:39).** Todas
   as 12 rotas agora têm `metadata`/`generateMetadata` próprio (`/candidato/[slug]` é dinâmico, usa o nome
   do candidato). Testado nas 12 rotas.
