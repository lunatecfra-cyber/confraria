# Confraria — O que é obrigatório por lei (não só recomendado)

> Pesquisado em 28/07/2026. Diferente do `CHECKLIST-LANCAMENTO.md` (boas práticas gerais), esse aqui é só o
> que a **lei brasileira** exige de verdade pra operar um site/plataforma. ⚠️ Não é parecer jurídico — é um
> mapa pra você levar a um advogado antes de publicar de verdade.

## 1. Identificação da empresa (rodapé do site)

Baseado no Decreto 7.962/2013 (regula comércio/serviço eletrônico) + Código de Defesa do Consumidor —
precisa aparecer **na página principal, embaixo, em tamanho legível**:

- [ ] Razão social (nome da empresa/CNPJ, ou seu nome se for pessoa física/MEI)
- [ ] Número do CNPJ (ou CPF, se ainda não tiver empresa aberta)
- [ ] Endereço físico
- [ ] E-mail ou canal de contato direto

⚠️ Isso é **diferente** do e-mail de contato da Política de Privacidade — pode ser o mesmo, mas a lei
trata como itens separados (um é sobre dado pessoal, outro é sobre "quem é essa empresa").

## 2. LGPD (Lei 13.709/2018) — o que é obrigação, não sugestão

- [ ] **Política de Privacidade publicada e acessível** — já temos o rascunho (`/privacidade`), falta e-mail real
- [ ] **Encarregado de dados (DPO) identificado** — a lei exige (Art. 41) que toda empresa que trata dado
      pessoal designe alguém e informe como contatar essa pessoa. Numa operação desse tamanho pode ser
      você mesmo — mas precisa **estar escrito** quem é
- [ ] **Base legal declarada pra cada tratamento** — ex: o escopo de acesso ao Google Drive só pode ser
      por **consentimento explícito** (já está no rascunho da política, mas o consentimento em si —
      o clique de "autorizo" — ainda não existe tecnicamente, é parte do F6)
- [ ] **Canal de verdade pra exercer direitos do titular** — não basta a política *dizer* que dá pra pedir
      exclusão de conta; precisa ter um jeito real de pedir (formulário, e-mail dedicado, ou botão "excluir
      minha conta" nas configurações)
- [ ] **Registro de consentimento** — guardar quando e o que cada pessoa aceitou (login Google + escopo
      Drive), pra provar consentimento se for questionado

## 3. Termos de Uso

Não existe uma lei chamada "lei dos termos de uso", mas pra qualquer plataforma com conta de usuário é
praticamente indispensável — é o contrato que define o que pode/não pode, baseado no Marco Civil da
Internet + Código de Defesa do Consumidor.

- [x] Rascunho pronto em `/termos` — falta revisão de advogado + e-mail de contato

## 4. Marco Civil da Internet (Lei 12.965/2014)

- [ ] Se guardar **log de conexão/acesso** (IP, timestamp), tem prazo legal de retenção (6 meses pra
      provedor de aplicação) — não pode guardar pra sempre nem apagar antes da hora
- [ ] Deixar claro no site como dados de conexão e registros de acesso são tratados (geralmente dentro da
      própria Política de Privacidade)

## 5. Acessibilidade digital (situacional — vale a pena mesmo não sendo obrigatório hoje)

A Lei Brasileira de Inclusão (13.146/2015) e o eMAG pesam mais forte pra serviço público ou empresas
grandes. Pra Confraria hoje não é uma obrigação clara, mas como lida com muita gente diferente (editores,
porta-vozes, candidatos), vale registrar como boa prática — não como "obrigatório" de verdade.

---

## Resumo — o que falta de verdade, em ordem de prioridade

1. **Rodapé com razão social/CNPJ/endereço/contato** — não existe nenhuma versão disso ainda, é rápido de
   adicionar assim que você tiver CNPJ (ou usar CPF por enquanto)
2. **Nomear o Encarregado de dados** — decisão sua, uma linha na Política de Privacidade
3. **E-mail de contato real** (já pendente, mesma trava de sempre)
4. Todo o resto depende do F6 (login real) pra existir de fato: consentimento clicável, canal de exclusão
   de conta, registro de consentimento
