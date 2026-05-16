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
import { habilidades } from '@/data/habilidades';
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

function HabBlock({ nome, prereq, custo, efeito }: { nome: string; prereq: string; custo: string; efeito: string }) {
  return (
    <View style={styles.habBlock}>
      <View style={styles.habHeader}>
        <Text style={styles.habNome}>{nome}</Text>
        <Text style={styles.habCusto}>{custo} SAB</Text>
      </View>
      <Text style={styles.habPrereq}>Req: {prereq}</Text>
      <Text style={styles.habEfeito}>{efeito}</Text>
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
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
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
          <Section num="1" title="As Cinco Cores">
            <TH cols={['Cor', 'Valores', 'Aliadas', 'Inimigas']} widths={[1, 2, 1, 1]} />
            {cores.map((row, i) => (
              <R3 key={i} a={row.cor} b={row.valores} c={`${row.aliadas} · vs ${row.inimigas}`} />
            ))}
            <Sub text="Combinações (Guildas)" />
            {guildas.map((row, i) => (
              <R2 key={i} a={row.combo} b={row.nome} />
            ))}
          </Section>

          {/* ── 2. CONSTRUÇÃO DE PERSONAGENS ── */}
          <Section num="2" title="Construção de Personagens">
            <Note text="Identidade: unidade de evolução — 1 dado daquela cor no atributo, +Vida, +Sabedoria, +Mana incolor" />
            <TH cols={['Instância', 'Conceito', 'Atributos']} widths={[1, 1.5, 1.5]} />
            {instancias.map((row, i) => (
              <R3 key={i} a={row.instancia} b={row.conceito} c={row.atributos} />
            ))}
            <Sub text="Pontos por Identidade" />
            <TH cols={['', 'CORPO', 'MENTE', 'ESPÍRITO']} widths={[1.2, 1, 1, 1]} />
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
          <Section num="3" title="Atributos">
            <Note text="Cada atributo: até 5 identidades (dados). N dados = N d20 rolados por teste." />
            <Sub text="CORPO" />
            {atributosCORPO.map((row, i) => (
              <R2 key={i} a={row.sigla} b={row.descricao} />
            ))}
            <Sub text="MENTE" />
            {atributosMENTE.map((row, i) => (
              <R2 key={i} a={row.sigla} b={row.descricao} />
            ))}
            <Sub text="ESPÍRITO" />
            {atributosESPIRITO.map((row, i) => (
              <R2 key={i} a={row.sigla} b={row.descricao} />
            ))}
          </Section>

          {/* ── 4. PERÍCIAS ── */}
          <Section num="4" title="Perícias">
            <Note text="Custo: 1 SAB para nível 1, +N por nível seguinte (total lv.10 = 55 pts). Abrir domínio concede nível 1 na perícia-chave." />
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
          <Section num="5" title="Habilidades">
            <Note text="Adquiridas com Sabedoria. Requerem pré-requisitos. Concedem reações especiais ou bônus fixos." />
            {(['corpo', 'mente', 'espirito'] as const).map(inst => {
              const labels: Record<string, string> = { corpo: 'Corporais', mente: 'Mentais', espirito: 'Espirituais' };
              return (
                <React.Fragment key={inst}>
                  <Sub text={labels[inst]} />
                  {habilidades
                    .filter(h => h.instancia === inst)
                    .map(h => (
                      <HabBlock
                        key={h.nome}
                        nome={h.nome}
                        prereq={h.prerequisito}
                        custo={habCusto(h.custo)}
                        efeito={h.teste}
                      />
                    ))}
                </React.Fragment>
              );
            })}
          </Section>

          {/* ── 6. BALIZADORES ── */}
          <Section num="6" title="Balizadores">
            <Note text="Adquiridos como perícias (custo progressivo, máx. 10 níveis). Cada cor tem um balizador-chave." />
            <TH cols={['Balizador', 'Cor', 'Função']} widths={[1, 0.8, 2.2]} />
            {balizadores.map((row, i) => (
              <R3 key={i} a={row.balizador} b={row.cor} c={row.funcao} />
            ))}
          </Section>

          {/* ── 7. OUTROS PONTOS ── */}
          <Section num="7" title="Outros Pontos">
            <TH cols={['Ponto', 'Função']} />
            {pontos.map((row, i) => (
              <R2 key={i} a={row.ponto} b={row.funcao} />
            ))}
          </Section>

          {/* ── 8. MECÂNICA DE DADOS ── */}
          <Section num="8" title="Mecânica de Dados">
            <Note text="Teste base: rola N d20 (N = valor do atributo), escolhe o maior resultado, soma bônus da perícia." />
            <TH cols={['Dado', 'Cor', 'Característica Especial']} widths={[0.6, 0.8, 2.6]} />
            {dados.map((row, i) => (
              <R3 key={i} a={row.dado} b={row.cor} c={row.especial} />
            ))}
            <Sub text="Resultados" />
            {resultados.map((row, i) => (
              <R2 key={i} a={row.resultado} b={row.descricao} />
            ))}
          </Section>

          {/* ── 9. TESTES ── */}
          <Section num="9" title="Testes">
            <Note text="Fórmula: N d20 → maior resultado + bônus de perícia vs. dificuldade" />
            <TH cols={['Dificuldade', 'Valor', 'Modificador']} />
            {dificuldades.map((row, i) => (
              <R3 key={i} a={row.dificuldade} b={row.valor} c={row.modificador} />
            ))}
          </Section>

          {/* ── 10. SISTEMA DE MÁGICAS ── */}
          <Section num="10" title="Sistema de Mágicas">
            <Sub text="Tipos" />
            <TH cols={['Tipo', 'Símbolo', 'Funcionamento']} widths={[1.2, 0.7, 2.1]} />
            {tiposMagicas.map((row, i) => (
              <R3 key={i} a={row.tipo} b={row.simbolo} c={row.funcionamento} />
            ))}
            <Sub text="Graus" />
            {grausMagicas.map((row, i) => (
              <R3 key={i} a={row.grau} b={row.nivel} c={row.custo} />
            ))}
            <Sub text="Notação de Custo de Mana" />
            {notacaoMana.map((row, i) => (
              <R2 key={i} a={row.simbolo} b={row.descricao} />
            ))}
            <Note text={`Exemplos: ${notacaoManaExemplo}`} />
            <Sub text="Conjuração" />
            {conjuracao.map((row, i) => (
              <R2 key={i} a={row.acao} b={row.descricao} />
            ))}
          </Section>

          {/* ── 11. DOMÍNIOS ── */}
          <Section num="11" title="Domínios">
            <Note text="45 domínios no total (9 por cor × 5 cores), organizados por Instância e Atributo-chave." />
            <TH cols={['Domínio', 'Instância', 'Atributo', 'Perícia']} widths={[1.8, 0.8, 0.7, 0.7]} />
            <Sub text="Branco" />
            {dominiosBranco.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text="Verde" />
            {dominiosVerde.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text="Vermelho" />
            {dominiosVermelho.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text="Preto" />
            {dominiosPreto.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{row.dominio}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.instancia}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.atributo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{row.pericia}</Text>
              </View>
            ))}
            <Sub text="Azul" />
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
          <Section num="12" title="Canalização e Mana">
            <Note text="Ação de descanso — Teste: Vontade [Comunhão]" />
            <TH cols={['Resultado', 'Mana obtido']} />
            {canalizacaoResultados.map((row, i) => (
              <R2 key={i} a={row.resultado} b={row.mana} />
            ))}
            <Sub text="Modificadores de Ambiente" />
            {modificadoresAmbiente.map((row, i) => (
              <R2 key={i} a={row.mod} b={row.descricao} />
            ))}
            <Sub text="Ambientes W·G·R·B·U (Branco·Verde·Verm·Preto·Azul)" />
            {ambientes.map((row, i) => (
              <R2 key={i} a={row.ambiente} b={row.modificadores} />
            ))}
            <Sub text="Eventos Climáticos" />
            {eventosClimaticos.map((row, i) => (
              <R2 key={i} a={row.evento} b={row.modificadores} />
            ))}
          </Section>

          {/* ── 13. EQUIPAMENTOS ── */}
          <Section num="13" title="Equipamentos">
            <Sub text="Armas" />
            <TH cols={['Arma', 'Dano', 'Especial']} widths={[1.3, 0.7, 2]} />
            {armas.map((row, i) => (
              <R3 key={i} a={row.arma} b={row.dano} c={row.especial} />
            ))}
            <Sub text="Escudos" />
            <TH cols={['Escudo', 'IP Corp', 'Especial']} widths={[1.5, 0.8, 1.7]} />
            {escudos.map((row, i) => (
              <R3 key={i} a={row.escudo} b={row.ipCorp} c={row.especial} />
            ))}
            <Sub text="Vestimentas" />
            <TH cols={['Vestimenta', 'IP Corp', 'IP Ment', 'IP Esp']} widths={[1.6, 0.8, 0.8, 0.8]} />
            {vestimentas.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.6 }]}>{row.vestimenta}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.ipCorp}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.ipMent}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{row.ipEsp}</Text>
              </View>
            ))}
            <Sub text="Acessórios Básicos" />
            <TH cols={['Acessório', 'Bônus']} />
            {acessorios.map((row, i) => (
              <R2 key={i} a={row.acessorio} b={row.bonus} />
            ))}
            <Sub text="Melhorias (máx. 3 por item)" />
            {melhorias.map((row, i) => (
              <R2 key={i} a={row.tipo} b={row.descricao} />
            ))}
            <Sub text="Propriedades Elementais" />
            <TH cols={['Cor', 'Propriedade', 'Efeito']} widths={[0.7, 1.3, 2]} />
            {propriedadesElementais.map((row, i) => (
              <R3 key={i} a={row.cor} b={row.propriedade} c={row.efeito} />
            ))}
            <Sub text="Afiadores (combinações de minerais)" />
            {afiadores.map((row, i) => (
              <R2 key={i} a={row.combo} b={row.propriedade} />
            ))}
          </Section>

          {/* ── 14. MATÉRIAS-PRIMAS E ALQUIMIA ── */}
          <Section num="14" title="Matérias-primas e Alquimia">
            <Sub text="Herbologia (Ervas)" />
            {herbologia.map((row, i) => (
              <R2 key={i} a={row.cor} b={row.tipo} />
            ))}
            <Sub text="Receitas básicas (3 ervas)" />
            {receitasBasicas.map((row, i) => (
              <R2 key={i} a={row.combinacao} b={row.efeito} />
            ))}
            <Sub text="Proporções" />
            {proporcoes.map((row, i) => (
              <R2 key={i} a={row.proporcao} b={row.resultado} />
            ))}
            <Sub text="Zoologia — Soros (mutações temporárias)" />
            {soros.map((row, i) => (
              <R2 key={i} a={row.cor} b={row.mutacoes} />
            ))}
            <Sub text="Zoologia — Catalizadores (de ossadas)" />
            {catalisadores.map((row, i) => (
              <R2 key={i} a={row.cor} b={row.efeito} />
            ))}
            <Note text={complexidadeZoologia} />
            <Sub text="Mineralogia" />
            {mineralogia.map((row, i) => (
              <R2 key={i} a={row.tipo} b={row.descricao} />
            ))}
          </Section>

          {/* ── 15. ARTEFATOS ── */}
          <Section num="15" title="Artefatos">
            <Note text="Objetos mágicos com Durabilidade (número de usos antes de precisar reparo)." />
            <TH cols={['Tipo', 'Produzido por']} />
            {tiposArtefatos.map((row, i) => (
              <R2 key={i} a={row.tipo} b={row.produzidoPor} />
            ))}
            <Sub text="Uso e Reparo" />
            {usoReparo.map((row, i) => (
              <R2 key={i} a={row.acao} b={row.descricao} />
            ))}
          </Section>

          {/* ── 16. CRIATURAS ── */}
          <Section num="16" title="Criaturas">
            <Sub text="Tabela de Classes" />
            <TH cols={['Cl', 'Gr', 'Custo', 'Vida', 'Res', 'Poder', 'Dano', 'Dur']} widths={[0.5, 0.4, 0.7, 0.7, 0.5, 1.1, 0.6, 0.5]} />
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
            <Sub text="Mecânica de Ataque" />
            {mecanicaAtaque.map((row, i) => (
              <R2 key={i} a={row.acao} b={row.descricao} />
            ))}
            <Sub text="Habilidades de Criaturas" />
            {habilidadesCriaturas.map((row, i) => (
              <R2 key={i} a={row.habilidade} b={row.descricao} />
            ))}
          </Section>

          {/* ── 17. CONDIÇÕES ── */}
          <Section num="17" title="Condições">
            <TH cols={['Condição', 'Efeito']} />
            {condicoes.map((row, i) => (
              <R2 key={i} a={row.condicao} b={row.efeito} />
            ))}
            <Sub text="Veneno — Marcadores" />
            {venenoMarcadores.map((row, i) => (
              <R2 key={i} a={row.marcadores} b={row.efeito} />
            ))}
          </Section>

          {/* ── 18. COMBATE ── */}
          <Section num="18" title="Combate">
            <Note text="Ações por turno: 1 movimentação + 1 operação + 1 reação + ações extras de Velocidade" />
            <Sub text="Movimentação" />
            <TH cols={['Ação', 'Custo', 'Efeito']} />
            {combateMovimentacao.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
            <Sub text="Operações (Ações Padrão)" />
            <TH cols={['Ação', 'Custo', 'Efeito']} />
            {combateOperacoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
            <Sub text="Reações" />
            <TH cols={['Reação', 'Custo', 'Efeito']} />
            {combateReacoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
            <Sub text="Manifestações (Ações Mágicas)" />
            <TH cols={['Ação', 'Custo', 'Efeito']} />
            {combateManifestacoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.custo} c={row.efeito} />
            ))}
          </Section>

          {/* ── 19. DESCANSO ── */}
          <Section num="19" title="Descanso">
            <Note text="Em cada descanso: recupera mínimo de mana + escolhe 2 ações adicionais" />
            <TH cols={['Ação', 'Teste', 'Resultado']} widths={[0.9, 1.1, 2]} />
            {descansaAcoes.map((row, i) => (
              <R3 key={i} a={row.acao} b={row.teste} c={row.resultado} />
            ))}
          </Section>

          {/* ── 20. EVOLUÇÃO ── */}
          <Section num="20" title="Evolução">
            <Note text="Personagens acumulam afinidade de cor (%) pelas ações durante a sessão. Ao atingir 100%: recebe 1 Identidade daquela cor. A contagem reinicia do zero." />
            <Sub text="Tipos de Cena e Afinidade" />
            <TH cols={['Cena', 'Dificuldade', 'Afinidade']} widths={[0.9, 1.3, 1.8]} />
            {evolucaoCenas.map((row, i) => (
              <R3 key={i} a={row.cena} b={row.dificuldade} c={row.afinidade} />
            ))}
            <Sub text="Comportamentos × Cor (Combate)" />
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
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RPG.headerBg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  sectionNum: {
    color: RPG.goldDim,
    fontSize: 11,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'right',
  },
  sectionTitle: {
    flex: 1,
    color: RPG.gold,
    fontSize: 14,
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
});
