import React, { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { RPG } from '@/constants/theme';

const FRAME_HEIGHT = 80;
const CHAMFER = 12;

// Guard: SkiaApi global may be undefined in Expo Go if JSI not initialized.
// Check once at module load — avoids crash inside render.
const skiaAvailable = Skia != null && typeof (Skia as any).Path?.Make === 'function';

function makeChamferPath(w: number, h: number, c: number) {
  const path = Skia.Path.Make();
  path.moveTo(c, 0);
  path.lineTo(w - c, 0);
  path.lineTo(w, c);
  path.lineTo(w, h - c);
  path.lineTo(w - c, h);
  path.lineTo(c, h);
  path.lineTo(0, h - c);
  path.lineTo(0, c);
  path.close();
  return path;
}

export interface LegendaryFrameProps {
  nome: string;
  onNomeChange: (v: string) => void;
  sabedoriaAcumulada: number;
  sabedoriaDisponivel: number;
  onFichasPress: () => void;
  width: number;
}

function LegendaryFrame({ nome, onNomeChange, sabedoriaAcumulada, sabedoriaDisponivel, onFichasPress, width }: LegendaryFrameProps) {
  const chamferPath = useMemo(() => {
    if (!skiaAvailable || width <= 0) return null;
    try {
      return makeChamferPath(width, FRAME_HEIGHT, CHAMFER);
    } catch {
      return null;
    }
  }, [width]);

  const overlay = (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <View style={styles.titleRow}>
        <Text style={styles.gameTitle}>Magic Kéos</Text>
        <TouchableOpacity onPress={onFichasPress} style={styles.fichasBtn} activeOpacity={0.7}>
          <Text style={styles.fichasBtnText}>Fichas</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.nameInput}
        value={nome}
        onChangeText={onNomeChange}
        placeholder="Nome do personagem"
        placeholderTextColor={RPG.textDark}
      />
      <Text style={styles.sabedoriaText}>{`SAB: ${sabedoriaAcumulada}/${sabedoriaDisponivel}`}</Text>
    </View>
  );

  if (skiaAvailable && chamferPath) {
    return (
      <View style={{ height: FRAME_HEIGHT, position: 'relative' }}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Path path={chamferPath} color={RPG.headerBg} style="fill" />
          <Path path={chamferPath} color={RPG.gold} style="stroke" strokeWidth={2} />
        </Canvas>
        {overlay}
      </View>
    );
  }

  // Fallback: pure RN header (no chamfer, but functional)
  return (
    <View style={styles.rnFallback}>
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  rnFallback: { height: FRAME_HEIGHT, backgroundColor: RPG.headerBg, borderWidth: 2, borderColor: RPG.gold, position: 'relative' },
  overlay: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, gap: 4 },
  titleRow: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  gameTitle: { textAlign: 'center', color: RPG.gold, fontSize: 20, fontFamily: 'serif', fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase' },
  fichasBtn: { position: 'absolute', right: 0, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: RPG.gold, borderRadius: 4 },
  fichasBtnText: { color: RPG.gold, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  nameInput: { color: RPG.text, fontSize: 16, borderBottomWidth: 1, borderBottomColor: RPG.borderLight, paddingVertical: 4, paddingHorizontal: 8, minWidth: 200, textAlign: 'center', fontFamily: 'serif', fontStyle: 'italic' },
  sabedoriaText: { color: RPG.textMuted, fontSize: 11, letterSpacing: 0.5 },
});

export default React.memo(LegendaryFrame);
