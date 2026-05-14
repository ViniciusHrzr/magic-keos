import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Share, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CharacterManager({ visible, onClose }: Props) {
  const { charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson } = useCharacter();
  const insets = useSafeAreaInsets();
  const [importing, setImporting] = useState(false);
  const [importText, setImportText] = useState('');

  const handleExport = async () => {
    const json = exportJson();
    await Share.share({ message: json, title: 'Exportar ficha' });
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importJson(importText.trim());
    if (ok) {
      setImportText('');
      setImporting(false);
      onClose();
    } else {
      Alert.alert('Erro', 'JSON inválido. Verifique o texto e tente novamente.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Excluir ficha',
      `Excluir "${name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteChar(id) },
      ],
    );
  };

  const handleSwitch = (id: string) => {
    switchTo(id);
    onClose();
  };

  const handleCreate = () => {
    createChar();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.bg} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.card, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Fichas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {importing ? (
            <View style={styles.importPanel}>
              <Text style={styles.importLabel}>Cole o JSON da ficha abaixo:</Text>
              <TextInput
                style={styles.importInput}
                value={importText}
                onChangeText={setImportText}
                multiline
                placeholder='{"nome": "...", ...}'
                placeholderTextColor={RPG.textDark}
                textAlignVertical="top"
              />
              <View style={styles.importActions}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => { setImporting(false); setImportText(''); }}>
                  <Text style={styles.btnSecondaryText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleImport}>
                  <Text style={styles.btnPrimaryText}>Importar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <ScrollView style={styles.list} contentContainerStyle={{ gap: 6, padding: 12 }}>
                {charList.map(({ id, name }) => (
                  <View key={id} style={[styles.charRow, id === currentId && styles.charRowActive]}>
                    <TouchableOpacity style={styles.charName} onPress={() => handleSwitch(id)} activeOpacity={0.7}>
                      {id === currentId && <Text style={styles.activeIndicator}>▶ </Text>}
                      <Text style={[styles.charNameText, id === currentId && styles.charNameActive]} numberOfLines={1}>
                        {name}
                      </Text>
                    </TouchableOpacity>
                    {charList.length > 1 && (
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(id, name)} activeOpacity={0.7}>
                        <Text style={styles.deleteBtnText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleCreate}>
                  <Text style={styles.actionBtnText}>+ Nova Ficha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={handleExport}>
                  <Text style={styles.actionBtnText}>↗ Exportar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setImporting(true)}>
                  <Text style={styles.actionBtnText}>↙ Importar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: RPG.surface,
    borderTopWidth: 2,
    borderTopColor: RPG.gold,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  title: {
    flex: 1,
    color: RPG.gold,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  closeBtn: { padding: 4 },
  closeBtnText: { color: RPG.textMuted, fontSize: 18 },

  list: { flexShrink: 1 },
  charRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RPG.border,
    backgroundColor: RPG.surfaceAlt,
    borderRadius: 4,
  },
  charRowActive: {
    borderColor: RPG.gold,
  },
  charName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  activeIndicator: {
    color: RPG.gold,
    fontSize: 12,
  },
  charNameText: {
    color: RPG.text,
    fontSize: 14,
    flex: 1,
  },
  charNameActive: {
    color: RPG.gold,
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  deleteBtnText: {
    color: RPG.textDark,
    fontSize: 14,
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: RPG.border,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: RPG.gold,
    borderRadius: 4,
  },
  actionBtnText: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  importPanel: {
    padding: 12,
    paddingBottom: 16,
    gap: 10,
  },
  importLabel: {
    color: RPG.textMuted,
    fontSize: 13,
  },
  importInput: {
    backgroundColor: RPG.surfaceAlt,
    color: RPG.text,
    fontSize: 12,
    padding: 10,
    height: 200,
    borderWidth: 1,
    borderColor: RPG.border,
  },
  importActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnSecondary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 4,
  },
  btnSecondaryText: {
    color: RPG.textMuted,
    fontSize: 13,
  },
  btnPrimary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: RPG.gold,
    backgroundColor: RPG.gold + '22',
    borderRadius: 4,
  },
  btnPrimaryText: {
    color: RPG.gold,
    fontSize: 13,
    fontWeight: '700',
  },
});
