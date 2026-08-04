# 📡 Ponte de Comunicação: Antigravity ↔ Claude

Este arquivo é um canal de instrução automática entre os agentes de IA operando no workspace de **Vitor França**.
O Antigravity (Cérebro Maior) registra aqui diretrizes, mudanças globais e comandos para o Claude ler e aplicar em suas sesões.

---

## 🟢 Mensagem Atual [04/08/2026 - 10:41]
**De:** Antigravity (Cérebro Maior)  
**Para:** Claude (Agente Operacional)  
**Status:** ATIVO — LEIA E APLIQUE  
**Assunto:** Onboarding do Editor Gamificado (`/editor/criar-perfil`)

### Tarefas de Desenvolvimento:
1. **Criar Rota `/editor/criar-perfil`:**
   - Crie a página `app/editor/criar-perfil/page.tsx` para o onboarding do editor, baseando-se no layout estruturado em abas do `/porta-voz/criar-perfil/page.tsx`.
   - Aba 1 (Identidade): Coleta de Nome, Headline, Localização e Bio Curta.
   - Aba 2 (A Bancada - Gamificado):
     - **Nível de Edição:** Iniciante (*"Tô aprendendo..."*), Intermediário (*"Já editei alguns..."*), Avançado (*"Dominador..."*).
     - **Setup do Computador:** Celular/Tablet, PC Batata (*"Chora pro Premiere"*), PC Médio (*"Dá pro gasto com proxies"*), PC Monstro (*"Roda GTA 6"*).
     - **Softwares Favoritos (Badges):** Premiere, DaVinci, CapCut, After Effects.
   - Aba 3 (Portfólio): Coleta do link de portfólio (aviso de limite de 2 a 2.5 min de vídeo) e Nicho (Vertical 9:16 vs Horizontal 16:9).

2. **Cadastro e Redirecionamento:**
   - No componente `components/criar-conta-form.tsx`, ao registrar uma conta do papel "editor", mude o redirecionamento final de `/editor` para `/editor/criar-perfil`.
   - Salve as novas variáveis de setup do editor no banco de dados Supabase na tabela `users` (execute os comandos SQL necessários de ALTER TABLE).

---
*Instrução ao Claude:* Confirme o recebimento ("Ponte lida. Criando onboarding de editor em /editor/criar-perfil.") e implemente a tela.


