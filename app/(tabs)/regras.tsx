import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
import { proficiencias, periciaOrdem } from '@/data/proficiencias';
import { habilidades, MagicaHabilidade } from '@/data/habilidades';
import {
  cores, guildas,
  instancias, pontosIdentidade, atributosCORPO, atributosMENTE, atributosESPIRITO,
  balizadores,
  pontos,
  dados, resultados, dificuldades,
  tiposMagicas, grausMagicas, notacaoMana, notacaoManaExemplo, conjuracao,
  dominiosBranco, dominiosVerde, dominiosVermelho, dominiosPreto, dominiosAzul,
  canalizacaoResultados, modificadoresAmbiente, ambientes, eventosClimaticos,
  armas, escudos, vestimentas, acessorios, melhorias, propriedadesElementais, afiadores,
  herbologia, receitasBasicas, proporcoes, soros, catalisadores, complexidadeZoologia, mineralogia,
  tiposArtefatos, usoReparo,
  classesCriaturas, mecanicaAtaque, habilidadesCriaturas, condicoes, venenoMarcadores,
  combateMovimentacao, combateOperacoes, combateReacoes, combateManifestacoes,
  descansaAcoes, evolucaoCenas, evolucaoComportamentos,
  secoes,
} from '@/data/regras';

function habCusto(custo: string): string {
  return custo.replace(/ SAB.*$/, '').replace(/ \/ /g, '/');
}

// ---------------------------------------------------------------------------
// Base table helpers
// ---------------------------------------------------------------------------

function TH({ cols, widths }: { cols: string[]; widths?: number[] }) {
  return (
    <View style={[styles.tableRow, styles.tableHeaderRow]}>
      {cols.map((c, i) => (
        <Text key={i} style={[styles.tableKey, widths ? { flex: widths[i] } : (i === 0 ? styles.colFirst : styles.colFlex)]}>
          {c}
        </Text>
      ))}
    </View>
  );
}

function R2({ a, b }: { a: string; b: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableKey, styles.colFirst]}>{a}</Text>
      <Text style={[styles.tableVal, styles.colFlex]}>{b}</Text>
    </View>
  );
}

function R3({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableKey, styles.colFirst]}>{a}</Text>
      <Text style={[styles.tableMid, styles.colMid]}>{b}</Text>
      <Text style={[styles.tableVal, styles.colFlex]}>{c}</Text>
    </View>
  );
}

function Sub({ text }: { text: string }) {
  return <Text style={styles.subTitle}>{text}</Text>;
}

function Note({ text }: { text: string }) {
  return <Text style={styles.sectionIntro}>{text}</Text>;
}

function ProfBlock({ nome, desc, teste, req }: { nome: string; desc: string; teste: string; req?: string }) {
  return (
    <View style={styles.profBlock}>
      <View style={styles.profHeader}>
        <Text style={styles.profNome}>{nome}</Text>
        {req ? <Text style={styles.profReq}>{req}</Text> : null}
      </View>
      <Text style={styles.profDesc}>{desc}</Text>
      <Text style={styles.profTeste}>Teste: {teste}</Text>
    </View>
  );
}

function HabBlock({ nome, prereq, custo, efeito, magicas }: { nome: string; prereq: string; custo: string; efeito: string; magicas?: MagicaHabilidade[] }) {
  return (
    <View style={styles.habBlock}>
      <View style={styles.habHeader}>
        <Text style={styles.habNome}>{nome}</Text>
        <Text style={styles.habCusto}>{custo} SAB</Text>
      </View>
      <Text style={styles.habPrereq}>Req: {prereq}</Text>
      <Text style={styles.habEfeito}>{efeito}</Text>
      {magicas && magicas.length > 0 && (
        <View style={styles.habMagicasWrap}>
          <Text style={styles.habMagicasLabel}>MÁGICA</Text>
          {magicas.map((m, i) => (
            <Text key={i} style={styles.habMagicasItem}>
              {m.nome} ({m.dominio}){' '}
              <Text style={styles.habManaFont}>{m.custo}</Text>
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.sectionWrap}>
      <TouchableOpacity style={[styles.sectionHeader, open && styles.sectionHeaderOpen]} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Text style={styles.sectionNum}>{num}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function RegrasScreen() {
  const { isLoaded } = useCharacter();

  if (!isLoaded) {
    return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

          <View style={styles.titleBar}>
            <Text style={styles.title}>Regras</Text>
            <Text style={styles.titleSub}>Toque em uma seção para expandir</Text>
          </View>

          {/* ── 1. AS CINCO CORES ── */}
          <Section num={secoes.cores.num} title={secoes.cores.titulo}>
            <TH cols={secoes.cores.colunas!.main} widths={[1, 2, 1, 1]} />
            {cores.map((row, i) => (
              <R3 key={i} a={row.cor} b={row.valores} c={`${row.aliadas} · vs ${row.inimigas}`} />
            ))}
            <Sub text={secoes.cores.subs!.guildas} />
            {guildas.map((row, i) => (
              <R2 key={i} a={row.combo} b={row.nome} />
            ))}
          </Section>

          {/* ── 2. CONSTRUÇÃO DE PERSONAGENS ── */}
          <Section num={secoes.personagens.num} title={secoes.personagens.titulo}>
            <Note text={secoes.personagens.nota!} />
            <TH cols={secoes.personagens.colunas!.instancias} widths={[1, 1.5, 1.5]} />
            {instancias.map((row, i) => (
              <R3 key={i} a={row.instancia} b={row.conceito} c={row.atributos} />
            ))}
            <Sub text={secoes.personagens.subs!.pontosIdentidade} />
            <TH cols={secoes.personagens.colunas!.pontosIdentidade} widths={[1.2, 1, 1, 1]} />
            {pontosIdentidade.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.2 }]}>{row.ponto}</Text>
                <Text style={[styles.tableVal, { flex: 1 }]}>{row.corpo}</Text>
                <Text style={[styles.tableVal, { flex: 1 }]}>{row.mente}</Text>
                <Text style={[styles.tableVal, { flex: 1 }]}>{row.espirito}</Text>
              </View>
            ))}
          </Section>

          {/* ── 3. ATRIBUTOS ── */}
          <Section num={secoes.atributos.num} title={secoes.atributos.titulo}>
            <Note text={secoes.atributos.nota!} />
            <Sub text={secoes.atributos.subs!.corpo} />
            {atributosCORPO.map((row, i) => (
              <R2 key={i} a={row.sigla} b={row.descricao} />
            ))}
            <Sub text={secoes.atributos.subs!.mente} />
            {atributosMENTE.map((row, i) => (
              <R2 key={i} a={row.sigla} b={row.descricao} />
            ))}
            <Sub text={secoes.atributos.subs!.espirito} />
            {atributosESPIRITO.map((row, i) => (
              <R2 key={i} a={row.sigla} b={row.descricao} />
            ))}
          </Section>

          {/* ── 4. PERÍCIAS ── */}
          <Section num={secoes.pericias.num} title={secoes.pericias.titulo}>
            <Note text={secoes.pericias.nota!} />
            {(() => {
              let lastInst = '';
              return periciaOrdem.map(({ instancia, periciaKey }) => {
                const p = proficiencias[instancia][periciaKey]!;
                const showInst = instancia !== lastInst;
                lastInst = instancia;
                return (
                  <View key={periciaKey}>
                    {showInst && <Sub text={instancia.toUpperCase()} />}
                    <Text style={styles.periciaLabel}>{p.label} · <Text style={styles.periciaAtrs}>{p.atributos.join(' · ')}</Text></Text>
                    <Note text={p.descricao} />
                    {p.proficiencias.map((pr, j) => (
                      <ProfBlock key={j} nome={pr.nome} desc={pr.descricao} teste={pr.teste} req={pr.requisito} />
                    ))}
                  </View>
                );
              });
            })()}
          </Section>

          {/* ── 5. HABILIDADES ── */}
          <Section num={secoes.habilidades.num} title={secoes.habilidades.titulo}>
            <Note text={secoes.habilidades.nota!} />
            {(['corpo', 'mente', 'espirito'] as const).map(inst => {
              const labelKey = inst === 'corpo' ? 'corporais' : inst === 'mente' ? 'mentais' : 'espirituais';
              return (
                <React.Fragment key={inst}>
                  <Sub text={secoes.habilidades.subs![labelKey]} />
                  {habilidades
                    .filter(h => h.instancia === inst)
                    .map(h => (
                      <HabBlock
                        key={h.nome}
                        nome={h.nome}
                        prereq={h.prerequisito}
                        custo={habCusto(h.custo)}
                        efeito={h.descricao}
                        magicas={h.magicas}
                      />
                    ))}
                </React.Fragment>
              );
            })}
          </Section>

          {/* ── 6. BALIZADORES ── */}
          <Section num={secoes.balizadores.num} title={secoes.balizadores.titulo}>
            <Note text={secoes.balizadores.nota!} />
            <TH cols={secoes.balizadores.colunas!.main} widths={[1, 0.8, 2.2]} />
            {balizadores.map((row, i) => (
              <R3 key={i} a={row.balizador} b={row.cor} c={row.funcao} />
            ))}
          </Section>

          {/* ── 7. OUTROS PONTOS ── */}
          <Section num={secoes.pontos.num} title={secoes.pontos.titulo}>
            <TH cols={secoes.pontos.colunas!.main} />
            {pontos.map((row, i) => (
              <R2 key={i} a={row.ponto} b={row.funcao} />
            ))}
          </Section>

          {/* ── 8. MECÂNICA DE DADOS ── */}
          <Section num={secoes.dados.num} title={secoes.dados.titulo}>
            <Note text={secoes.dados.nota!} />
            <TH cols={secoes.dados.colunas!.main} widths={[0.6, 0.8, 2.6]} />
            {dados.map((row, i) => (
              <R3 key={i} a={row.dado} b={row.cor} c={row.especial} />
            ))}
            <Sub text={secoes.dados.subs!.resultados} />
            {resultados.map((row, i) => (
              <R2 key={i} a={row.resultado} b={row.descricao} />
            ))}
          </Section>

          {/* ── 9. TESTES ── */}
          <Section num={secoes.testes.num} title={secoes.testes.titulo}>
            <Note text={secoes.testes.nota!} />
            <TH cols={secoes.testes.colunas!.main} />
            {dificuldades.map((row, i) => (
              <R3 key={i} a={row.dificuldade} b={row.valor} c={row.modificador} />
            ))}
          </Section>

          {/* ── 10. SISTEMA DE MÁGICAS ── */}
          <Section num={secoes.magicas.num} title={secoes.magicas.titulo}>
            <Sub text={secoes.magicas.subs!.tipos} />
            <TH cols={secoes.magicas.colunas!.tipos} widths={[1.2, 0.7, 2.1]} />
            {tiposMagicas.map((row, i) => (
              <R3 key={i} a={row.tipo} b={row.simbolo} c={row.funcionamento} />
            ))}
            <Sub text={secoes.magicas.subs!.graus} />
            {grausMagicas.map((row, i) => (
              <R3 key={i} a={row.grau} b={row.nivel} c={row.custo} />
            ))}
            <Sub text={secoes.magicas.subs!.notacao} />
            {notacaoMana.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, styles.colFirst, styles.manaFont]}>{row.simbolo}</Text>
                <Text style={[styles.tableVal, styles.colFlex]}>{row.descricao}</Text>
              </View>
            ))}
            <Note text={`Exemplos: ${notacaoManaExemplo}`} />
            <Sub text={secoes.magicas.subs!.conjuracao} />
            {conjuracao.map((row, i) => (
              <R2 key={i} a={row.acao} b={row.descricao} />
            ))}
          </Section>

          {/* ── 11. DOMÍNIOS ── */}
          <Section num={secoes.dominios.num} title={secoes.dominios.titulo}>
            <Note text={secoes.dominios.nota!} />
            <TH cols={secoes.dominios.colunas!.main} widths={[1.8, 0.8, 0.7, 0.7]} />
            <Sub text={secoes.dominios.subs!.branco} />
            {dominiosBranco.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text={secoes.dominios.subs!.verde} />
            {dominiosVerde.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text={secoes.dominios.subs!.vermelho} />
            {dominiosVermelho.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text={secoes.dominios.subs!.preto} />
            {dominiosPreto.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text={secoes.dominios.subs!.azul} />
            {dominiosAzul.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
          </Section>

          {/* ── 12. CANALIZAÇÃO E MANA ── */}
          <Section num={secoes.canalizacao.num} title={secoes.canalizacao.titulo}>
            <Note text={secoes.canalizacao.nota!} />
            <TH cols={secoes.canalizacao.colunas!.resultados} />
            {canalizacaoResultados.map((row, i) => (
              <R2 key={i} a={row.resultado} b={row.mana} />
            ))}
            <Sub text={secoes.canalizacao.subs!.modificadores} />
            {modificadoresAmbiente.map((row, i) => (
              <R2 key={i} a={row.mod} b={row.descricao} />
            ))}
            <Sub text={secoes.canalizacao.subs!.ambientes} />
            {ambientes.map((row, i) => (
              <R2 key={i} a={row.ambiente} b={row.modificadores} />
            ))}
            <Sub text={secoes.canalizacao.subs!.eventos} />
            {eventosClimaticos.map((row, i) => (
              <R2 key={i} a={row.evento} b={row.modificadores} />
            ))}
          </Section>

          {/* ── 13. EQUIPAMENTOS ── */}
          <Section num={secoes.equipamentos.num} title={secoes.equipamentos.titulo}>
            <Sub text={secoes.equipamentos.subs!.armas} />
            <TH cols={secoes.equipamentos.colunas!.armas} widths={[1.3, 0.7, 2]} />
            {armas.map((row, i) => (
              <R3 key={i} a={row.arma} b={row.dano} c={row.especial} />
            ))}
            <Sub text={secoes.equipamentos.subs!.escudos} />
            <TH cols={secoes.equipamentos.colunas!.escudos} widths={[1.5, 0.8, 1.7]} />
            {escudos.map((row, i) => (
              <R3 key={i} a={row.escudo} b={row.ipCorp} c={row.especial} />
            ))}
            <Sub text={secoes.equipamentos.subs!.vestimentas} />
            <TH cols={secoes.equipamentos.colunas!.vestimentas} widths={[1.6, 0.8, 0.8, 0.8]} />
            {vestimentas.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.6 }]}>{row.vestimenta}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.ipCorp}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.ipMent}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.ipEsp}</Text>
              </View>
            ))}
            <Sub text={secoes.equipamentos.subs!.acessorios} />
            <TH cols={secoes.equipamentos.colunas!.acessorios} />
            {acessorios.map((row, i) => (
              <R2 key={i} a={row.acessorio} b={row.bonus} />
            ))}
            <Sub text={secoes.equipamentos.subs!.melhorias} />
            {melhorias.map((row, i) => (
              <R2 key={i} a={row.tipo} b={row.descricao} />
            ))}
            <Sub text={secoes.equipamentos.subs!.elementais} />
            <TH cols={secoes.equipamentos.colunas!.elementais} widths={[0.7, 1.3, 2]} />
            {propriedadesElementais.map((row, i) => (
              <R3 key={i} a={row.cor} b={row.propriedade} c={row.efeito} />
            ))}
            <Sub text={secoes.equipamentos.subs!.afiadores} />
            {afiadores.map((row, i) => (
              <R2 key={i} a={row.combo} b={row.propriedade} />
            ))}
          </Section>

          {/* ── 14. MATÉRIAS-PRIMAS E ALQUIMIA ── */}
          <Section num={secoes.alquimia.num} title={secoes.alquimia.titulo}>
            <Sub text={secoes.alquimia.subs!.herbologia} />
            {herbologia.map((row, i) => (
              <R2 key={i} a={row.cor} b={row.tipo} />
            ))}
            <Sub text={secoes.alquimia.subs!.receitas} />
            {receitasBasicas.map((row, i) => (
              <R2 key={i} a={row.combinacao} b={row.efeito} />
            ))}
            <Sub text={secoes.alquimia.subs!.proporcoes} />
            {proporcoes.map((row, i) => (
              <R2 key={i} a={row.proporcao} b={row.resultado} />
            ))}
            <Sub text={secoes.alquimia.subs!.soros} />
            {soros.map((row, i) => (
              <R2 key={i} a={row.cor} b={row.mutacoes} />
            ))}
            <Sub text={secoes.alquimia.subs!.catalisadores} />
            {catalisadores.map((row, i) => (
              <R2 key={i} a={row.cor} b={row.efeito} />
            ))}
            <Note text={complexidadeZoologia} />
            <Sub text={secoes.alquimia.subs!.mineralogia} />
            {mineralogia.map((row, i) => (
              <R2 key={i} a={row.tipo} b={row.descricao} />
            ))}
          </Section>

          {/* ── 15. ARTEFATOS ── */}
          <Section num={secoes.artefatos.num} title={secoes.artefatos.titulo}>
            <Note text={secoes.artefatos.nota!} />
            <TH cols={secoes.artefatos.colunas!.tipos} />
            {tiposArtefatos.map((row, i) => (
              <R2 key={i} a={row.tipo} b={row.produzidoPor} />
            ))}
            <Sub text={secoes.artefatos.subs!.usoReparo} />
            {usoReparo.map((row, i) => (
              <R2 key={i} a={row.acao} b={row.descricao} />
            ))}
          </Section>

          {/* ── 16. CRIATURAS ── */}
          <Section num={secoes.criaturas.num} title={secoes.criaturas.titulo}>
            <Sub text={secoes.criaturas.subs!.classes} />
            <TH cols={secoes.criaturas.colunas!.classes} widths={[0.5, 0.4, 0.7, 0.7, 0.5, 1.1, 0.6, 0.5]} />
            {classesCriaturas.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 0.5 }]}>{row.cls}</Text>
                <Text style={[styles.tableVal, { flex: 0.4 }]}>{row.grau}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.custo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.vida}</Text>
                <Text style={[styles.tableVal, { flex: 0.5 }]}>{row.res}</Text>
                <Text style={[styles.tableVal, { flex: 1.1 }]}>{row.poder}</Text>
                <Text style={[styles.tableVal, { flex: 0.6 }]}>{row.dano}</Text>
                <Text style={[styles.tableVal, { flex: 0.5 }]}>{row.dur}</Text>
              </View>
            ))}
            <Sub text={secoes.criaturas.subs!.ataque} />
            {mecanicaAtaque.map((row, i) => (
              <R2 key={i} a={row.acao} b={row.descricao} />
            ))}
            <Sub text={secoes.criaturas.subs!.habilidades} />
            {habilidadesCriaturas.map((row, i) => (
              <R2 key={i} a={row.habilidade} b={row.descricao} />
            ))}
          </Section>

          {/* ── 17. CONDIÇÕES ── */}
          <Section num={secoes.condicoes.num} title={secoes.condicoes.titulo}>
            <TH cols={secoes.condicoes.colunas!.main} />
            {condicoes.map((row, i) => (
              <R2 key={i} a={row.condicao} b={row.efeito} />
            ))}
            <Sub text={secoes.condicoes.subs!.veneno} />
            {venenoMarcadores.map((row, i) => (
              <R2 key={i} a={row.marcadores} b={row.efeito} />
            ))}
          </Section>

          {/* ── 18. COMBATE ── */}
          <Section num={secoes.combate.num} title={secoes.combate.titulo}>
            <Note text={secoes.combate.nota!} />
            <Sub text={secoes.combate.subs!.movimentacao} />
            <TH cols={secoes.combate.colunas!.acoes} />
            {combateMovimentacao.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
            <Sub text={secoes.combate.subs!.operacoes} />
            <TH cols={secoes.combate.colunas!.acoes} />
            {combateOperacoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
            <Sub text={secoes.combate.subs!.reacoes} />
            <TH cols={secoes.combate.colunas!.reacoes} />
            {combateReacoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
            <Sub text={secoes.combate.subs!.manifestacoes} />
            <TH cols={secoes.combate.colunas!.acoes} />
            {combateManifestacoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
          </Section>

          {/* ── 19. DESCANSO ── */}
          <Section num={secoes.descanso.num} title={secoes.descanso.titulo}>
            <Note text={secoes.descanso.nota!} />
            <TH cols={secoes.descanso.colunas!.main} widths={[0.9, 1.1, 2]} />
            {descansaAcoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.teste} c={row.resultado} />
            ))}
          </Section>

          {/* ── 20. EVOLUÇÃO ── */}
          <Section num={secoes.evolucao.num} title={secoes.evolucao.titulo}>
            <Note text={secoes.evolucao.nota!} />
            <Sub text={secoes.evolucao.subs!.cenas} />
            <TH cols={secoes.evolucao.colunas!.cenas} widths={[0.9, 1.3, 1.8]} />
            {evolucaoCenas.map((row, i) => (
              <R3 key={i} a={row.cena} b={row.dificuldade} c={row.afinidade} />
            ))}
            <Sub text={secoes.evolucao.subs!.comportamentos} />
            {evolucaoComportamentos.map((row, i) => (
              <R2 key={i} a={row.cor} b={row.comportamento} />
            ))}
          </Section>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RPG.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },

  titleBar: {
    backgroundColor: RPG.headerBg,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: RPG.gold,
    alignItems: 'center',
    gap: 2,
  },
  title: {
    color: RPG.gold,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  titleSub: {
    color: RPG.textDark,
    fontSize: 10,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },

  sectionWrap: {
    backgroundColor: RPG.surface,
    borderTopWidth: 2,
    borderTopColor: RPG.goldDim,
    marginHorizontal: 8,
    marginVertical: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RPG.headerBg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  sectionHeaderOpen: {
    backgroundColor: RPG.surface,
    borderBottomWidth: 1,
    borderBottomColor: RPG.goldDim,
  },
  sectionNum: {
    color: RPG.goldDim,
    fontSize: 12,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'right',
  },
  sectionTitle: {
    flex: 1,
    color: RPG.gold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chevron: {
    color: RPG.goldDim,
    fontSize: 11,
  },
  sectionBody: {
    backgroundColor: RPG.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  tableHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: RPG.goldDim,
    paddingBottom: 4,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    gap: 6,
    alignItems: 'flex-start',
  },
  tableKey: {
    color: RPG.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  tableMid: {
    color: RPG.text,
    fontSize: 11,
    flex: 1,
  },
  tableVal: {
    color: RPG.textMuted,
    fontSize: 11,
    flex: 2,
  },
  colFirst: {
    minWidth: 80,
    flex: 0,
  },
  colMid: {
    minWidth: 52,
    flex: 0,
  },
  colFlex: {
    flex: 1,
  },
  manaFont: {
    fontFamily: 'PlanewalkerDings',
    fontStyle: 'normal',
    fontSize: 14,
  },

  sectionIntro: {
    color: RPG.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    paddingVertical: 5,
    lineHeight: 16,
  },

  subTitle: {
    color: RPG.goldDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingTop: 10,
    paddingBottom: 2,
  },

  periciaLabel: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '700',
    paddingTop: 8,
    paddingBottom: 2,
  },
  periciaAtrs: {
    color: RPG.textMuted,
    fontWeight: '400',
  },

  profBlock: {
    borderLeftWidth: 2,
    borderLeftColor: RPG.border,
    paddingLeft: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  profHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  profNome: {
    color: RPG.text,
    fontSize: 11,
    fontWeight: '700',
  },
  profReq: {
    color: RPG.goldDim,
    fontSize: 10,
    fontStyle: 'italic',
  },
  profDesc: {
    color: RPG.textMuted,
    fontSize: 11,
    lineHeight: 16,
    paddingTop: 2,
  },
  profTeste: {
    color: RPG.azulLight,
    fontSize: 10,
    fontStyle: 'italic',
    paddingTop: 2,
  },

  habBlock: {
    borderLeftWidth: 2,
    borderLeftColor: RPG.goldDim,
    paddingLeft: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  habHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habNome: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  habCusto: {
    color: RPG.textMuted,
    fontSize: 10,
  },
  habPrereq: {
    color: RPG.goldDim,
    fontSize: 10,
    fontStyle: 'italic',
    paddingTop: 1,
  },
  habEfeito: {
    color: RPG.text,
    fontSize: 11,
    lineHeight: 16,
    paddingTop: 2,
  },
  habMagicasWrap: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: RPG.border,
    gap: 1,
  },
  habMagicasLabel: {
    color: RPG.gold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  habMagicasItem: {
    color: RPG.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
  },
  habManaFont: {
    fontFamily: 'PlanewalkerDings',
    fontStyle: 'normal',
    fontSize: 12,
  },
});
