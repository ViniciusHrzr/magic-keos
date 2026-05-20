import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
import SpellDetailCard from '@/components/rpg/SpellDetailCard';
import { RPG } from '@/constants/theme';
import { selectedSpell } from '@/store/selectedSpell';

export default function SpellDetailScreen() {
  const router = useRouter();
  const { character: c, setMagica } = useCharacter();
  const spell = selectedSpell.get();

  React.useEffect(() => {
    if (!spell) router.back();
  }, []);

  if (!spell) return null;

  const tagKey = `spell-${spell.nome}`;

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Animated.View
          style={styles.card}
          // @ts-expect-error sharedTransitionTag não está nos tipos do Reanimated 4.x mas funciona em runtime via herança da v3 API
          sharedTransitionTag={tagKey}
        >
          <SpellDetailCard
            spell={spell}
            onClose={() => router.back()}
            magicas={c.magicas}
            onAddMagica={setMagica}
          />
        </Animated.View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RPG.bg },
  card: {
    flex: 1,
    backgroundColor: RPG.surface,
    borderTopWidth: 2,
    borderTopColor: RPG.gold,
  },
});
