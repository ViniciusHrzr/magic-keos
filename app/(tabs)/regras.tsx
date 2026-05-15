import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <View style={[styles.tableRow, styles.tableHeaderRow]}>
      {cols.map((c, i) => (
        <Text key={i} style={[styles.tableKey, i === 0 ? styles.colFirst : styles.colFlex]}>
          {c}
        </Text>
      ))}
    </View>
  );
}

function Row2({ a, b }: { a: string; b: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableKey, styles.colFirst]}>{a}</Text>
      <Text style={[styles.tableVal, styles.colFlex]}>{b}</Text>
    </View>
  );
}

function Row3({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableKey, styles.colFirst]}>{a}</Text>
      <Text style={[styles.tableMid, styles.colMid]}>{b}</Text>
      <Text style={[styles.tableVal, styles.colFlex]}>{c}</Text>
    </View>
  );
}

function SubTitle({ text }: { text: string }) {
  return <Text style={styles.subTitle}>{text}</Text>;
}

// ---------------------------------------------------------------------------
// Section: Mecânica de Dados
// ---------------------------------------------------------------------------

function SecMecanicaDados() {
  return (
    <View style={styles.tableBlock}>
      <TableHeader cols={['Dado', 'Cor', 'Característica Especial']} />
      <Row3 a="dW" b="Branco" c="Progressão: se todos ≥ 14, dobra bônus de perícia (2dW=13, 3dW=12, 4dW=11, 5dW=10)" />
      <Row3 a="dG" b="Verde" c="Rola 2d10 em vez de d20; pares livres entre dados; cada dG extra +1d10" />
      <Row3 a="dR" b="Vermelho" c="Crítico em 19–20 (expande: 2dR=18–20, 3dR=17–20, 4dR=16–20 e 1–3, 5dR=15–20 e 1–3)" />
      <Row3 a="dB" b="Preto" c="Para cada dado ≤ 5: recebe +1d4 ao resultado" />
      <Row3 a="dU" b="Azul" c="Resultado múltiplo de 5: rerrola o dado azul enquanto continuar ×5" />

      <Text style={styles.sectionIntro}>Resultados Possíveis</Text>
      <TableHeader cols={['Condição', 'Resultado']} />
      <Row2 a="SUCESSO" b="> dificuldade — realiza a ação" />
      <Row2 a="FRACASSO" b="< dificuldade — não realiza a ação" />
      <Row2 a="SUCESSO CRÍTICO" b="20 com vantagem — realiza perfeitamente + bonificação" />
      <Row2 a="FRACASSO CRÍTICO" b="1 com desvantagem — realiza terrivelmente + consequência" />
      <Row2 a="SUCESSO, MAS…" b="> dificuldade com vantagem + 1 nos dados — realiza, mas algo dá errado" />
      <Row2 a="FRACASSO, MAS…" b="< dificuldade com desvantagem + 20 nos dados — não realiza, mas algo dá certo" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section: Testes
// ---------------------------------------------------------------------------

function SecTestes() {
  return (
    <View style={styles.tableBlock}>
      <Text style={styles.sectionIntro}>
        Fórmula: N d20 (N = valor do atributo) → maior resultado + bônus de perícia vs. dificuldade
      </Text>
      <TableHeader cols={['Dificuldade', 'Valor', 'Modificador']} />
      <Row3 a="Facílimo" b="5" c="Bônus positivo [+X] no resultado" />
      <Row3 a="Fácil" b="10" c="Vantagem (+1d20)" />
      <Row3 a="Normal" b="15" c="—" />
      <Row3 a="Difícil" b="20" c="Penalidade [-X] no resultado" />
      <Row3 a="Dificílimo" b="25" c="Desvantagem (-1d20)" />
      <Row3 a="Excepcional" b="30" c="—" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section: Combate
// ---------------------------------------------------------------------------

function SecCombate() {
  return (
    <View style={styles.tableBlock}>
      <Text style={styles.sectionIntro}>
        Ações por turno: 1 movimentação + 1 operação + 1 reação + ações extras de Velocidade
      </Text>

      <SubTitle text="Movimentação" />
      <TableHeader cols={['Ação', 'Custo', 'Efeito']} />
      <Row3 a="Deslocar-se" b="[1]" c="Move até 9m" />
      <Row3 a="Esconder-se" b="[1]" c="REF [Furtividade]; necessário para ataque surpresa" />
      <Row3 a="Pegar" b="[1]" c="Sacar arma, pegar item, entregar objeto" />

      <SubTitle text="Operações (Ações Padrão)" />
      <TableHeader cols={['Ação', 'Custo', 'Efeito']} />
      <Row3 a="Atacar" b="[1]" c="Golpe físico" />
      <Row3 a="Usar Item" b="[1]" c="Poções, bombas, outros itens" />
      <Row3 a="Movimentar-se" b="[1]" c="Substitui operação por movimento extra" />

      <SubTitle text="Reações" />
      <TableHeader cols={['Reação', 'Custo', 'Efeito']} />
      <Row3 a="Aparar" b="[1]" c="REF [Artes Marciais] oposto; sucesso = metade dano + manobra" />
      <Row3 a="Contra-atacar" b="[1]" c="Se atacante falhar: ataque de REF [Esgrima]" />
      <Row3 a="Esquivar-se" b="[1]" c="REF [Furtividade] oposto; sucesso = zero dano" />
      <Row3 a="Disparar" b="[1]" c="Movimentação extra com teste de [Atletismo]" />
      <Row3 a="Mirar" b="[1]" c="Bônus ao próximo teste de [Pontaria]" />

      <SubTitle text="Manifestações (Ações Mágicas)" />
      <TableHeader cols={['Ação', 'Custo', 'Efeito']} />
      <Row3 a="Ativar" b="[1]" c="Ativa efeito de artefato" />
      <Row3 a="Canalizar" b="[3]" c="Canaliza mana colorida; gasta 1 Canalização" />
      <Row3 a="Comandar" b="[1]" c="Ativa habilidade de criatura" />
      <Row3 a="Conjurar" b="[1]/[grau]" c="Feitiço=[1]; Encantamento/Invocação=[grau] ações" />
      <Row3 a="Lançar" b="[1]" c="Lança mágica conjurada ou da Memória" />
      <Row3 a="Trucar" b="[0]" c="Lança truque; 1º por turno = gratuito" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section: Condições
// ---------------------------------------------------------------------------

function SecCondicoes() {
  return (
    <View style={styles.tableBlock}>
      <TableHeader cols={['Condição', 'Efeito']} />
      <Row2 a="Alado" b="Pode voar; imune a corpo a corpo de criaturas sem Voar/Alcance" />
      <Row2 a="Congelado" b="Imóvel; teste difícil de Vigor [Atletismo] por rodada para sair" />
      <Row2 a="Envenenado" b="Acumula marcadores de veneno (efeitos progressivos 2/4/6/8/10)" />
      <Row2 a="Incendiado" b="1d6 dano ígneo/turno; acumula se repetido" />
      <Row2 a="Molhado" b="Desvantagem em testes corporais; vulnerável a elétrico" />
      <Row2 a="Morrendo" b="Com 0 vida; 3 testes de Vigor [Atletismo] para sobreviver" />
      <Row2 a="Necrosado" b="Vida Total reduzida pelo dano; não cura com descanso" />

      <Text style={styles.sectionIntro}>Veneno — Marcadores</Text>
      <TableHeader cols={['Marcadores', 'Efeito']} />
      <Row2 a="2" b="Curas recuperam 50%" />
      <Row2 a="4" b="Descanso: 1 ação a menos" />
      <Row2 a="6" b="Desvantagem (-1d20) em todos os testes" />
      <Row2 a="8" b="Combate: 1 ação a menos/turno" />
      <Row2 a="10" b="Cai imediatamente (condição Morrendo)" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section: Canalização
// ---------------------------------------------------------------------------

function SecCanalizacao() {
  return (
    <View style={styles.tableBlock}>
      <Text style={styles.sectionIntro}>
        Ação de descanso — Teste: Vontade [Comunhão]
      </Text>
      <TableHeader cols={['Resultado', 'Mana obtido']} />
      <Row2 a="10+" b="1d4 de mana colorido" />
      <Row2 a="15+" b="1d6" />
      <Row2 a="20+" b="1d8" />
      <Row2 a="25+" b="1d10" />
      <Row2 a="30+" b="1d12" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section: Descanso
// ---------------------------------------------------------------------------

function SecDescanso() {
  return (
    <View style={styles.tableBlock}>
      <Text style={styles.sectionIntro}>
        Em cada descanso: recupera mínimo de mana + escolhe 2 ações adicionais
      </Text>
      <TableHeader cols={['Ação', 'Teste', 'Resultado']} />
      <Row3 a="Repousar" b="VIG [Atletismo]" c="10+=20% vida · 15+=40% · 20+=60% · 25+=80% · 30+=100%" />
      <Row3 a="Praticar" b="CON [AM/Inv/Lábia]" c="10+=1 SAB · 15+=2 · 20+=3 · 25+=4 · 30+=5" />
      <Row3 a="Canalizar" b="VON [Comunhão]" c="10+=1d4 mana · 15+=1d6 · 20+=1d8 · 25+=1d10 · 30+=1d12" />
      <Row3 a="Coletar" b="RAZ [Sobrevivência]" c="10+=1 matéria · 15+=2 · 20+=3 · 25+=4 · 30+=5" />
      <Row3 a="Produzir" b="RAZ [Alquimia]" c="falha=efeito reduzido · 10+=pretendido · 20+=potencializado" />
      <Row3 a="Improvisar" b="RAZ [Criatividade]" c="falha=instável/1 cena · 10+=1 cena · 20+=3 cenas" />
      <Row3 a="Inscrever" b="RAZ [Investigação]" c="falha=reduzido · 10+=pretendido · 20+=potencializado" />
      <Row3 a="Fabricar" b="RAZ [Mecânica]" c="falha=0,5 etapa · 10+=1 etapa · 20+=2 etapas" />
      <Row3 a="Reparar" b="CON [Mecânica]" c="10+=1 carga · 15+=2 · 20+=3 · 25+=4 · 30+=5" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section: Balizadores
// ---------------------------------------------------------------------------

function SecBalizadores() {
  return (
    <View style={styles.tableBlock}>
      <TableHeader cols={['Balizador', 'Cor-chave', 'Função']} />
      <Row3 a="Foco" b="Branco" c="Máximo de permanentes (encantamentos + criaturas) em campo" />
      <Row3 a="Canalização" b="Verde" c="Vezes/dia que pode canalizar mana colorido" />
      <Row3 a="Domínios" b="Preto" c="Domínios mágicos conhecidos" />
      <Row3 a="Memória" b="Azul" c="Feitiços memorizados (prontos para lançar sem conjurar)" />
      <Row3 a="Velocidade" b="Vermelho" c="Ações bônus por cena (restauradas no início de cada cena)" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function RegrasScreen() {
  const { character: c, setNotas, isLoaded } = useCharacter();

  if (!isLoaded) {
    return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleBar}>
            <Text style={styles.title}>Regras</Text>
          </View>

          {/* 1. Mecânica de Dados */}
          <SectionHeader title="Mecânica de Dados" />
          <SecMecanicaDados />

          {/* 2. Testes */}
          <SectionHeader title="Testes" />
          <SecTestes />

          {/* 3. Combate */}
          <SectionHeader title="Combate" />
          <SecCombate />

          {/* 4. Condições */}
          <SectionHeader title="Condições" />
          <SecCondicoes />

          {/* 5. Canalização */}
          <SectionHeader title="Canalização" />
          <SecCanalizacao />

          {/* 6. Descanso */}
          <SectionHeader title="Descanso" />
          <SecDescanso />

          {/* 7. Balizadores */}
          <SectionHeader title="Balizadores" />
          <SecBalizadores />

          {/* 8. Notas */}
          <SectionHeader title="Notas" />
          <View style={styles.tableBlock}>
            <TextInput
              style={styles.textArea}
              value={c.notas}
              onChangeText={setNotas}
              multiline
              placeholder="Anotações de sessão..."
              placeholderTextColor={RPG.textDark}
              textAlignVertical="top"
            />
          </View>
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
  },
  title: {
    color: RPG.gold,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  tableBlock: {
    backgroundColor: RPG.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
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
    gap: 8,
    alignItems: 'flex-start',
  },
  tableKey: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  tableMid: {
    color: RPG.text,
    fontSize: 12,
    flex: 1,
  },
  tableVal: {
    color: RPG.textMuted,
    fontSize: 12,
    flex: 2,
  },
  colFirst: {
    minWidth: 80,
  },
  colMid: {
    minWidth: 56,
  },
  colFlex: {
    flex: 1,
  },

  sectionIntro: {
    color: RPG.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 6,
  },

  subTitle: {
    color: RPG.goldDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingTop: 10,
    paddingBottom: 2,
  },

  textArea: {
    backgroundColor: RPG.surface,
    color: RPG.text,
    fontSize: 13,
    padding: 10,
    minHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
});
