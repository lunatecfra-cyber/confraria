# Oficina Amarela — Plano & Estrutura

> Plataforma que liga **porta-vozes → editores**, com **inspetor** validando a qualidade.
> Abordagem: **PC primeiro**, mas tem que ficar ótimo no celular.

## ⚠️ Regras invioláveis

- **NUNCA usar a palavra "missão"** (nem "Missio" em latim) — é ligada a partido, não podemos atrelar.
  Palavra oficial adotada: **PAUTA**. (Ex.: "Pautas disponíveis", "Pauta aceita!")

## Decisões travadas

| Tema | Decisão |
| --- | --- |
| Cor base | **Prata** (estrutura, brasão, texto) |
| Cor de destaque | **Dourado/ouro** (botão principal, nível, conquista) |
| Fundo | **Preto texturizado** (trama diagonal + granulado) |
| Prioridade de tela | **PC primeiro**, ótimo no celular |
| Login | **Apelido + senha** E **login com Google** (Google é o caminho principal) |
| Stack | **Next.js 16 + Tailwind 4 + Supabase** |
| Tipografia | **Cinzel** (display) + **Sora** (interface) |
| Vídeos | **100% no Google Drive.** Banco guarda só links (texto) |
| Onde fica o bruto | **Drive pessoal de cada porta-voz** (não é mais um Drive central — mudou 27/07/2026) |
| Acesso ao bruto | **Restrito** — só o editor que reservou enxerga, via token do próprio porta-voz |
| Liberação | **Automática por API**, usando o token OAuth do Drive de quem subiu o bruto |
| Revogação | Ao vencer a reserva ou entregar, o acesso é **revogado** (mesmo token) |
| Reserva | **1 pauta por vez** por editor (regra do esboço do Vitor) |

## Papéis

| Papel | Função |
| --- | --- |
| **Porta-voz** | Envia bruto (link do Drive) + brief; valida entrega; posta |
| **Editor** ⭐ | Pega pauta da fila, reserva com prazo, edita, entrega |
| **Inspetor** | Valida qualidade, aprova ou pede reedição |

## Perfil (definido pelo Vitor)

- Apelido
- **Portfólio** logo abaixo do perfil
- **Histórico**: editor → vídeos que editou; porta-voz → vídeos postados
- **Nota/avaliação** — critério ainda a definir

## Demanda do porta-voz (formulário passo a passo)

Em partes, não tudo de uma vez:

1. Link do Drive com o vídeo bruto
2. Links/brutos específicos que quer no vídeo
3. O que ele gosta (estilo, referências)
4. Motivo/motivação

## Roadmap

- [x] **F0 — Identidade + Login** (design system, boas-vindas, login)
- [x] **F3 — Demanda do porta-voz** (wizard 5 passos + home "minhas pautas") *(a fonte — interface pronta, dados fake)*
- [x] **F1 — Fila de pautas do editor** + reservar com prazo *(interface pronta, dados fake)*
- [x] **F2 — Entrega** (link do editado) → vai pra "em revisão" *(interface pronta, dados fake)*
- [x] **F5 — Perfil do editor** (estilo LinkedIn: capa, avatar, stats, portfólio, histórico timeline, nível, conquistas)
- [x] **Agenda dinâmica** (disponibilidade da semana clicável + trabalhos em andamento com contador vivo)
- [x] **F4 — Inspetor**: aprovar / pedir reedição *(interface pronta, dados fake)*
- [ ] **F6 — Auth real no Supabase** (apelido/senha + Google) + banco
- [x] **Perfil do porta-voz** (`/porta-voz/perfil`, variação: pautas criadas no lugar do portfólio) *(interface pronta, dados fake)*
- [ ] **F7 — Perfil Estendido** (Abas de Certificações do Hub e Equipamentos/Setup do editor)


## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind 4** (tokens em `app/globals.css` via `@theme`)
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) — falta configurar chaves
- ⚠️ Next 16 tem breaking changes: ler `node_modules/next/dist/docs/` antes de codar (regra do `AGENTS.md`)

## Como rodar

```bash
npm run dev      # http://localhost:3000
npm run build    # verificar erros
```

## Arquivos

- `app/globals.css` — design system (cores, textura, botões, inputs)
- `app/layout.tsx` — fontes Cinzel/Sora, textura de fundo
- `app/page.tsx` — boas-vindas + escolha de papel
- `app/login/page.tsx` — login (painel de marca no PC + formulário)
- `components/crest.tsx` — brasão reutilizável (prata/dourado)
- `components/login-form.tsx` — formulário de login
- `docs/PESQUISA-F1.md` — pesquisa dos concorrentes
- `docs/referencia-login-v1.html` — protótipo HTML antigo (referência histórica)

## Pendente com o Vitor

- [ ] Fazer o setup do **Google Cloud + Supabase** (ver `docs/SETUP-GOOGLE.md`) e me passar as chaves
- [ ] Critério da **nota/avaliação** do editor
- [ ] Prazo padrão de reserva de uma pauta
- [ ] Editor pega 1 pauta por vez?
- [ ] Referências visuais que ele ia mandar

## Para ligar o login do Google + Drive

Passo a passo completo (Google Cloud, Supabase, escopo de Drive): `docs/SETUP-GOOGLE.md`.
Resumo: login com Google já pede o escopo de Drive na mesma hora — não tem mais conta central,
cada porta-voz conecta o próprio Drive.

## Histórico

O protótipo HTML v1 (prata/preto, mobile-first) virou `docs/referencia-login-v1.html`.
Foi substituído pelo app Next.js quando entraram as decisões de PC-primeiro, dourado e login com Google.
