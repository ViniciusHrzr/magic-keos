---
phase: 09-fidelidade-estrutural
plan: 04
subsystem: data + ui
tags: [fidelidade, typescript, hardcode, planewalkerdings, mana]

# Dependency graph
requires:
  - phase: 09-01
    provides: conteúdo correto vs docx como baseline
  - phase: 09-02
    provides: data/regras/ como single source of truth
provides:
  - data/proficiencias.ts 100% fiel ao docx (descricao, teste, prerequisito, nomes)
  - data/habilidades.ts 100% fiel ao docx (descricao=teste, todos os campos)
  - data/regras/meta.ts com SecaoMeta para as 20 seções
  - regras.tsx §1-20 sem nenhum hardcode (secoes.* refs)
  - PlanewalkerDings aplicado à coluna simbolo da tabela notacaoMana (§10)
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SecaoMeta interface em meta.ts — metadados de seção centralizados (num, titulo, nota, subs, colunas)"
    - "styles.manaFont — estilo reutilizável PlanewalkerDings para notação de mana"

key-files:
  created:
    - data/regras/meta.ts
  modified:
    - data/proficiencias.ts
    - data/habilidades.ts
    - data/regras/index.ts
    - app/(tabs)/regras.tsx

key-decisions:
  - "proficiencias.ts: nomes corrigidos (Armas de Uma Mão, Armas de Duas Mãos, etc.), prerequisitos completos (sem abreviações), descricao e teste com texto exato do livro"
  - "habilidades.ts: descricao e teste idênticos (ambos mostram o efeito); Toque Mortífero, Grimório, Iniciativa, Fúria, Regenerar, Salvaguarda, Vidência corrigidos"
  - "meta.ts: SecaoMeta interface com num/titulo/nota/subs/colunas — zero strings hardcoded em regras.tsx"
  - "combate.colunas tem 2 keys: acoes (['Ação','Custo','Efeito']) e reacoes (['Reação','Custo','Efeito'])"
  - "PlanewalkerDings: só notacaoMana.simbolo precisava — outros locais (magia, grimorio, SpellDetailCard) já tinham o font"

requirements-completed:
  - FIDE-24
  - FIDE-25

# Metrics
duration: 60min
completed: 2026-05-16
---

# Phase 9 Plan 04: Fidelidade TS + Zero Hardcode + PlanewalkerDings Summary

**proficiencias.ts e habilidades.ts com texto exato do livro. meta.ts criado. regras.tsx §1-20 sem nenhum hardcode. PlanewalkerDings na notação de mana. Phase 9 finalizada.**

## Performance

- **Duration:** ~60 min (2 sessões)
- **Completed:** 2026-05-16
- **Files modified:** 4 (+ 1 criado)

## Accomplishments

### FIDE-24: Fidelidade exata em proficiencias.ts e habilidades.ts

**proficiencias.ts — Correções:**
- Nomes: "Uma Mão" → "Armas de Uma Mão", "Duas Mãos" → "Armas de Duas Mãos", "Arremesso" → "Armas de Arremesso", "Especialização" → "Especialização em Arma" (×2), "Mestria" → "Mestria em Arma" (×2)
- Prerequisitos: abreviações (REF, FOR, VON) → nomes completos (Reflexos, Força, Vontade, etc.)
- Espirituais descricao: removida frase inventada; substituída pelo texto exato do livro para cada seção (Comunhão, Diplomacia, Expressão, Intimidação, Lábia)
- Contra-atacar, Esquivar: texto completamente corrigido com fórmula de teste oposto
- Todos os `pr.descricao` e `pr.teste`: cópia exata do docx v0.4

**habilidades.ts — Correções:**
- `descricao` e `teste` idênticos em todas as habilidades (ambos exibem o efeito)
- Toque Mortífero: trigger corrigido ("quando for alvo do ataque de uma criatura conjurada de até Classe B")
- Grimório: "sem precisar encontrar alguém ou um livro que as ensine. Isso significa que você pode gastar pontos de sabedoria a qualquer momento para aprender essas mágicas."
- Iniciativa: reação "Impugnar [1]" com texto completo
- Fúria, Regenerar, Salvaguarda, Vidência: nomes de reação e mecânicas exatas do livro
- Prerequisitos: nomes completos de atributos em todas as habilidades

### FIDE-25: Zero hardcode em regras.tsx

**meta.ts criado:**
- `SecaoMeta` interface com campos `num`, `titulo`, `nota?`, `subs?`, `colunas?`
- `secoes` export com as 20 seções §1-§20 (cores→evolucao)
- `data/regras/index.ts` atualizado com `export * from './meta'`

**regras.tsx §1-20:**
- Todas as `<Section num="N" title="...">` → `<Section num={secoes.X.num} title={secoes.X.titulo}>`
- Todas as `<Note text="...">` → `<Note text={secoes.X.nota!} />`
- Todas as `<Sub text="...">` → `<Sub text={secoes.X.subs!.key} />`
- Todas as `<TH cols={[...]} />` → `<TH cols={secoes.X.colunas!.key} />`
- Exceção: `<Note text={\`Exemplos: ${notacaoManaExemplo}\`} />` mantém template literal (variável de dados)

### PlanewalkerDings na notação de mana

- Mapeamento de todos os locais com notação de mana no app (8 flags do investigador)
- Conclusão: apenas `notacaoMana.simbolo` na tabela §10 estava sem font
- Implementação: `styles.manaFont` adicionado à StyleSheet (`fontFamily: 'PlanewalkerDings'`, `fontStyle: 'normal'`, `fontSize: 14`)
- `notacaoMana.map`: substituído `R2` por `View+Text` inline com `manaFont` na coluna simbolo

## Commits

- `febf215` feat(09-04): fidelidade ts + zero hardcode em regras.tsx (FIDE-24/25)
- `608d2c0` feat(09-04): PlanewalkerDings na coluna simbolo de notacaoMana (§10)

## Self-Check: PASSED

- `npx tsc --noEmit` → 0 erros ✓
- grep por hardcode em regras.tsx → 0 Section/Note/Sub/TH com strings literais de regra ✓
- proficiencias.ts: nomes corretos, prerequisitos completos, texto exato ✓
- habilidades.ts: descricao=teste, todos os campos exatos do livro ✓
- notacaoMana.simbolo: renderizado com PlanewalkerDings ✓
- Todos os outros locais de mana (magia.tsx, grimorio.tsx, SpellDetailCard) já tinham PlanewalkerDings ✓

---
*Phase: 09-fidelidade-estrutural*
*Completed: 2026-05-16*
