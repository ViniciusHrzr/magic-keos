// §12 Canalização e Mana

export interface CanalResultadoRow {
  resultado: string
  mana: string
}

export interface AmbienteModRow {
  mod: string
  descricao: string
}

export interface AmbienteRow {
  ambiente: string
  modificadores: string
}

export interface EventoClimaticoRow {
  evento: string
  modificadores: string
}

export const canalizacaoResultados: CanalResultadoRow[] = [
  { resultado: '10+', mana: '1d4 de mana colorido' },
  { resultado: '15+', mana: '1d6' },
  { resultado: '20+', mana: '1d8' },
  { resultado: '25+', mana: '1d10' },
  { resultado: '30+', mana: '1d12' },
]

export const modificadoresAmbiente: AmbienteModRow[] = [
  { mod: '++', descricao: '3 dados, fica maior — muito abundante' },
  { mod: '+', descricao: '2 dados, fica maior — abundante' },
  { mod: '0', descricao: 'Normal' },
  { mod: '–', descricao: '2 dados, fica menor — escasso' },
  { mod: '––', descricao: '3 dados, fica menor — muito escasso' },
]

export const ambientes: AmbienteRow[] = [
  { ambiente: 'Deserto', modificadores: '–– · –– · –– · –– · ––' },
  { ambiente: 'Urbano', modificadores: '+ · – · – · + · –' },
  { ambiente: 'Natureza', modificadores: '– · + · + · – · +' },
  { ambiente: 'Fortaleza', modificadores: '+ · – · — · — · —' },
  { ambiente: 'Planícies', modificadores: '++ · + · – · – · —' },
  { ambiente: 'Floresta', modificadores: '— · + · — · — · —' },
  { ambiente: 'Selva densa', modificadores: '– · ++ · + · — · –' },
  { ambiente: 'Rochoso', modificadores: '— · — · + · — · –' },
  { ambiente: 'Vulcões', modificadores: '– · — · ++ · + · –' },
  { ambiente: 'Catacumbas', modificadores: '– · – · — · + · —' },
  { ambiente: 'Pântanos', modificadores: '– · – · — · ++ · +' },
  { ambiente: 'Fonte de água', modificadores: '— · — · – · — · +' },
  { ambiente: 'Alto mar', modificadores: '+ · – · – · — · ++' },
]

export const eventosClimaticos: EventoClimaticoRow[] = [
  { evento: 'Frio', modificadores: '— · — · – · — · +' },
  { evento: 'Calor', modificadores: '— · — · + · — · –' },
  { evento: 'Ventos fortes', modificadores: '— · – · – · — · +' },
  { evento: 'Chuva intensa', modificadores: '— · + · – · — · +' },
  { evento: 'Nevasca', modificadores: '– · –– · –– · – · ++' },
  { evento: 'Tempestade', modificadores: '– · –– · ++ · – · +' },
  { evento: 'Dia', modificadores: '— · — · — · – · —' },
  { evento: 'Sol a pino', modificadores: '+ · — · — · –– · —' },
  { evento: 'Noite', modificadores: '– · — · — · — · —' },
  { evento: 'Lua cheia', modificadores: '–– · — · — · + · —' },
  { evento: 'Eclipse solar', modificadores: '++ · — · – · ++ · –' },
]
