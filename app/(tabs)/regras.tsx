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
            <R3 a="Branco" b="Ordem, lei, proteção, cura, comunidade" c="Verde, Azul · vs Verm, Preto" />
            <R3 a="Verde" b="Natureza, crescimento, força bruta, instinto" c="Branco, Verm · vs Azul, Preto" />
            <R3 a="Vermelho" b="Liberdade, fogo, impulso, criatividade" c="Verde, Preto · vs Branco, Azul" />
            <R3 a="Preto" b="Poder, ambição, morte, individualismo" c="Verm, Azul · vs Branco, Verde" />
            <R3 a="Azul" b="Conhecimento, lógica, ilusão, manipulação" c="Branco, Preto · vs Verm, Verde" />
            <Sub text="Combinações (Guildas)" />
            <R2 a="B+V" b="Selesnya — Comunidade" />
            <R2 a="V+R" b="Gruul — Autenticidade" />
            <R2 a="R+Pr" b="Rakdos — Independência" />
            <R2 a="Pr+Az" b="Dimir — Crescimento" />
            <R2 a="Az+B" b="Azorius — Estrutura" />
            <R2 a="B+R" b="Boros — Heroísmo" />
            <R2 a="V+Pr" b="Golgari — Profanação" />
            <R2 a="R+Az" b="Izzet — Criatividade" />
            <R2 a="Pr+B" b="Orzhov — Tribalismo" />
            <R2 a="Az+V" b="Simic — Busca pela verdade" />
          </Section>

          {/* ── 2. CONSTRUÇÃO DE PERSONAGENS ── */}
          <Section num="2" title="Construção de Personagens">
            <Note text="Identidade: unidade de evolução — 1 dado daquela cor no atributo, +Vida, +Sabedoria, +Mana incolor" />
            <TH cols={['Instância', 'Conceito', 'Atributos']} widths={[1, 1.5, 1.5]} />
            <R3 a="CORPO" b="Físico, combate" c="FOR · REF · VIG" />
            <R3 a="MENTE" b="Inteligência, percepção" c="RAZ · SEN · CON" />
            <R3 a="ESPÍRITO" b="Social, emocional" c="PRE · INT · VON" />
            <Sub text="Pontos por Identidade" />
            <TH cols={['', 'CORPO', 'MENTE', 'ESPÍRITO']} widths={[1.2, 1, 1, 1]} />
            <View style={styles.tableRow}>
              <Text style={[styles.tableKey, { flex: 1.2 }]}>Vida</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+10</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+5</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+6</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableKey, { flex: 1.2 }]}>Sabedoria</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+6</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+10</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+8</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableKey, { flex: 1.2 }]}>Mana incolor</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+1</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+2</Text>
              <Text style={[styles.tableVal, { flex: 1 }]}>+3</Text>
            </View>
          </Section>

          {/* ── 3. ATRIBUTOS ── */}
          <Section num="3" title="Atributos">
            <Note text="Cada atributo: até 5 identidades (dados). N dados = N d20 rolados por teste." />
            <Sub text="CORPO" />
            <R2 a="FOR" b="Força — levantar peso, corpo a corpo, atletismo" />
            <R2 a="REF" b="Reflexos — velocidade, movimentação, reações" />
            <R2 a="VIG" b="Vigor — resistir dor, condições físicas, venenos" />
            <Sub text="MENTE" />
            <R2 a="RAZ" b="Razão — aprender, raciocínio lógico, conjuração mental" />
            <R2 a="SEN" b="Sentidos — perceber o mundo pelos cinco sentidos" />
            <R2 a="CON" b="Concentração — foco, ações preparatórias, resistência mental" />
            <Sub text="ESPÍRITO" />
            <R2 a="PRE" b="Presença — notoriedade, intimidação, inspiração, camuflagem social" />
            <R2 a="INT" b="Intuição — perceber emoções, intenções, o mundo mágico" />
            <R2 a="VON" b="Vontade — resistir à influência alheia" />
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
            <R3 a="Foco" b="Branco" c="Máximo de permanentes (encantamentos + criaturas) em campo" />
            <R3 a="Canalização" b="Verde" c="Vezes/dia que pode canalizar mana colorido" />
            <R3 a="Domínios" b="Preto" c="Domínios mágicos conhecidos" />
            <R3 a="Memória" b="Azul" c="Feitiços memorizados (prontos para lançar sem conjurar)" />
            <R3 a="Velocidade" b="Vermelho" c="Ações bônus por cena (restauradas no início de cada cena)" />
          </Section>

          {/* ── 7. OUTROS PONTOS ── */}
          <Section num="7" title="Outros Pontos">
            <TH cols={['Ponto', 'Função']} />
            <R2 a="Vida" b="Pontos de vida total; ao chegar a 0, testa Vigor para resistir à morte" />
            <R2 a="Necrosado" b="Redutor permanente da Vida Total (dano necrotizante); não cura com descanso" />
            <R2 a="Armadura" b="Reduz 1 pt de dano físico por ponto" />
            <R2 a="Manto" b="Reduz 1 pt de dano mágico por ponto" />
            <R2 a="IP Corporal" b="Índice de Proteção Corporal (bônus de reação/defesa física)" />
            <R2 a="IP Mental" b="Índice de Proteção Mental" />
            <R2 a="IP Espiritual" b="Índice de Proteção Espiritual" />
            <R2 a="Mana" b="Reserva de mana colorido (W/G/R/B/U) + incolor" />
            <R2 a="Sabedoria" b="Pontos para comprar perícias, habilidades e mágicas" />
          </Section>

          {/* ── 8. MECÂNICA DE DADOS ── */}
          <Section num="8" title="Mecânica de Dados">
            <Note text="Teste base: rola N d20 (N = valor do atributo), escolhe o maior resultado, soma bônus da perícia." />
            <TH cols={['Dado', 'Cor', 'Característica Especial']} widths={[0.6, 0.8, 2.6]} />
            <R3 a="dW" b="Branco" c="Progressão: todos ≥ 14 → dobra bônus (2dW=13, 3dW=12, 4dW=11, 5dW=10)" />
            <R3 a="dG" b="Verde" c="Rola 2d10 em vez de d20; pares livres entre dados; cada dG extra +1d10" />
            <R3 a="dR" b="Vermelho" c="Crítico em 19–20 (expande: 2dR=18–20 e 1–2, 3dR=17–20 e 1–2, 4dR=16–20 e 1–3, 5dR=15–20 e 1–3)" />
            <R3 a="dB" b="Preto" c="Para cada dado ≤ 5: recebe +1d4 ao resultado" />
            <R3 a="dU" b="Azul" c="Resultado múltiplo de 5: rerrola o dado azul enquanto continuar ×5" />
            <Sub text="Resultados" />
            <R2 a="SUCESSO" b="> dificuldade — realiza a ação" />
            <R2 a="FRACASSO" b="< dificuldade — não realiza a ação" />
            <R2 a="SUC. CRÍTICO" b="20 com vantagem — realiza perfeitamente + bonificação" />
            <R2 a="FRAC. CRÍTICO" b="1 com desvantagem — realiza terrivelmente + consequência" />
            <R2 a="SUCESSO, MAS…" b="> dificuldade com vantagem + 1 nos dados — realiza, mas algo dá errado" />
            <R2 a="FRAC., MAS…" b="< dificuldade com desvantagem + 20 nos dados — não realiza, mas algo dá certo" />
          </Section>

          {/* ── 9. TESTES ── */}
          <Section num="9" title="Testes">
            <Note text="Fórmula: N d20 → maior resultado + bônus de perícia vs. dificuldade" />
            <TH cols={['Dificuldade', 'Valor', 'Modificador']} />
            <R3 a="Facílimo" b="5" c="Bônus positivo [+X] no resultado" />
            <R3 a="Fácil" b="10" c="Vantagem (+1d20)" />
            <R3 a="Normal" b="15" c="—" />
            <R3 a="Difícil" b="20" c="Penalidade [-X] no resultado" />
            <R3 a="Dificílimo" b="25" c="Desvantagem (-1d20)" />
            <R3 a="Excepcional" b="30" c="—" />
          </Section>

          {/* ── 10. SISTEMA DE MÁGICAS ── */}
          <Section num="10" title="Sistema de Mágicas">
            <Sub text="Tipos" />
            <TH cols={['Tipo', 'Símbolo', 'Funcionamento']} widths={[1.2, 0.7, 2.1]} />
            <R3 a="Truque" b="[T]" c="Grau 0; custo gratuito; 1º truque/turno não gasta ação" />
            <R3 a="Feitiço" b="[F]" c="Dissipa após efeito; conjurar [1] + lançar [1]; armazena na Memória" />
            <R3 a="Encantamento" b="[E]" c="Permanente em campo; ocupa slot de Foco; conjurar [grau] ações" />
            <R3 a="Criatura" b="[C]" c="Permanente em campo; ocupa slot de Foco; 1 invocação por criatura/cena" />
            <Sub text="Graus" />
            <R3 a="0 (Truque)" b="Básico" c="Incluído com o domínio" />
            <R3 a="Grau 1" b="Padrão" c="Incluído com o domínio" />
            <R3 a="Grau 2" b="Avançado" c="4 pts de Sabedoria" />
            <R3 a="Grau 3" b="Poderoso" c="8 pts de Sabedoria" />
            <Sub text="Notação de Custo de Mana" />
            <R2 a="] (gratuito)" b="Truque" />
            <R2 a="a" b="1 mana branco (W)" />
            <R2 a="g" b="1 mana verde (G)" />
            <R2 a="d" b="1 mana vermelho (R)" />
            <R2 a="b" b="1 mana preto (B)" />
            <R2 a="u" b="1 mana azul (U)" />
            <R2 a="1, 2, 3…" b="mana incolor genérico" />
            <R2 a="x" b="variável — jogador decide quanto pagar" />
            <Note text='Exemplos: "a" = {W} · "1a" = {1}{W} · "2aa" = {2}{W}{W} · "4aaa" = {4}{W}{W}{W}' />
            <Sub text="Conjuração" />
            <R2 a="Conjurar [1]" b="Feitiços gastam 1 ação" />
            <R2 a="Conjurar [grau]" b="Encantamentos/invocações gastam [grau] ações" />
            <R2 a="Lançar [1]" b="Lança mágica conjurada ou da Memória" />
            <R2 a="Trucar [0]" b="1º truque do turno não gasta ação" />
          </Section>

          {/* ── 11. DOMÍNIOS ── */}
          <Section num="11" title="Domínios">
            <Note text="45 domínios no total (9 por cor × 5 cores), organizados por Instância e Atributo-chave." />
            <Sub text="Branco" />
            <TH cols={['Domínio', 'Instância', 'Atributo', 'Perícia']} widths={[1.8, 0.8, 0.7, 0.7]} />
            {[
              ['Alçada da Honra', 'CORPO', 'FOR', 'AM'],
              ['Alçada da Justiça', 'CORPO', 'REF', 'Esg'],
              ['Alçada da Autoridade', 'CORPO', 'VIG', 'Esg'],
              ['Alçada do Armamento', 'MENTE', 'RAZ', 'Mec'],
              ['Alçada da Proteção', 'MENTE', 'SEN', 'Dip'],
              ['Alçada da União', 'MENTE', 'CON', 'Exp'],
              ['Alçada da Bondade', 'ESPÍRITO', 'PRE', 'Alq'],
              ['Alçada da Devoção', 'ESPÍRITO', 'INT', 'Dip'],
              ['Alçada da Luz', 'ESPÍRITO', 'VON', 'Dip'],
            ].map(([d, inst, atr, per], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{d}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{inst}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{atr}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{per}</Text>
              </View>
            ))}
            <Sub text="Verde" />
            {[
              ['Trilha do Instinto', 'CORPO', 'FOR', 'AM'],
              ['Trilha da Predação', 'CORPO', 'REF', 'Pont'],
              ['Trilha da Adaptação', 'CORPO', 'VIG', 'Atl'],
              ['Trilha da Subsistência', 'MENTE', 'RAZ', 'Alq'],
              ['Trilha do Ambiente', 'MENTE', 'SEN', 'Sob'],
              ['Trilha da Vitalidade', 'MENTE', 'CON', 'Atl'],
              ['Trilha dos Animais', 'ESPÍRITO', 'PRE', 'Com'],
              ['Trilha da Comunhão', 'ESPÍRITO', 'INT', 'Com'],
              ['Trilha da Vegetação', 'ESPÍRITO', 'VON', 'Com'],
            ].map(([d, inst, atr, per], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{d}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{inst}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{atr}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{per}</Text>
              </View>
            ))}
            <Sub text="Vermelho" />
            {[
              ['Desígnio da Ira', 'CORPO', 'FOR', 'Exp'],
              ['Desígnio da Agilidade', 'CORPO', 'REF', 'Atl'],
              ['Desígnio da Terra', 'CORPO', 'VIG', 'AM'],
              ['Desígnio da Maldade', 'MENTE', 'RAZ', 'Láb'],
              ['Desígnio do Raio', 'MENTE', 'SEN', 'Cri'],
              ['Desígnio dos Ritos Primais', 'MENTE', 'CON', 'Inv'],
              ['Desígnio da Guerra', 'ESPÍRITO', 'PRE', 'Exp'],
              ['Desígnio do Caos', 'ESPÍRITO', 'INT', 'Cri'],
              ['Desígnio do Fogo', 'ESPÍRITO', 'VON', 'Pont'],
            ].map(([d, inst, atr, per], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{d}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{inst}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{atr}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{per}</Text>
              </View>
            ))}
            <Sub text="Preto" />
            {[
              ['Arte da Dor', 'CORPO', 'FOR', 'Esg'],
              ['Arte das Sombras', 'CORPO', 'REF', 'Furt'],
              ['Arte do Sangue', 'CORPO', 'VIG', 'Inv'],
              ['Arte da Bruxaria', 'MENTE', 'RAZ', 'Alq'],
              ['Arte da Putrefação', 'MENTE', 'SEN', 'Sob'],
              ['Arte do Distúrbio', 'MENTE', 'CON', 'Láb'],
              ['Arte da Corrupção', 'ESPÍRITO', 'PRE', 'Int'],
              ['Arte da Necromancia', 'ESPÍRITO', 'INT', 'Int'],
              ['Arte da Danação', 'ESPÍRITO', 'VON', 'Furt'],
            ].map(([d, inst, atr, per], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{d}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{inst}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{atr}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{per}</Text>
              </View>
            ))}
            <Sub text="Azul" />
            {[
              ['Ramo da Água', 'CORPO', 'FOR', 'AM'],
              ['Ramo do Ar', 'CORPO', 'REF', 'Pont'],
              ['Ramo da Transmutação', 'CORPO', 'VIG', 'Furt'],
              ['Ramo do Conhecimento', 'MENTE', 'RAZ', 'Mec'],
              ['Ramo do Espaço-Tempo', 'MENTE', 'SEN', 'Mec'],
              ['Ramo da Mente', 'MENTE', 'CON', 'Inv'],
              ['Ramo da Ilusão', 'ESPÍRITO', 'PRE', 'Láb'],
              ['Ramo do Éter', 'ESPÍRITO', 'INT', 'Exp'],
              ['Ramo da Contramágica', 'ESPÍRITO', 'VON', 'Cri'],
            ].map(([d, inst, atr, per], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.8 }]}>{d}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{inst}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{atr}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{per}</Text>
              </View>
            ))}
          </Section>

          {/* ── 12. CANALIZAÇÃO E MANA ── */}
          <Section num="12" title="Canalização e Mana">
            <Note text="Ação de descanso — Teste: Vontade [Comunhão]" />
            <TH cols={['Resultado', 'Mana obtido']} />
            <R2 a="10+" b="1d4 de mana colorido" />
            <R2 a="15+" b="1d6" />
            <R2 a="20+" b="1d8" />
            <R2 a="25+" b="1d10" />
            <R2 a="30+" b="1d12" />
            <Sub text="Modificadores de Ambiente" />
            <R2 a="++" b="3 dados, fica maior — muito abundante" />
            <R2 a="+" b="2 dados, fica maior — abundante" />
            <R2 a="0" b="Normal" />
            <R2 a="–" b="2 dados, fica menor — escasso" />
            <R2 a="––" b="3 dados, fica menor — muito escasso" />
            <Sub text="Ambientes W·G·R·B·U (Branco·Verde·Verm·Preto·Azul)" />
            <R2 a="Deserto" b="–– · –– · –– · –– · ––" />
            <R2 a="Urbano" b="+ · – · – · + · –" />
            <R2 a="Natureza" b="– · + · + · – · +" />
            <R2 a="Fortaleza" b="+ · – · — · — · —" />
            <R2 a="Planícies" b="++ · + · – · – · —" />
            <R2 a="Floresta" b="— · + · — · — · —" />
            <R2 a="Selva densa" b="– · ++ · + · — · –" />
            <R2 a="Rochoso" b="— · — · + · — · –" />
            <R2 a="Vulcões" b="– · — · ++ · + · –" />
            <R2 a="Catacumbas" b="– · – · — · + · —" />
            <R2 a="Pântanos" b="– · – · — · ++ · +" />
            <R2 a="Fonte de água" b="— · — · – · — · +" />
            <R2 a="Alto mar" b="+ · – · – · — · ++" />
            <Sub text="Eventos Climáticos" />
            <R2 a="Frio" b="— · — · – · — · +" />
            <R2 a="Calor" b="— · — · + · — · –" />
            <R2 a="Ventos fortes" b="— · – · – · — · +" />
            <R2 a="Chuva intensa" b="— · + · – · — · +" />
            <R2 a="Nevasca" b="– · –– · –– · – · ++" />
            <R2 a="Tempestade" b="– · –– · ++ · – · +" />
            <R2 a="Dia" b="— · — · — · – · —" />
            <R2 a="Sol a pino" b="+ · — · — · –– · —" />
            <R2 a="Noite" b="– · — · — · — · —" />
            <R2 a="Lua cheia" b="–– · — · — · + · —" />
            <R2 a="Eclipse solar" b="++ · — · – · ++ · –" />
          </Section>

          {/* ── 13. EQUIPAMENTOS ── */}
          <Section num="13" title="Equipamentos">
            <Sub text="Armas" />
            <TH cols={['Arma', 'Dano', 'Especial']} widths={[1.3, 0.7, 2]} />
            <R3 a="Adaga" b="1d4" c="REF · Esg[Leve]/Pont[Arremesso] · alcance curto 9m" />
            <R3 a="Arco Curto" b="1d6" c="REF · Pont[Arcos] · alcance médio 18m" />
            <R3 a="Arco Longo" b="1d8" c="FOR · Pont[Arcos] · alcance longo 30m" />
            <R3 a="Bastão Curto" b="1d4*" c="FOR/REF · AM · *Destreza aumenta dano" />
            <R3 a="Bastão Longo" b="1d6*" c="FOR/REF · AM · alcance próximo 3m" />
            <R3 a="Cajado" b="1d6" c="RAZ/PRE · Pont[Condutores] duas mãos · dano mágico" />
            <R3 a="Desarmado" b="1d3*" c="FOR · AM · *Destreza aumenta dano" />
            <R3 a="Espada" b="1d6" c="FOR · Esg[Uma Mão] · 1d8 duas mãos" />
            <R3 a="Lança Curta" b="1d6" c="REF · Esg[Uma Mão]/Pont[Arremesso] · 18m" />
            <R3 a="Lança Longa" b="1d10" c="REF · Esg[Duas Mãos] · alcance próximo 3m" />
            <R3 a="Machado" b="1d6" c="FOR · Esg[Leve]/Pont[Arremesso] · 1d8 duas mãos" />
            <R3 a="Montante" b="1d12" c="FOR · Esg[Duas Mãos]" />
            <R3 a="Varinha" b="1d4" c="RAZ/PRE · Pont[Condutores] uma mão · dano mágico" />
            <Sub text="Escudos" />
            <TH cols={['Escudo', 'IP Corp', 'Especial']} widths={[1.5, 0.8, 1.7]} />
            <R3 a="Escudo de Mão" b="+1" c="Permite ataque desarmado" />
            <R3 a="Escudo de Bronze" b="+2" c="Só com armas leves/uma mão" />
            <R3 a="Escudo Rúnico" b="+1M +1E" c="Só com armas leves/uma mão" />
            <Sub text="Vestimentas" />
            <TH cols={['Vestimenta', 'IP Corp', 'IP Ment', 'IP Esp']} widths={[1.6, 0.8, 0.8, 0.8]} />
            {[
              ['Farda de Combatente', '+1', '—', '—'],
              ['Farda de Cavaleiro', '+2', '—', '—'],
              ['Túnica de Aprendiz', '—', '+1', '—'],
              ['Túnica de Sábio', '—', '+2', '—'],
              ['Traje da Nobreza', '—', '—', '+1'],
              ['Traje da Realeza', '—', '—', '+2'],
            ].map(([v, c1, c2, c3], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 1.6 }]}>{v}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{c1}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{c2}</Text>
                <Text style={[styles.tableVal, { flex: 0.8 }]}>{c3}</Text>
              </View>
            ))}
            <Sub text="Acessórios Básicos" />
            <TH cols={['Acessório', 'Bônus']} />
            <R2 a="Bracelete de Prata" b="+1 Velocidade" />
            <R2 a="Tiara de Prata" b="+1 Memória" />
            <R2 a="Colar de Prata" b="+1 Foco" />
            <R2 a="Brincos de Prata" b="+1 Canalização" />
            <R2 a="Broche de Prata" b="+1 Domínio" />
            <Sub text="Melhorias (máx. 3 por item)" />
            <R2 a="Armas" b="W=Acurácia+1 · G=Acurácia madeira+1 · R=Dano físico+1 · B=Dado dano+1 · U=Dano mágico+1" />
            <R2 a="Vestimentas" b="W=Armadura+1 · G=Manto+1 · R=IP Corp.+1 · B=IP Esp.+1 · U=IP Mental+1" />
            <Sub text="Propriedades Elementais" />
            <TH cols={['Cor', 'Propriedade', 'Efeito']} widths={[0.7, 1.3, 2]} />
            <R3 a="Branco" b="Sagrado" c="2× dano em profanas; normal em Incorpóreos" />
            <R3 a="Branco" b="Vinculado" c="Recupera 50% do dano causado como vida" />
            <R3 a="Verde" b="Ácido" c="Ignora Armadura e Manto" />
            <R3 a="Verde" b="Venenoso" c="Atribui condição Envenenado" />
            <R3 a="Vermelho" b="Elétrico" c="Não pode ser reagido" />
            <R3 a="Vermelho" b="Ígneo" c="30% de chance de Incendiado" />
            <R3 a="Preto" b="Necrotizante" c="Diminui Vida Total (condição Necrosado)" />
            <R3 a="Preto" b="Profano" c="2× dano em sagradas; normal em Incorpóreos" />
            <R3 a="Azul" b="Gélido" c="30% de chance de Congelado" />
            <R3 a="Azul" b="Hídrico" c="Atribui condição Molhado" />
            <Sub text="Afiadores (combinações de minerais)" />
            <R2 a="{WWB}" b="Vinculado" />
            <R2 a="{WWG}" b="Sagrado" />
            <R2 a="{GGB}" b="Venenoso" />
            <R2 a="{GGR}" b="Ácido" />
            <R2 a="{RRW}" b="Ígneo" />
            <R2 a="{RRU}" b="Elétrico" />
            <R2 a="{BBR}" b="Profano" />
            <R2 a="{BBU}" b="Necrotizante" />
            <R2 a="{UUW}" b="Gélido" />
            <R2 a="{UUG}" b="Hídrico" />
          </Section>

          {/* ── 14. MATÉRIAS-PRIMAS E ALQUIMIA ── */}
          <Section num="14" title="Matérias-primas e Alquimia">
            <Sub text="Herbologia (Ervas)" />
            <R2 a="Brancas" b="Curativos" />
            <R2 a="Verdes" b="Imunizantes" />
            <R2 a="Vermelhas" b="Estimulantes" />
            <R2 a="Pretas" b="Danosos" />
            <R2 a="Azuis" b="Adaptativos" />
            <Sub text="Receitas básicas (3 ervas)" />
            <R2 a="2B + 1" b="Cura 1d8+3 (pura) ou 1d6+2 + remoção de condição" />
            <R2 a="2V + 1" b="Resistência a danos" />
            <R2 a="2R + 1" b="Bônus em balizadores ou Dano" />
            <R2 a="2Pr + 1" b="Causa condições" />
            <R2 a="2Az + 1" b="Bônus de IP" />
            <Sub text="Proporções" />
            <R2 a="1 erva" b="Efeito brando" />
            <R2 a="2 ervas (2/0)" b="Efeito moderado" />
            <R2 a="2 ervas (1/1)" b="Poção de mana branda" />
            <R2 a="3 ervas (3/0/0)" b="Efeito potente" />
            <R2 a="3 ervas (2/1/0)" b="Especializado" />
            <R2 a="3 ervas (1/1/1)" b="Mana moderada" />
            <R2 a="4+ ervas" b="Efeitos superiores / poções de mana" />
            <Sub text="Zoologia — Soros (mutações temporárias)" />
            <R2 a="Branco" b="Voar, Vínculo, Iniciativa, Vigilância" />
            <R2 a="Verde" b="Atropelar, Regenerar" />
            <R2 a="Vermelho" b="Ímpeto, Iniciativa" />
            <R2 a="Preto" b="Toque Mortífero, Amedrontar, Regenerar" />
            <R2 a="Azul" b="Mergulhar, Voar, Vidência" />
            <Sub text="Zoologia — Catalizadores (de ossadas)" />
            <R2 a="Branco" b="Entrelaçar: une efeitos de 2 mágicas" />
            <R2 a="Verde" b="Reforçar: potencializa dano/alcance/duração" />
            <R2 a="Vermelho" b="Acelerar: reduz tempo de conjuração" />
            <R2 a="Preto" b="Recapitular: replica mágica já conjurada" />
            <R2 a="Azul" b="Reciclar: modifica características da mágica" />
            <Note text="Complexidade: Insetos < Peixes/Anfíbios < Répteis < Aves < Mamíferos" />
            <Sub text="Mineralogia" />
            <R2 a="Bombas" b="Causam efeitos em área" />
            <R2 a="Afiadores" b="Atribuem tipo de dano a armas (ver §13)" />
            <R2 a="Proteções" b="{WWW/GGG/RRR/BBB/UUU} = Proteção contra cor correspondente" />
          </Section>

          {/* ── 15. ARTEFATOS ── */}
          <Section num="15" title="Artefatos">
            <Note text="Objetos mágicos com Durabilidade (número de usos antes de precisar reparo)." />
            <TH cols={['Tipo', 'Produzido por']} />
            <R2 a="Objetos (acessórios, lanternas, joias)" b="Artesãos" />
            <R2 a="Condutores (varinhas, cajados)" b="Feiticeiros" />
            <R2 a="Equipamentos (armas, escudos, armaduras)" b="Ferreiros" />
            <R2 a="Criaturas mecânicas" b="Moldadores" />
            <Sub text="Uso e Reparo" />
            <R2 a="Ativar [1]" b="Custa mana incolor" />
            <R2 a="Reparar" b="CON [Mecânica] em descanso: 10+=1 · 15+=2 · 20+=3 · 25+=4 · 30+=5 cargas" />
          </Section>

          {/* ── 16. CRIATURAS ── */}
          <Section num="16" title="Criaturas">
            <Sub text="Tabela de Classes" />
            <TH cols={['Cl', 'Gr', 'Custo', 'Vida', 'Res', 'Poder', 'Dano', 'Dur']} widths={[0.5, 0.4, 0.7, 0.7, 0.5, 1.1, 0.6, 0.5]} />
            {[
              ['f', '1', '{1}', '1–4', '10', '1d20', '1d2', '1'],
              ['E', '1', '{2}', '4–8', '11', '1d20+1', '1d4', '2–3'],
              ['D', '1–2', '{3}', '8–14', '12', '2d20+1', '1d6', '4–5'],
              ['C', '2', '{4–5}', '14–20', '13', '2d20+3', '1d8', '6–7'],
              ['B', '3', '{6–7}', '20–26', '14', '3d20+3', '1d10', '8–9'],
              ['A', '3', '{8–9}', '26–32', '15', '3d20+5', '1d12', '10'],
              ['S', '—', '—', '?', '?', '?', '?', '?'],
            ].map(([cls, grau, custo, vida, res, pod, dano, dur], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableKey, { flex: 0.5 }]}>{cls}</Text>
                <Text style={[styles.tableVal, { flex: 0.4 }]}>{grau}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{custo}</Text>
                <Text style={[styles.tableVal, { flex: 0.7 }]}>{vida}</Text>
                <Text style={[styles.tableVal, { flex: 0.5 }]}>{res}</Text>
                <Text style={[styles.tableVal, { flex: 1.1 }]}>{pod}</Text>
                <Text style={[styles.tableVal, { flex: 0.6 }]}>{dano}</Text>
                <Text style={[styles.tableVal, { flex: 0.5 }]}>{dur}</Text>
              </View>
            ))}
            <Sub text="Mecânica de Ataque" />
            <R2 a="Atacar" b="Controlador rola 1d20 ≤ valor de Poder da criatura" />
            <R2 a="Defender" b="Alvo rola 1d20 ≥ Resistência da criatura" />
            <Sub text="Habilidades de Criaturas" />
            <R2 a="Alcance" b="Atinge criaturas com Voar" />
            <R2 a="Amedrontar" b="Criaturas não atacam espontaneamente; bônus de dano por Classe" />
            <R2 a="Atropelar" b="Excesso de dano vai ao controlador" />
            <R2 a="Ímpeto" b="Sem enjoo de invocação" />
            <R2 a="Incorpóreo" b="Imune a físico + condições; vulnerável a sagrado/profano" />
            <R2 a="Iniciativa" b="Sempre ataca primeiro em confrontos" />
            <R2 a="Toque Mortífero" b="Destrói criaturas de mesma classe ou inferior" />
            <R2 a="Vínculo c/ vida" b="Controlador cura = dano causado pela criatura" />
            <R2 a="Voar" b="Condição Alado; só atacável por quem tiver Voar/Alcance" />
          </Section>

          {/* ── 17. CONDIÇÕES ── */}
          <Section num="17" title="Condições">
            <TH cols={['Condição', 'Efeito']} />
            <R2 a="Alado" b="Pode voar; imune a corpo a corpo de criaturas sem Voar/Alcance" />
            <R2 a="Congelado" b="Imóvel; teste dificílimo (25) de Vigor [Atletismo]; a cada rodada que falhar, dificuldade diminui 1 nível" />
            <R2 a="Envenenado" b="Acumula marcadores de veneno (efeitos progressivos 2/4/6/8/10)" />
            <R2 a="Incendiado" b="1d6 dano ígneo/turno; acumula se repetido" />
            <R2 a="Molhado" b="Desvantagem em testes corporais; vulnerável a elétrico" />
            <R2 a="Morrendo" b="Com 0 vida; 3 testes de Vigor [Atletismo] para sobreviver" />
            <R2 a="Necrosado" b="Vida Total reduzida pelo dano; não cura com descanso" />
            <Sub text="Veneno — Marcadores" />
            <R2 a="2 marcadores" b="Curas recuperam 50%" />
            <R2 a="4 marcadores" b="Descanso: 1 ação a menos" />
            <R2 a="6 marcadores" b="Desvantagem (-1d20) em todos os testes" />
            <R2 a="8 marcadores" b="Combate: 1 ação a menos/turno" />
            <R2 a="10 marcadores" b="Cai imediatamente (condição Morrendo)" />
          </Section>

          {/* ── 18. COMBATE ── */}
          <Section num="18" title="Combate">
            <Note text="Ações por turno: 1 movimentação + 1 operação + 1 reação + ações extras de Velocidade" />
            <Sub text="Movimentação" />
            <TH cols={['Ação', 'Custo', 'Efeito']} />
            <R3 a="Deslocar-se" b="[1]" c="Move até 9m" />
            <R3 a="Esconder-se" b="[1]" c="REF [Furtividade]; necessário para ataque surpresa" />
            <R3 a="Pegar" b="[1]" c="Sacar arma, pegar item, entregar objeto" />
            <Sub text="Operações (Ações Padrão)" />
            <TH cols={['Ação', 'Custo', 'Efeito']} />
            <R3 a="Atacar" b="[1]" c="Golpe físico" />
            <R3 a="Usar Item" b="[1]" c="Poções, bombas, outros itens" />
            <R3 a="Movimentar-se" b="[1]" c="Substitui operação por movimento extra" />
            <Sub text="Reações" />
            <TH cols={['Reação', 'Custo', 'Efeito']} />
            <R3 a="Aparar" b="[1]" c="REF [Artes Marciais] oposto; sucesso = metade dano + manobra" />
            <R3 a="Contra-atacar" b="[1]" c="Se atacante falhar: ataque de REF [Esgrima]" />
            <R3 a="Esquivar-se" b="[1]" c="REF [Furtividade] oposto; sucesso = zero dano" />
            <R3 a="Disparar" b="[1]" c="Movimentação extra com teste de [Atletismo]" />
            <R3 a="Mirar" b="[1]" c="Bônus ao próximo teste de [Pontaria]" />
            <Sub text="Manifestações (Ações Mágicas)" />
            <TH cols={['Ação', 'Custo', 'Efeito']} />
            <R3 a="Ativar" b="[1]" c="Ativa efeito de artefato" />
            <R3 a="Canalizar" b="[3]" c="Canaliza mana colorida; gasta 1 Canalização" />
            <R3 a="Comandar" b="[1]" c="Ativa habilidade de criatura" />
            <R3 a="Conjurar" b="[1]/[grau]" c="Feitiço=[1]; Encantamento/Invocação=[grau] ações" />
            <R3 a="Lançar" b="[1]" c="Lança mágica conjurada ou da Memória" />
            <R3 a="Trucar" b="[0]" c="Lança truque; 1º por turno = gratuito" />
          </Section>

          {/* ── 19. DESCANSO ── */}
          <Section num="19" title="Descanso">
            <Note text="Em cada descanso: recupera mínimo de mana + escolhe 2 ações adicionais" />
            <TH cols={['Ação', 'Teste', 'Resultado']} widths={[0.9, 1.1, 2]} />
            <R3 a="Repousar" b="VIG [Atletismo]" c="10+=20% vida · 15+=40% · 20+=60% · 25+=80% · 30+=100%" />
            <R3 a="Praticar" b="CON [AM/Inv/Lábia]" c="10+=1 SAB · 15+=2 · 20+=3 · 25+=4 · 30+=5" />
            <R3 a="Canalizar" b="VON [Comunhão]" c="10+=1d4 mana · 15+=1d6 · 20+=1d8 · 25+=1d10 · 30+=1d12" />
            <R3 a="Coletar" b="RAZ [Sobrevivência]" c="10+=1 matéria · 15+=2 · 20+=3 · 25+=4 · 30+=5" />
            <R3 a="Produzir" b="RAZ [Alquimia]" c="falha=efeito reduzido · 10+=pretendido · 20+=potencializado" />
            <R3 a="Improvisar" b="RAZ [Criatividade]" c="falha=instável/1 cena · 10+=1 cena · 20+=3 cenas" />
            <R3 a="Inscrever" b="RAZ [Investigação]" c="falha=reduzido · 10+=pretendido · 20+=potencializado" />
            <R3 a="Fabricar" b="RAZ [Mecânica]" c="falha=0,5 etapa · 10+=1 etapa · 20+=2 etapas" />
            <R3 a="Reparar" b="CON [Mecânica]" c="10+=1 carga · 15+=2 · 20+=3 · 25+=4 · 30+=5" />
          </Section>

          {/* ── 20. EVOLUÇÃO ── */}
          <Section num="20" title="Evolução">
            <Note text="Personagens acumulam afinidade de cor (%) pelas ações durante a sessão. Ao atingir 100%: recebe 1 Identidade daquela cor. A contagem reinicia do zero." />
            <Sub text="Tipos de Cena e Afinidade" />
            <TH cols={['Cena', 'Dificuldade', 'Afinidade']} widths={[0.9, 1.3, 1.8]} />
            <R3 a="CORPO" b="Fácil (1–3 turnos)" c="20% ou 3d10" />
            <R3 a="CORPO" b="Moderada (4–8)" c="50% ou 7d10" />
            <R3 a="CORPO" b="Difícil (9+)" c="80% ou 10d10" />
            <R3 a="MENTE" b="Simples" c="20%" />
            <R3 a="MENTE" b="Complexa" c="50%" />
            <R3 a="MENTE" b="Desafiadora" c="80%" />
            <R3 a="ESPÍRITO" b="Tranquila" c="20%" />
            <R3 a="ESPÍRITO" b="Tensa" c="50%" />
            <R3 a="ESPÍRITO" b="Turbulenta" c="80%" />
            <Sub text="Comportamentos × Cor (Combate)" />
            <R2 a="Branco" b="Estratégico, protetor, líder, autoritário" />
            <R2 a="Verde" b="Linha de frente, resistente, instintivo, brutal" />
            <R2 a="Vermelho" b="Rápido, impulsivo, emocional, sem cautela" />
            <R2 a="Preto" b="Furtivo, oportunista, priorizou sobrevivência" />
            <R2 a="Azul" b="Evitou confronto direto, explorou fraquezas, tático" />
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
