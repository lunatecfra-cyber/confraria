# Oficina Amarela — Onboarding do Editor (Especificação Detalhada)

> Processo de onboarding interativo, gamificado e simplificado para novos editores de vídeo na Oficina Amarela.
> Status: Planejado para implementação.

---

## 1. Fluxo em 3 Etapas (Interface do Usuário)

O onboarding será hospedado na rota `/editor/criar-perfil` (exigindo sessão de editor ativa). 

### Aba 1: Identidade da Forja
*   **Nome de Exibição:** Nome pelo qual o editor será visto na plataforma.
*   **Headline:** Frase curta de apresentação (Ex: "Especialista em shorts de alta retenção").
*   **Cidade / Estado:** Localização geográfica.
*   **Bio Curta:** Breve descrição da experiência ou estilo.

### Aba 2: A Bancada (Ferramentas e Setup)
Para tornar a experiência leve e gamificada, as escolhas de hardware e experiência serão divertidas:
*   **Nível de Edição (Selecione um):**
    *   `Iniciante` — *"Tô aprendendo do zero, sei nada ainda"*
    *   `Intermediário` — *"Já editei alguns vídeos para candidatos e canais"*
    *   `Avançado` — *"Dominador das ferramentas, edito de olhos fechados"*
*   **Poder de Processamento (Selecione o Setup):**
    *   `📱 Celular/Tablet` — *"Uso CapCut móvel e aplicativos rápidos"*
    *   `🥔 PC Batata` — *"Chora e trava se eu tentar abrir o Premiere"*
    *   `⚙️ PC Médio` — *"Dá pro gasto usando proxies e paciência"*
    *   `🚀 PC Monstro (Roda GTA 6)` — *"Renderiza 4K liso sem reclamar"*
*   **Ferramentas Preferidas (Badges Clicáveis):**
    *   Adobe Premiere Pro
    *   DaVinci Resolve
    *   After Effects
    *   CapCut Desktop / Mobile

### Aba 3: O Portfólio (Sua Arte)
*   **Link de Vídeo de Destaque:** URL (YouTube, Vimeo, Drive) de um vídeo com **duração máxima de 2 a 2.5 minutos**.
*   **Nicho de Atuação (Múltipla Escolha):**
    *   `Vertical (9:16)` — Reels, Shorts e TikToks dinâmicos de alta retenção.
    *   `Horizontal (16:9)` — Documentários, vídeos de canal e institucionais sóbrios.

---

## 2. Persistência no Banco de Dados
Os dados coletados serão salvos nas colunas do usuário logado:
*   `nome`, `headline`, `bio`, `localizacao` (existentes na tabela `users`).
*   Novas colunas a serem criadas se necessário ou serializadas em campos textuais/JSON:
    *   `nivel_computador` (TEXT)
    *   `nivel_experiencia` (TEXT)
    *   `softwares_favoritos` (TEXT[])
    *   `nicho_atuacao` (TEXT)
    *   `link_portfolio` (TEXT)
