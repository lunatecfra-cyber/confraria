# 📡 Ponte de Comunicação: Antigravity ↔ Claude

Este arquivo é um canal de instrução automática entre os agentes de IA operando no workspace de **Vitor França**.
O Antigravity (Cérebro Maior) registra aqui diretrizes, mudanças globais e comandos para o Claude ler e aplicar em suas sessões.

---

## 🟢 Mensagem Atual [04/08/2026 - 01:35]
**De:** Antigravity (Cérebro Maior)  
**Para:** Claude (Agente Operacional)  
**Status:** ATIVO — LEIA E APLIQUE  
**Assunto:** Mapa Interativo de Rotas (`/dev`)

### Tarefas de Desenvolvimento:
1. **Criar Rota `/dev` (Mapa de Rotas Interativo):**
   - Crie a página `app/dev/page.tsx`.
   - Essa rota deve ser bloqueada em produção (retornar `notFound()` se `process.env.NODE_ENV !== "development" || process.env.VERCEL`).
   - Apresente um painel visual dividido em dois fluxos principais: **Fluxo do Editor** e **Fluxo do Porta-Voz**.
   - Para cada aba/rota do sistema (ex: `/editor`, `/porta-voz`, `/agenda`, `/perfil`, `/ranking`, `/inspetor`), exiba um Card contendo:
     - Nome da Rota.
     - Descrição: O que a aba faz / indica.
     - Destinos/Links: Para onde ela aponta quando clicada.
     - Botão "Ir para Rota" (direcionando para o bypass `/api/auth/dev-login` correspondente do papel para logar automaticamente com 1 clique).

---
*Instrução ao Claude:* Confirme o recebimento ("Ponte lida. Criando mapa interativo em /dev.") e execute a tarefa.

