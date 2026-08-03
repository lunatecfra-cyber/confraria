# Pesquisa — Preparação da F1 (Home do Editor)

> Ciclo 6 do loop noturno. Pesquisa dos 4 concorrentes pra informar a F1 (fila de vídeos + reservar).
> **Isto é insumo, não implementação.** A F1 só começa quando o Vitor decidir.

## O que roubar de cada um

| Plataforma | Padrão-chave | Aplicar na Oficina Amarela |
|---|---|---|
| **Frame.io** | Papéis **reviewer vs approver**; assets organizados por **status, assignee, due date**; workspace em painéis | Inspetor = approver (aprova/pede reedição). Fila filtrável por status/prazo/candidato. |
| **Vidchops** | **Brief criativo** (estilo, música, refs) + fila **um vídeo por vez, em ordem**; **3 rodadas de revisão** e o vídeo fecha; editor dedicado aprende o estilo | Brief mastigado em cada card. Reserva = "pega um vídeo por vez". Contador de revisões. |
| **Skool** | **Níveis** (renomeáveis) como selo no avatar; pontos por engajamento; **nível desbloqueia acesso**; leaderboard 7d/30d/all-time | Aspirante→Confrade→Veterano→Mestre como selo. Nível desbloqueia jobs pagos. Leaderboard depois. |
| **Toptal** | Vetting + **trial** antes do pago | Job grátis da missão = trial que vira acesso pago. |

## Esboço da F1 — Home do Editor (mobile-first)

**Topo (header):**
- Brasão pequeno + "Oficina Amarela"
- Selo de nível do editor (ex.: 🥉 Confrade) + mini barra de progresso pro próximo nível
- Avatar/menu

**Centro — A FILA (o coração):**
Lista de cards de vídeos disponíveis. Cada card:
- Thumbnail + nome do candidato (ex.: "Gabriel — Segurança")
- Badge de **formato** (Short 9:16 / Longo 16:9)
- **Brief resumido** (o ouro): cor · fonte · tom · prazo
- **Status**: `Disponível` · `Reservado por você` · `Reservado (outro)` · `Em revisão` · `Entregue`
- Botão **Reservar** (trava o vídeo pra você com **contador regressivo**; se estourar, volta pra fila)

**Filtros/ordenação** (Frame.io): por formato, prazo, candidato · ordenar por mais recente / prazo mais curto.

**Estados do vídeo (máquina de estados):**
`Disponível → Reservado (prazo X h) → Em edição → Entregue p/ inspetor → [Aprovado→Candidato] ou [Reedição→volta pro editor]`

**Rodapé/nav:** Fila · Meus vídeos · Comunidade (depois) · Perfil

## Decisões em aberto pro Vitor (antes da F1)

- [ ] Prazo padrão de reserva? (ex.: 24h como o Vidchops de revisão) — define o contador
- [ ] Quantos vídeos um editor pode reservar ao mesmo tempo? (Vidchops = 1 por vez)
- [ ] A fila é única (todos veem tudo) ou segmentada por candidato/nível?
- [ ] Onde os dados vivem no MVP: mock estático primeiro (só front) ou já Notion/planilha?
- [ ] Brief: campos mínimos por vídeo (cor, fonte, formato, refs, prazo, valor)?

## Fontes
- Frame.io: https://blog.frame.io/2025/10/28/adobe-max-2025-connected-creativity-for-modern-content-production/ · https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/get-started-with-frame-integration
- Skool gamification: https://help.skool.com/article/31-how-do-points-and-levels-work · https://stickyhive.ai/skool/gamification-guide/
- Vidchops: https://vidchops.com/guidelines-and-terms/ · https://increditors.com/vidchops-review-2026-pricing-quality-who-its-for/
