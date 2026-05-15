# Phase 3: Qualidade do Grimório - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 3-Qualidade-do-Grimório
**Areas discussed:** SpellDetailCard interface, filter persistence, search scope, StatPill extraction

---

## Gray Area Selection

| Area | Option | Selected |
|------|--------|----------|
| Filter persistence | Do what you think is best | ✓ (delegated) |
| SpellDetailCard interface | User clarified: tela Magia não deve ter botão "+ Mágica" | ✓ |
| Search field scope | Do what you think is best | ✓ (delegated) |
| StatPill extraction scope | Do what you think is best | ✓ (delegated) |

---

## SpellDetailCard Interface

| Option | Description | Selected |
|--------|-------------|----------|
| Botão + Mágica em ambas as telas | Mesmo componente com ação sempre visível | |
| Prop opcional `onAddMagica` | Botão aparece apenas quando prop é fornecida | ✓ |
| Dois componentes separados | SpellDetailView (magia) e SpellDetail (grimório) separados | |

**User's choice:** "SpellDataView acredito que seja a tabela de Mágicas da página Magia, nesse campo não se deve por o botão + Mágica"
**Notes:** Usuário confirmou que o card de detalhe na tela Magia é view-only — o jogador já está editando a ficha, não precisa adicionar ao grimório.

---

## Claude's Discretion

- **Filter persistence mechanism**: Escolha de module-level variables em `grimorio.tsx` (sem novo Context, sem AsyncStorage)
- **Search scope**: Incluir `search` na persistência junto com os filtros de toggle — comportamento natural
- **StatPill extraction**: Extrair para `components/rpg/StatPill.tsx` de forma independente (importável sem SpellDetailCard)

---

## Deferred Ideas

- **Proficiências**: Usuário perguntou "a ideia das proficiências que te dei, é na próxima fase?" — nova capability, não está no roadmap v1. Registrada para future milestone.
- **DomainView extraction**: `DomainView` em `magia.tsx` não está no escopo de GRIM-01. Deixar para fase futura.
- **FICHA-04**: Extração do `InstanceBlock` permanece deferred desde Phase 2.
