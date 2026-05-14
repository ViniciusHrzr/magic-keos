import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  return { ...defaultCharacter, ...parsed };
}

export interface CharInfo { id: string; name: string }

interface CharacterContextType {
  character: Character;
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
      } catch {
        const id = genId();
        const chars = { [id]: { ...defaultCharacter } };
        setAllChars(chars);
        setCurrentId(id);
        await AsyncStorage.setItem(CHARS_KEY, JSON.stringify(chars));
        await AsyncStorage.setItem(CUR_KEY, id);
      }
    };
    load();
  }, []);

  const character: Character = allChars[currentId] ?? defaultCharacter;

  const update = useCallback((patch: (prev: Character) => Character) => {
    setAllChars(prev => {
      const cur = prev[currentId] ?? defaultCharacter;
      const next = { ...prev, [currentId]: patch(cur) };
      AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next));
      return next;
    });
  }, [currentId]);

  const setNome = (v: string) => update(p => ({ ...p, nome: v }));
  const setSabedoria = (k: 'acumulada' | 'disponivel', v: number) =>
    update(p => ({ ...p, sabedoria: { ...p.sabedoria, [k]: v } }));
  const setVida = (k: keyof Character['vida'], v: number) =>
    update(p => ({ ...p, vida: { ...p.vida, [k]: v } }));
  const setMana = (k: keyof Character['mana'], field: 'base' | 'total', v: number) =>
    update(p => ({ ...p, mana: { ...p.mana, [k]: { ...p.mana[k], [field]: v } } }));
  const setVeneno = (v: number) => update(p => ({ ...p, veneno: Math.max(0, Math.min(10, v)) }));
  const setAfinidade = (k: keyof Character['afinidade'], v: number) =>
    update(p => ({ ...p, afinidade: { ...p.afinidade, [k]: Math.max(0, Math.min(100, v)) } }));
  const setInstanceIP = (instance: 'corpo' | 'mente' | 'espirito', field: 'ipBase' | 'ipBonus', v: number) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [field]: v } }));
  const setAttrDice = (instance: 'corpo' | 'mente' | 'espirito', attr: string, dice: AttrDice) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [attr]: dice } }));
  const setSkill = (instance: 'corpo' | 'mente' | 'espirito', skill: string, value: SkillValue) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [skill]: value } }));
  const setProficiencias = (v: string) => update(p => ({ ...p, proficiencias: v }));
  const setHabilidades   = (v: string) => update(p => ({ ...p, habilidades: v }));
  const setVelocidade = (patch: Partial<Character['velocidade']>) =>
    update(p => ({ ...p, velocidade: { ...p.velocidade, ...patch } }));
  const setMemoria = (patch: Partial<Character['memoria']>) =>
    update(p => ({ ...p, memoria: { ...p.memoria, ...patch } }));
  const setCanalizacao = (patch: Partial<Character['canalizacao']>) =>
    update(p => ({ ...p, canalizacao: { ...p.canalizacao, ...patch } }));
  const setFoco = (patch: Partial<Character['foco']>) =>
    update(p => ({ ...p, foco: { ...p.foco, ...patch } }));
  const setDominio = (idx: number, v: string) =>
    update(p => { const d = [...p.dominios]; d[idx] = v; return { ...p, dominios: d }; });
  const setInventario = (v: string) => update(p => ({ ...p, inventario: v }));
  const setEquipamento = (k: keyof Character['equipamentos'], v: string) =>
    update(p => ({ ...p, equipamentos: { ...p.equipamentos, [k]: v } }));
  const setMagica = (idx: number, v: string) =>
    update(p => { const m = [...p.magicas]; m[idx] = v; return { ...p, magicas: m }; });
  const setReceitas = (v: string) => update(p => ({ ...p, receitas: v }));

  const charList = useMemo<CharInfo[]>(() =>
    Object.entries(allChars).map(([id, c]) => ({ id, name: c.nome || 'Sem nome' })),
    [allChars],
  );

  const switchTo = useCallback((id: string) => {
    setCurrentId(id);
    AsyncStorage.setItem(CUR_KEY, id);
  }, []);

  const createChar = useCallback(() => {
    const id = genId();
    setAllChars(prev => {
      const next = { ...prev, [id]: { ...defaultCharacter } };
      AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next));
      return next;
    });
    setCurrentId(id);
    AsyncStorage.setItem(CUR_KEY, id);
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
        AsyncStorage.setItem(CUR_KEY, newCur);
      }
      AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next));
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
        AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next));
        return next;
      });
      setCurrentId(id);
      AsyncStorage.setItem(CUR_KEY, id);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <CharacterContext.Provider value={{
      character,
      setNome, setSabedoria, setVida, setMana, setVeneno, setAfinidade,
      setInstanceIP, setAttrDice, setSkill,
      setProficiencias, setHabilidades,
      setVelocidade, setMemoria, setCanalizacao, setFoco,
      setDominio, setInventario, setEquipamento, setMagica, setReceitas,
      charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be inside CharacterProvider');
  return ctx;
}
