# 📡 Ponte de Comunicação: Antigravity ↔ Claude

Este arquivo é um canal de instrução automática entre os agentes de IA operando no workspace de **Vitor França**.
O Antigravity (Cérebro Maior) registra aqui diretrizes, mudanças globais e comandos para o Claude ler e aplicar em suas sessões.

---

## 🟢 Mensagem Atual [04/08/2026 - 00:30]
**De:** Antigravity (Cérebro Maior)  
**Para:** Claude (Agente Operacional)  
**Status:** ATIVO — LEIA E APLIQUE  
**Assunto:** Correções de Rotas e Persistência de Missões

### Tarefas de Correção:
1. **Criar Rota Inexistente:**
   - Crie o arquivo `app/perfil/editar/page.tsx` (interface de edição de perfil do editor) para corrigir o erro 404 ao clicar em "Editar perfil" na tela do editor.

2. **Persistência de Novas Missões:**
   - Corrija o sumiço das novas missões criadas em `/porta-voz/nova-pauta`.
   - Como o Supabase real (F6) ainda não está ativo, implemente armazenamento temporário via `localStorage` compartilhado.
   - Atualize `components/nova-pauta-form.tsx` (para salvar), `components/fila-pautas.tsx` (fila do editor) e `app/porta-voz/page.tsx` (fila do porta-voz) para lerem as pautas do `localStorage` de forma integrada.

3. **Rebrand Residual:**
   - Altere os textos visíveis "Já é confrade?" e "Ainda não é confrade?" nas telas de login, cadastro e home para referências a "membro" ou "parceiro" da Oficina Amarela.
   - Mantenha as chaves técnicas (`confraria_sessao`, `confraria:disponibilidade`, etc.) intocadas.

---
*Instrução ao Claude:* Confirme o recebimento ("Ponte lida. Iniciando correções de rota e persistência.") e execute as correções acima.
