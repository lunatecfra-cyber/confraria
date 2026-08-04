# Oficina Amarela — Onboarding do Editor (Especificação)

> Proposta de fluxo de cadastro e pareamento (*matching*) do editor para a Oficina Amarela, baseado em pesquisa de melhores práticas do NotebookLM.
> Status: Planejado (Aguardando implementação na Etapa F7).

---

## 1. Funil de Cadastro em 3 Passos (Revelação Progressiva)

Para evitar sobrecarga cognitiva e garantir a captura de dados essenciais para o pareamento inteligente (*matching*), o cadastro do editor seguirá o seguinte fluxo:

```
[ ETAPA 1: IDENTIDADE ]  ===>  [ ETAPA 2: BANCADA ]  ===>  [ ETAPA 3: RITMO ]
  - Apelido de Guilda            - Estilo de Edição          - Agenda e Horas
  - E-mail e Senha               - Links de Portfólio        - Perguntas DISC
  - Softwares Favoritos          - Vídeo de Apresentação     - Google Authenticator (MFA)
```

### Passo 1: Identidade e Ferramentas (Assinatura)
*   **Campos**: Apelido único de guilda (case-insensitive), e-mail, senha e seleção rápida de softwares dominados (badges clicáveis: Premiere, After Effects, DaVinci Resolve, CapCut).
*   **Objetivo**: Cadastro de credenciais básicas e ferramentas principais do setup sem fricção.

### Passo 2: Perfil Criativo e "Bancada" (Sua Arte)
*   **Campos**: Seleção de até 3 estilos criativos dominantes (Reels Dinâmico, Vlog/Conversacional, Político Sóbrio) e link do portfólio inicial externo (Vimeo, YouTube, etc.).
*   **Objetivo**: Coleta de dados estéticos para o pareamento automatizado com o tom das pautas dos porta-vozes.

### Passo 3: Ritmo da Forja e Segurança (Sua Disponibilidade)
*   **Campos**: Grade inicial de horas disponíveis (agenda) e ativação rápida de MFA (Google Authenticator) para proteção da conta.
*   **Objetivo**: Definir o comprometimento de horas e blindar o acesso do editor.

---

## 2. Parâmetros de Matching (Estilo "Uber")
O pareamento automático de pautas na fila de triagem usará:
*   **Estilo Criativo**: Match entre `brief_tom`/`brief_refs` da pauta e especialidade do editor.
*   **Software**: Compatibilidade técnica de finalização do material.
*   **Tempo de Resposta**: Editores mais velozes no histórico ganham prioridade no despacho.
*   **Streak (Ritmo da Forja)**: Recompensar constância consecutiva na plataforma.
