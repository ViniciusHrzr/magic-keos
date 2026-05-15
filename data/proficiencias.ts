export type InstanciaKey = 'corpo' | 'mente' | 'espirito';

export type PericiaKey =
  | 'artesMarciais'
  | 'atletismo'
  | 'esgrima'
  | 'furtividade'
  | 'pontaria'
  | 'alquimia'
  | 'criatividade'
  | 'investigacao'
  | 'mecanica'
  | 'sobrevivencia'
  | 'comunhao'
  | 'diplomacia'
  | 'expressao'
  | 'intimidacao'
  | 'labia';

export interface PericiaData {
  label: string;
  proficiencias: string[];
}

export type ProficienciasMap = Record<InstanciaKey, Partial<Record<PericiaKey, PericiaData>>>;

export const proficiencias: ProficienciasMap = {
  corpo: {
    artesMarciais: {
      label: 'Artes Marciais',
      proficiencias: ['Derrubar', 'Desarmar', 'Desviar', 'Fintar', 'Imobilizar', 'Aparar (reação lv.2)'],
    },
    atletismo: {
      label: 'Atletismo',
      proficiencias: ['Investida', 'Prontidão', 'Fôlego', 'Disparar (reação lv.1)'],
    },
    esgrima: {
      label: 'Esgrima',
      proficiencias: ['Armas Leves', 'Uma Mão', 'Duas Mãos', 'Especialização', 'Mestria', 'Contra-atacar (reação lv.2)'],
    },
    furtividade: {
      label: 'Furtividade',
      proficiencias: ['Ataque Furtivo', 'Ataque Letal', 'Ataque Silencioso', 'Esquivar (reação lv.1)'],
    },
    pontaria: {
      label: 'Pontaria',
      proficiencias: ['Arcos', 'Arremesso', 'Condutores', 'Especialização', 'Mestria', 'Mirar (reação lv.2)'],
    },
  },
  mente: {
    alquimia: {
      label: 'Alquimia',
      proficiencias: ['Herbologia', 'Mineralogia', 'Zoologia', 'Poções (lv.1)'],
    },
    criatividade: {
      label: 'Criatividade',
      proficiencias: ['Recapitular', 'Reciclar', 'Reforçar', 'Repartir', 'Replicar', 'Solução (lv.1)'],
    },
    investigacao: {
      label: 'Investigação',
      proficiencias: ['Selo de Feitiço', 'Encantamento', 'Invocação', 'Leitura (lv.1)'],
    },
    mecanica: {
      label: 'Mecânica',
      proficiencias: ['Artesão', 'Feiticeiro', 'Ferreiro', 'Artefatos (lv.1)'],
    },
    sobrevivencia: {
      label: 'Sobrevivência',
      proficiencias: ['Acampamento', 'Harmonização', 'Forrageamento', 'Manufaturação', 'Treinamento', 'Coleta (lv.1)'],
    },
  },
  espirito: {
    comunhao: {
      label: 'Comunhão',
      proficiencias: ['Provocar (ação livre lv.3)'],
    },
    diplomacia: {
      label: 'Diplomacia',
      proficiencias: ['Coordenar (ação livre lv.3)'],
    },
    expressao: {
      label: 'Expressão',
      proficiencias: ['Inspirar (ação livre lv.3)'],
    },
    intimidacao: {
      label: 'Intimidação',
      proficiencias: ['Amedrontar (ação livre lv.3)'],
    },
    labia: {
      label: 'Lábia',
      proficiencias: ['Distrair (ação livre lv.3)'],
    },
  },
};

export const periciaOrdem: { instancia: InstanciaKey; periciaKey: PericiaKey }[] = [
  { instancia: 'corpo', periciaKey: 'artesMarciais' },
  { instancia: 'corpo', periciaKey: 'atletismo' },
  { instancia: 'corpo', periciaKey: 'esgrima' },
  { instancia: 'corpo', periciaKey: 'furtividade' },
  { instancia: 'corpo', periciaKey: 'pontaria' },
  { instancia: 'mente', periciaKey: 'alquimia' },
  { instancia: 'mente', periciaKey: 'criatividade' },
  { instancia: 'mente', periciaKey: 'investigacao' },
  { instancia: 'mente', periciaKey: 'mecanica' },
  { instancia: 'mente', periciaKey: 'sobrevivencia' },
  { instancia: 'espirito', periciaKey: 'comunhao' },
  { instancia: 'espirito', periciaKey: 'diplomacia' },
  { instancia: 'espirito', periciaKey: 'expressao' },
  { instancia: 'espirito', periciaKey: 'intimidacao' },
  { instancia: 'espirito', periciaKey: 'labia' },
];
