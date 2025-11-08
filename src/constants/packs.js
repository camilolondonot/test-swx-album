export const PACK_TIERS = ['basic', 'advanced', 'expert', 'legendary']

export const TIER_LABELS = {
  basic: 'básico',
  advanced: 'avanzado',
  expert: 'experto',
  legendary: 'legendario',
}

export const PACK_CONFIGURATIONS = [
  {
    id: 'balanced',
    label: '1 película, 3 personajes, 1 nave',
    composition: {
      film: 1,
      people: 3,
      starship: 1,
    },
  },
  {
    id: 'crew',
    label: '3 personajes, 2 naves',
    composition: {
      film: 0,
      people: 3,
      starship: 2,
    },
  },
]


