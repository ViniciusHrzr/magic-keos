import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { proficiencias, periciaOrdem, PericiaKey, InstanciaKey } from '@/data/proficiencias';

interface Props {
  selected: string[];
  onChange: (v: string[]) => void;
}

export default function ProficienciasSection({ selected, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (k: string) =>
    setExpanded(prev => {
      const n = new Set(prev);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  return (
    <>
      <SectionHeader title="Proficiências" />
      <View style={styles.container}>
        {periciaOrdem.map(({ instancia, periciaKey }) => {
          const data = proficiencias[instancia][periciaKey];
          if (!data) return null;

          const isOpen = expanded.has(periciaKey);

          return (
            <View key={periciaKey}>
              <TouchableOpacity
                style={styles.sectionRow}
                onPress={() => toggle(periciaKey)}
                activeOpacity={0.75}
              >
                <Text style={styles.instanceTag}>{instancia.toUpperCase()}</Text>
                <Text style={styles.sectionTitle}>{data.label}</Text>
                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.chipsWrap}>
                  {data.proficiencias.map(profNome => {
                    const key = `${periciaKey}:${profNome}`;
                    const isSelected = selected.includes(key);

                    return (
                      <TouchableOpacity
                        key={key}
                        style={[styles.chip, isSelected && styles.chipActive]}
                        onPress={() =>
                          onChange(
                            isSelected
                              ? selected.filter(k => k !== key)
                              : [...selected, key],
                          )
                        }
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                          {profNome}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: RPG.surface,
    padding: 0,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    backgroundColor: RPG.surface,
  },
  instanceTag: {
    color: RPG.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
    minWidth: 50,
    fontWeight: '600',
  },
  sectionTitle: {
    flex: 1,
    color: RPG.gold,
    fontSize: 13,
    fontWeight: '600',
  },
  chevron: {
    color: RPG.gold,
    fontSize: 11,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 10,
    backgroundColor: RPG.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  chipActive: {
    borderColor: RPG.gold,
    backgroundColor: RPG.goldDim + '33',
  },
  chipText: {
    fontSize: 11,
    color: RPG.textMuted,
  },
  chipTextActive: {
    color: RPG.goldLight,
    fontWeight: '600',
  },
});
