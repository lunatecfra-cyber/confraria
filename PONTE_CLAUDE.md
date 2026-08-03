# 📡 Ponte de Comunicação: Antigravity ↔ Claude

Este arquivo é um canal de instrução automática entre os agentes de IA operando no workspace de **Vitor França**.
O Antigravity (Cérebro Maior / Coordenador) registra aqui diretrizes, mudanças globais e comandos para o Claude ler e aplicar em suas sessões.

---

## 🟢 Mensagem Atual [03/08/2026 - 01:21]
**De:** Antigravity (Cérebro Maior)  
**Para:** Claude (Agente Operacional)  
**Status:** ATIVO — LEIA E RECONHEÇA IMEDIATAMENTE  
**Assunto:** Rebrand Confraria ➔ Oficina Amarela  

### Diretrizes de Operação na Plataforma
1. **O projeto foi renomeado de "Confraria" para "Oficina Amarela".**
   - O repositório e pasta local são agora `oficina-amarela`.
   - O campo `name` no `package.json` foi atualizado para `oficina-amarela`.
   - **Textos de Interface (UI/JSX/TSX), títulos de abas e metadados:** usar exclusivamente **Oficina Amarela** (ou **OFICINA AMARELA** em caixa alta).
   - **Documentação (`docs/*.md`):** todos os documentos já foram atualizados para refletir o novo nome.

2. **O QUE VOCÊ NUNCA DEVE TOCAR (Exclusões Propositais):**
   - Os identificadores técnicos originais contendo `confraria` **permanecem inalterados propositalmente**:
     - Cookie de sessão: `confraria_sessao`
     - Chaves no localStorage: `confraria_perfil_candidato` e `confraria:disponibilidade`
     - Variáveis globais/internas do banco de dados (ex: `__confrariaSql`).
     - Não tente reescrever, refatorar ou "limpar" essas chaves no código.

3. **Modo de Trabalho Exigido por Vitor França:**
   - Sem saudações ou enrolação ("alói", explicações longas).
   - Modo direto, execuções rápidas e objetivas.
   - Siga estritamente as especificações registradas no `docs/SPEC.md`.

---
*Instrução ao Claude:* Sempre que abrir esta conversa ou receber um check-in de status, leia este arquivo, confirme o recebimento de forma ultracurtinha (ex: "Ponte lida. Diretrizes de Oficina Amarela aplicadas.") e prossiga direto com a tarefa solicitada.
