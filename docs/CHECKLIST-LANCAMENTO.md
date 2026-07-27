# Confraria — Checklist pra colocar no ar

> Pesquisado em 27/07/2026 a partir de checklists de lançamento de SaaS (referências gerais) + LGPD
> (a lei que vale de verdade no Brasil — não GDPR). Adaptado pro que a Confraria realmente precisa hoje:
> **sem cobrança** (por enquanto), lida com **dado pessoal + token do Google Drive de cada porta-voz** — isso
> pesa mais na parte legal do que num SaaS comum.

## 1. Produto (técnico)

- [x] Fluxo principal completo com dados fake (porta-voz cria → editor reserva/entrega → inspetor aprova)
- [ ] Login real funcionando (F6 — travado nas chaves do Supabase)
- [x] Mensagens de erro claras em cada formulário — corrigido em `nova-pauta-form.tsx`: aceitava
      qualquer URL (ex: YouTube) como "link do Drive"; agora valida `drive.google.com` especificamente,
      com mensagem própria. Testado (link errado, link certo, campo vazio).
- [x] Responsivo no celular (testado)
- [x] Estados de carregamento (loading) nas ações que chamam API de verdade — feito em
      `nova-pauta-form.tsx` (enviar) e `fila-pautas.tsx` (reservar/cancelar/entregar), todos com
      disabled + texto próprio durante o delay simulado. Testado.
- [x] Estados vazios (fila vazia, sem missões, "nada pra revisar") — já implementados
- [ ] Testar nos navegadores principais (Chrome, Safari mobile — é onde a galera vai acessar)

## 2. Segurança e infraestrutura

- [x] `.env.local` fora do git (`.gitignore` já cobre)
- [ ] HTTPS — automático se hospedar na Vercel
- [ ] RLS (Row Level Security) ativo no Supabase — editor só vê o que é dele, já no plano (F6)
- [ ] **Token OAuth do Drive de cada porta-voz guardado criptografado no banco** — nunca em texto puro.
      É acesso à conta Google real de alguém, é o item mais sensível de todo o projeto.
- [ ] Backup automático do banco (Supabase Free já faz backup diário — confirmar retenção do plano)
- [ ] Rate limiting nas rotas de criar conta / login (evita spam e força bruta)
- [ ] Monitoramento de erro em produção (ex: Sentry — tem plano grátis)

## 3. Legal — LGPD (o que vale no Brasil)

⚠️ Essa seção pesa mais aqui do que num SaaS comum, porque a Confraria lida com **CPF/e-mail/token de Drive
de porta-vozes e editores reais** — inclusive políticos.

- [x] **Política de Privacidade** — rascunho pronto em `/privacidade` (dados coletados, finalidade,
      retenção, direitos LGPD). Falta: revisão de um advogado + preencher e-mail de contato
- [x] **Termos de Uso** — rascunho pronto em `/termos`. Falta: revisão de um advogado + e-mail de contato
- [ ] Base legal clara pra cada tratamento — ex: o escopo de Drive é por **consentimento explícito** no login
- [ ] **Direito de exclusão de conta e dados** — o usuário tem que conseguir pedir pra apagar tudo (LGPD exige)
- [ ] Um contato pra assunto de dados/privacidade (não precisa ser um DPO formal numa operação desse tamanho,
      mas precisa ter um e-mail de contato visível)
- [ ] Registro de consentimento — quando e o que o usuário aceitou (login Google + escopo Drive)
- [ ] Se usar Google Analytics/Pixel: aviso de cookies

## 4. Onboarding

- [ ] E-mail de boas-vindas ao criar conta
- [ ] Explicação rápida de "como funciona" no primeiro acesso (papéis: porta-voz / editor / inspetor)
- [ ] Um lugar pra tirar dúvida / reportar problema (nem que seja um e-mail ou grupo)

## 5. Analytics e observabilidade

- [ ] Quantas missões são criadas/reservadas/entregues por semana (métrica de uso real)
- [ ] Google Analytics ou similar, se quiser ver tráfego do site
- [ ] Error tracking (ver item de Sentry acima)

## 6. Operacional

- [ ] Domínio próprio
- [ ] E-mail profissional (ex: contato@...)
- [ ] Instagram/rede social da Confraria (se for divulgar)

## 7. Só se um dia cobrar (não é o caso agora)

- [ ] Gateway de pagamento + ciclo de assinatura
- [ ] Nota fiscal
- [ ] Política de reembolso

---

Fontes gerais consultadas: checklists de lançamento de SaaS (categorias técnico/legal/analytics/onboarding)
e guias de conformidade LGPD 2026 pra site/plataforma brasileira.
