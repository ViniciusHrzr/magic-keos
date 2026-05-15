import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, defaultCharacter, AttrDice, SkillValue } from '@/types/character';

const CHARS_KEY  = '@magic_keos_chars_v2';
const CUR_KEY    = '@magic_keos_current_v2';
const LEGACY_KEY = '@kairos_character_v1';

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function migrate(raw: any): Character {
  const parsed = { ...raw };
  if (parsed.mana) {
    for (const k of ['incolor', 'branco', 'verde', 'vermelho', 'preto', 'azul']) {
      if (typeof parsed.mana[k] === 'number') {
        parsed.mana[k] = { base: 0, total: parsed.mana[k] };
      }
    }
  }
  if (parsed.magicasReceitas !== undefined) {
    parsed.magicas = typeof parsed.magicasReceitas === 'string'
      ? Array(20).fill('') : parsed.magicasReceitas;
    delete parsed.magicasReceitas;
  }
  if (typeof parsed.magicas === 'string') {
    parsed.magicas = Array(20).fill('');
  }
  if (!parsed.notas) parsed.notas = '';
  return { ...defaultCharacter, ...parsed };
}

export interface CharInfo { id: string; name: string }

interface CharacterContextType {
  character: Character;
  isLoaded: boolean;
  setNome: (v: string) => void;
  setSabedoria: (k: 'acumulada' | 'disponivel', v: number) => void;
  setVida: (k: keyof Character['vida'], v: number) => void;
  setMana: (k: keyof Character['mana'], field: 'base' | 'total', v: number) => void;
  setVeneno: (v: number) => void;
  setAfinidade: (k: keyof Character['afinidade'], v: number) => void;
  setInstanceIP: (instance: 'corpo' | 'mente' | 'espirito', field: 'ipBase' | 'ipBonus', v: number) => void;
  setAttrDice: (instance: 'corpo' | 'mente' | 'espirito', attr: string, dice: AttrDice) => void;
  setSkill: (instance: 'corpo' | 'mente' | 'espirito', skill: string, value: SkillValue) => void;
  setProficiencias: (v: string) => void;
  setHabilidades: (v: string) => void;
  setNotas: (v: string) => void;
  setVelocidade: (update: Partial<Character['velocidade']>) => void;
  setMemoria: (update: Partial<Character['memoria']>) => void;
  setCanalizacao: (update: Partial<Character['canalizacao']>) => void;
  setFoco: (update: Partial<Character['foco']>) => void;
  setDominio: (idx: number, v: string) => void;
  setInventario: (v: string) => void;
  setEquipamento: (k: keyof Character['equipamentos'], v: string) => void;
  setMagica: (idx: number, v: string) => void;
  setReceitas: (v: string) => void;
  charList: CharInfo[];
  currentId: string;
  switchTo: (id: string) => void;
  createChar: () => void;
  deleteChar: (id: string) => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [allChars, setAllChars] = useState<Record<string, Character>>({});
  const [currentId, setCurrentId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const charsRaw = await AsyncStorage.getItem(CHARS_KEY);
        const curRaw   = await AsyncStorage.getItem(CUR_KEY);

        if (charsRaw) {
          const parsed: Record<string, any> = JSON.parse(charsRaw);
          const migrated: Record<string, Character> = {};
          for (const [id, c] of Object.entries(parsed)) migrated[id] = migrate(c);
          setAllChars(migrated);
          const ids = Object.keys(migrated);
          const cur = curRaw && migrated[curRaw] ? curRaw : ids[0];
          setCurrentId(cur);
          if (!curRaw || !migrated[curRaw]) await AsyncStorage.setItem(CUR_KEY, cur);
        } else {
          const legacyRaw = await AsyncStorage.getItem(LEGACY_KEY);
          const id = genId();
          const char = legacyRaw ? migrate(JSON.parse(legacyRaw)) : { ...defaultCharacter };
          const chars = { [id]: char };
          setAllChars(chars);
          setCurrentId(id);
          await AsyncStorage.setItem(CHARS_KEY, JSON.stringify(chars));
          await AsyncStorage.setItem(CUR_KEY, id);
          if (legacyRaw) await AsyncStorage.removeItem(LEGACY_KEY);
        }
        setIsLoaded(true);
      } catch {
        const id = genId();
        const chars = { [id]: { ...defaultCharacter } };
        setAllChars(chars);
        setCurrentId(id);
        await AsyncStorage.setItem(CHARS_KEY, JSON.stringify(chars));
        await AsyncStorage.setItem(CUR_KEY, id);
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  const character: Character = allChars[currentId] ?? defaultCharacter;

  const update = useCallback((patch: (prev: Character) => Character) => {
    // Immediate React state update — no debounce on UI
    setAllChars(prev => {
      const cur = prev[currentId] ?? defaultCharacter;
      return { ...prev, [currentId]: patch(cur) };
    });
    // Debounced AsyncStorage write — ~500ms after last call
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAllChars(prev => {
        AsyncStorage.setItem(CHARS_KEY, JSON.stringify(prev))
          .catch(err => console.error('AsyncStorage write failed:', err));
        return prev;
      });
    }, 500);
  }, [currentId]);

  const setNome = useCallback((v: string) => update(p => ({ ...p, nome: v })), [update]);
  const setSabedoria = useCallback((k: 'acumulada' | 'disponivel', v: number) =>
    update(p => ({ ...p, sabedoria: { ...p.sabedoria, [k]: v } })), [update]);
  const setVida = useCallback((k: keyof Character['vida'], v: number) =>
    update(p => ({ ...p, vida: { ...p.vida, [k]: v } })), [update]);
  const setMana = useCallback((k: keyof Character['mana'], field: 'base' | 'total', v: number) =>
    update(p => ({ ...p, mana: { ...p.mana, [k]: { ...p.mana[k], [field]: v } } })), [update]);
  const setVeneno = useCallback((v: number) => update(p => ({ ...p, veneno: Math.max(0, Math.min(10, v)) })), [update]);
  const setAfinidade = useCallback((k: keyof Character['afinidade'], v: number) =>
    update(p => ({ ...p, afinidade: { ...p.afinidade, [k]: Math.max(0, Math.min(100, v)) } })), [update]);
  const setInstanceIP = useCallback((instance: 'corpo' | 'mente' | 'espirito', field: 'ipBase' | 'ipBonus', v: number) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [field]: v } })), [update]);
  const setAttrDice = useCallback((instance: 'corpo' | 'mente' | 'espirito', attr: string, dice: AttrDice) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [attr]: dice } })), [update]);
  const setSkill = useCallback((instance: 'corpo' | 'mente' | 'espirito', skill: string, value: SkillValue) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [skill]: value } })), [update]);
  const setProficiencias = useCallback((v: string) => update(p => ({ ...p, proficiencias: v })), [update]);
  const setHabilidades   = useCallback((v: string) => update(p => ({ ...p, habilidades: v })), [update]);
  const setNotas         = useCallback((v: string) => update(p => ({ ...p, notas: v })), [update]);
  const setVelocidade = useCallback((patch: Partial<Character['velocidade']>) =>
    update(p => ({ ...p, velocidade: { ...p.velocidade, ...patch } })), [update]);
  const setMemoria = useCallback((patch: Partial<Character['memoria']>) =>
    update(p => ({ ...p, memoria: { ...p.memoria, ...patch } })), [update]);
  const setCanalizacao = useCallback((patch: Partial<Character['canalizacao']>) =>
    update(p => ({ ...p, canalizacao: { ...p.canalizacao, ...patch } })), [update]);
  const setFoco = useCallback((patch: Partial<Character['foco']>) =>
    update(p => ({ ...p, foco: { ...p.foco, ...patch } })), [update]);
  const setDominio = useCallback((idx: number, v: string) =>
    update(p => { const d = [...p.dominios]; d[idx] = v; return { ...p, dominios: d }; }), [update]);
  const setInventario = useCallback((v: string) => update(p => ({ ...p, inventario: v })), [update]);
  const setEquipamento = useCallback((k: keyof Character['equipamentos'], v: string) =>
    update(p => ({ ...p, equipamentos: { ...p.equipamentos, [k]: v } })), [update]);
  const setMagica = useCallback((idx: number, v: string) =>
    update(p => { const m = [...p.magicas]; m[idx] = v; return { ...p, magicas: m }; }), [update]);
  const setReceitas = useCallback((v: string) => update(p => ({ ...p, receitas: v })), [update]);

  const charList = useMemo<CharInfo[]>(() =>
    Object.entries(allChars).map(([id, c]) => ({ id, name: c.nome || 'Sem nome' })),
    [allChars],
  );

  const switchTo = useCallback((id: string) => {
    setCurrentId(id);
    AsyncStorage.setItem(CUR_KEY, id)
      .catch(err => console.error('AsyncStorage write failed:', err));
  }, []);

  const createChar = useCallback(() => {
    const id = genId();
    setAllChars(prev => {
      const next = { ...prev, [id]: { ...defaultCharacter } };
      AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next))
        .catch(err => console.error('AsyncStorage write failed:', err));
      return next;
    });
    setCurrentId(id);
    AsyncStorage.setItem(CUR_KEY, id)
      .catch(err => console.error('AsyncStorage write failed:', err));
  }, []);

  const deleteChar = useCallback((id: string) => {
    setAllChars(prev => {
      const next = { ...prev };
      delete next[id];
      let newCur = currentId;
      if (Object.keys(next).length === 0) {
        const newId = genId();
        next[newId] = { ...defaultCharacter };
        newCur = newId;
      } else if (id === currentId) {
        newCur = Object.keys(next)[0];
      }
      if (newCur !== currentId) {
        setCurrentId(newCur);
        AsyncStorage.setItem(CUR_KEY, newCur)
          .catch(err => console.error('AsyncStorage write failed:', err));
      }
      AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next))
        .catch(err => console.error('AsyncStorage write failed:', err));
      return next;
    });
  }, [currentId]);

  const exportJson = useCallback((): string => {
    return JSON.stringify(allChars[currentId] ?? defaultCharacter, null, 2);
  }, [allChars, currentId]);

  const importJson = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== 'object') return false;
      const imported = migrate(parsed);
      const id = genId();
      setAllChars(prev => {
        const next = { ...prev, [id]: imported };
        AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next))
          .catch(err => console.error('AsyncStorage write failed:', err));
        return next;
      });
      setCurrentId(id);
      AsyncStorage.setItem(CUR_KEY, id)
        .catch(err => console.error('AsyncStorage write failed:', err));
      return true;
    } catch {
      return false;
    }
  }, []);

  const contextValue = useMemo(() => ({
    character,
    isLoaded,
    setNome, setSabedoria, setVida, setMana, setVeneno, setAfinidade,
    setInstanceIP, setAttrDice, setSkill,
    setProficiencias, setHabilidades, setNotas,
    setVelocidade, setMemoria, setCanalizacao, setFoco,
    setDominio, setInventario, setEquipamento, setMagica, setReceitas,
    charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson,
  }), [
    character, isLoaded,
    setNome, setSabedoria, setVida, setMana, setVeneno, setAfinidade,
    setInstanceIP, setAttrDice, setSkill,
    setProficiencias, setHabilidades, setNotas,
    setVelocidade, setMemoria, setCanalizacao, setFoco,
    setDominio, setInventario, setEquipamento, setMagica, setReceitas,
    charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson,
  ]);

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be inside CharacterProvider');
  return ctx;
}
