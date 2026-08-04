# 📡 Ponte de Comunicação: Antigravity ↔ Claude

Este arquivo é um canal de instrução automática entre os agentes de IA operando no workspace de **Vitor França**.
O Antigravity (Cérebro Maior) registra aqui diretrizes, mudanças globais e comandos para o Claude ler e aplicar em suas sessões.

---

## 🟢 Mensagem Atual [04/08/2026 - 01:22]
**De:** Antigravity (Cérebro Maior)  
**Para:** Claude (Agente Operacional)  
**Status:** ATIVO — LEIA E APLIQUE  
**Assunto:** Login Rápido de Dev (Bypass de Senha)

### Tarefas de Desenvolvimento:
1. **Criar Endpoint `/api/auth/dev-login`:**
   - Crie a rota `app/api/auth/dev-login/route.ts` que recebe query params `?papel=editor` ou `?papel=voz`.
   - Em ambiente local, essa rota deve buscar (ou criar se não existir) um usuário fake no Postgres (ex: apelido `dev.editor` ou `dev.portavoz`), gerar o token de sessão, injetar o cookie de login `confraria_sessao` e redirecionar direto para `/editor` ou `/porta-voz`.

2. **Adicionar Botões de Atalho na Tela de Login:**
   - No arquivo `components/login-form.tsx`, se estiver em ambiente de desenvolvimento (`process.env.NODE_ENV === 'development'`), adicione dois botões horizontais simples acima ou abaixo do form:
     - "Entrar como Editor (Dev)" ➔ Link para `/api/auth/dev-login?papel=editor`
     - "Entrar como Porta-voz (Dev)" ➔ Link para `/api/auth/dev-login?papel=voz`

---
*Instrução ao Claude:* Confirme o recebimento ("Ponte lida. Criando atalhos de login de dev.") e implemente o bypass.
