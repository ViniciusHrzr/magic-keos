// §11 Domínios (45 domínios, 5 cores)

export interface DominioRow {
  dominio: string
  instancia: string
  atributo: string
  pericia: string
}

export const dominiosBranco: DominioRow[] = [
  { dominio: 'Alçada da Honra', instancia: 'CORPO', atributo: 'FOR', pericia: 'AM' },
  { dominio: 'Alçada da Justiça', instancia: 'CORPO', atributo: 'REF', pericia: 'Esg' },
  { dominio: 'Alçada da Autoridade', instancia: 'CORPO', atributo: 'VIG', pericia: 'Esg' },
  { dominio: 'Alçada do Armamento', instancia: 'MENTE', atributo: 'RAZ', pericia: 'Mec' },
  { dominio: 'Alçada da Proteção', instancia: 'MENTE', atributo: 'SEN', pericia: 'Dip' },
  { dominio: 'Alçada da União', instancia: 'MENTE', atributo: 'CON', pericia: 'Exp' },
  { dominio: 'Alçada da Bondade', instancia: 'ESPÍRITO', atributo: 'PRE', pericia: 'Alq' },
  { dominio: 'Alçada da Devoção', instancia: 'ESPÍRITO', atributo: 'INT', pericia: 'Dip' },
  { dominio: 'Alçada da Luz', instancia: 'ESPÍRITO', atributo: 'VON', pericia: 'Dip' },
]

export const dominiosVerde: DominioRow[] = [
  { dominio: 'Trilha do Instinto', instancia: 'CORPO', atributo: 'FOR', pericia: 'AM' },
  { dominio: 'Trilha da Predação', instancia: 'CORPO', atributo: 'REF', pericia: 'Pont' },
  { dominio: 'Trilha da Adaptação', instancia: 'CORPO', atributo: 'VIG', pericia: 'Atl' },
  { dominio: 'Trilha da Subsistência', instancia: 'MENTE', atributo: 'RAZ', pericia: 'Alq' },
  { dominio: 'Trilha do Ambiente', instancia: 'MENTE', atributo: 'SEN', pericia: 'Sob' },
  { dominio: 'Trilha da Vitalidade', instancia: 'MENTE', atributo: 'CON', pericia: 'Atl' },
  { dominio: 'Trilha dos Animais', instancia: 'ESPÍRITO', atributo: 'PRE', pericia: 'Com' },
  { dominio: 'Trilha da Comunhão', instancia: 'ESPÍRITO', atributo: 'INT', pericia: 'Com' },
  { dominio: 'Trilha da Vegetação', instancia: 'ESPÍRITO', atributo: 'VON', pericia: 'Com' },
]

export const dominiosVermelho: DominioRow[] = [
  { dominio: 'Desígnio da Ira', instancia: 'CORPO', atributo: 'FOR', pericia: 'Exp' },
  { dominio: 'Desígnio da Agilidade', instancia: 'CORPO', atributo: 'REF', pericia: 'Atl' },
  { dominio: 'Desígnio da Terra', instancia: 'CORPO', atributo: 'VIG', pericia: 'AM' },
  { dominio: 'Desígnio da Maldade', instancia: 'MENTE', atributo: 'RAZ', pericia: 'Láb' },
  { dominio: 'Desígnio do Raio', instancia: 'MENTE', atributo: 'SEN', pericia: 'Cri' },
  { dominio: 'Desígnio dos Ritos Primais', instancia: 'MENTE', atributo: 'CON', pericia: 'Inv' },
  { dominio: 'Desígnio da Guerra', instancia: 'ESPÍRITO', atributo: 'PRE', pericia: 'Exp' },
  { dominio: 'Desígnio do Caos', instancia: 'ESPÍRITO', atributo: 'INT', pericia: 'Cri' },
  { dominio: 'Desígnio do Fogo', instancia: 'ESPÍRITO', atributo: 'VON', pericia: 'Pont' },
]

export const dominiosPreto: DominioRow[] = [
  { dominio: 'Arte da Dor', instancia: 'CORPO', atributo: 'FOR', pericia: 'Esg' },
  { dominio: 'Arte das Sombras', instancia: 'CORPO', atributo: 'REF', pericia: 'Furt' },
  { dominio: 'Arte do Sangue', instancia: 'CORPO', atributo: 'VIG', pericia: 'Inv' },
  { dominio: 'Arte da Bruxaria', instancia: 'MENTE', atributo: 'RAZ', pericia: 'Alq' },
  { dominio: 'Arte da Putrefação', instancia: 'MENTE', atributo: 'SEN', pericia: 'Sob' },
  { dominio: 'Arte do Distúrbio', instancia: 'MENTE', atributo: 'CON', pericia: 'Láb' },
  { dominio: 'Arte da Corrupção', instancia: 'ESPÍRITO', atributo: 'PRE', pericia: 'Int' },
  { dominio: 'Arte da Necromancia', instancia: 'ESPÍRITO', atributo: 'INT', pericia: 'Int' },
  { dominio: 'Arte da Danação', instancia: 'ESPÍRITO', atributo: 'VON', pericia: 'Furt' },
]

export const dominiosAzul: DominioRow[] = [
  { dominio: 'Ramo da Água', instancia: 'CORPO', atributo: 'FOR', pericia: 'AM' },
  { dominio: 'Ramo do Ar', instancia: 'CORPO', atributo: 'REF', pericia: 'Pont' },
  { dominio: 'Ramo da Transmutação', instancia: 'CORPO', atributo: 'VIG', pericia: 'Furt' },
  { dominio: 'Ramo do Conhecimento', instancia: 'MENTE', atributo: 'RAZ', pericia: 'Mec' },
  { dominio: 'Ramo do Espaço-Tempo', instancia: 'MENTE', atributo: 'SEN', pericia: 'Mec' },
  { dominio: 'Ramo da Mente', instancia: 'MENTE', atributo: 'CON', pericia: 'Inv' },
  { dominio: 'Ramo da Ilusão', instancia: 'ESPÍRITO', atributo: 'PRE', pericia: 'Láb' },
  { dominio: 'Ramo do Éter', instancia: 'ESPÍRITO', atributo: 'INT', pericia: 'Exp' },
  { dominio: 'Ramo da Contramágica', instancia: 'ESPÍRITO', atributo: 'VON', pericia: 'Cri' },
]
