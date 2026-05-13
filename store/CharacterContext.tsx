import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, defaultCharacter, AttrDice, SkillValue, DieColor } from '@/types/character';

const STORAGE_KEY = '@kairos_character_v1';

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
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character>(defaultCharacter);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.mana) {
            for (const k of ['incolor', 'branco', 'verde', 'vermelho', 'preto', 'azul']) {
              if (typeof parsed.mana[k] === 'number') {
                parsed.mana[k] = { base: 0, total: parsed.mana[k] };
              }
            }
          }
          if (parsed.magicasReceitas !== undefined) {
            parsed.magicas = typeof parsed.magicasReceitas === 'string'
              ? Array(20).fill('')
              : parsed.magicasReceitas;
            delete parsed.magicasReceitas;
          }
          if (typeof parsed.magicas === 'string') {
            parsed.magicas = Array(20).fill('');
          }
          setCharacter({ ...defaultCharacter, ...parsed });
        } catch {}
      }
    });
  }, []);

  const save = useCallback((next: Character) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const update = useCallback((patch: (prev: Character) => Character) => {
    setCharacter(prev => {
      const next = patch(prev);
      save(next);
      return next;
    });
  }, [save]);

  const setNome = (v: string) => update(p => ({ ...p, nome: v }));
  const setSabedoria = (k: 'acumulada' | 'disponivel', v: number) =>
    update(p => ({ ...p, sabedoria: { ...p.sabedoria, [k]: v } }));
  const setVida = (k: keyof Character['vida'], v: number) =>
    update(p => ({ ...p, vida: { ...p.vida, [k]: v } }));
  const setMana = (k: keyof Character['mana'], field: 'base' | 'total', v: number) =>
    update(p => ({ ...p, mana: { ...p.mana, [k]: { ...p.mana[k], [field]: v } } }));
  const setVeneno = (v: number) => update(p => ({ ...p, veneno: Math.max(0, Math.min(8, v)) }));
  const setAfinidade = (k: keyof Character['afinidade'], v: number) =>
    update(p => ({ ...p, afinidade: { ...p.afinidade, [k]: Math.max(0, Math.min(100, v)) } }));

  const setInstanceIP = (instance: 'corpo' | 'mente' | 'espirito', field: 'ipBase' | 'ipBonus', v: number) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [field]: v } }));

  const setAttrDice = (instance: 'corpo' | 'mente' | 'espirito', attr: string, dice: AttrDice) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [attr]: dice } }));

  const setSkill = (instance: 'corpo' | 'mente' | 'espirito', skill: string, value: SkillValue) =>
    update(p => ({ ...p, [instance]: { ...p[instance], [skill]: value } }));

  const setProficiencias = (v: string) => update(p => ({ ...p, proficiencias: v }));
  const setHabilidades = (v: string) => update(p => ({ ...p, habilidades: v }));

  const setVelocidade = (patch: Partial<Character['velocidade']>) =>
    update(p => ({ ...p, velocidade: { ...p.velocidade, ...patch } }));
  const setMemoria = (patch: Partial<Character['memoria']>) =>
    update(p => ({ ...p, memoria: { ...p.memoria, ...patch } }));
  const setCanalizacao = (patch: Partial<Character['canalizacao']>) =>
    update(p => ({ ...p, canalizacao: { ...p.canalizacao, ...patch } }));
  const setFoco = (patch: Partial<Character['foco']>) =>
    update(p => ({ ...p, foco: { ...p.foco, ...patch } }));

  const setDominio = (idx: number, v: string) =>
    update(p => {
      const d = [...p.dominios];
      d[idx] = v;
      return { ...p, dominios: d };
    });

  const setInventario = (v: string) => update(p => ({ ...p, inventario: v }));
  const setEquipamento = (k: keyof Character['equipamentos'], v: string) =>
    update(p => ({ ...p, equipamentos: { ...p.equipamentos, [k]: v } }));
  const setMagica = (idx: number, v: string) =>
    update(p => {
      const entries = [...p.magicas];
      entries[idx] = v;
      return { ...p, magicas: entries };
    });
  const setReceitas = (v: string) => update(p => ({ ...p, receitas: v }));

  // Always render the Provider — with defaults while AsyncStorage is loading,
  // then with persisted data once loaded. Never returns null.
  return (
    <CharacterContext.Provider value={{
      character, setNome, setSabedoria, setVida, setMana, setVeneno, setAfinidade,
      setInstanceIP, setAttrDice, setSkill,
      setProficiencias, setHabilidades, setVelocidade, setMemoria, setCanalizacao,
      setFoco, setDominio, setInventario, setEquipamento, setMagica, setReceitas,
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
