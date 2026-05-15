import React from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';

export default function NotasScreen() {
  const { character: c, setNotas, isLoaded } = useCharacter();

  if (!isLoaded) {
    return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Notas</Text>
        </View>
        <TextInput
          style={styles.textArea}
          value={c.notas}
          onChangeText={setNotas}
          multiline
          placeholder="Anotações de sessão..."
          placeholderTextColor={RPG.textDark}
          textAlignVertical="top"
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RPG.bg },
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
  textArea: {
    flex: 1,
    backgroundColor: RPG.surface,
    color: RPG.text,
    fontSize: 14,
    padding: 14,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
});
