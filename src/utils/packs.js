import { PACK_TIERS } from '@/constants/packs'
import { getAlbumSectionMeta, getResourceId, getResourceUniqueKey, isSpecialCard } from './cards'

const TYPE_LABELS = {
  people: { single: 'personaje', plural: 'personajes' },
  film: { single: 'película', plural: 'películas' },
  starship: { single: 'nave', plural: 'naves' },
}

const createEmptyPackEntry = () => ({
  cards: [],
  description: 'Aún no has abierto este sobre.',
  composition: null,
  compositionLabel: null,
  configurationId: null,
})

export const createEmptyPacks = () => PACK_TIERS.reduce((acc, key) => {
  acc[key] = createEmptyPackEntry()
  return acc
}, {})

const describeComposition = (composition) => {
  if (!composition) return 'Genera láminas aleatorias.'
  const parts = Object.entries(composition)
    .filter(([, value]) => value > 0)
    .map(([type, count]) => {
      const labels = TYPE_LABELS[type] ?? { single: type, plural: `${type}s` }
      const label = count === 1 ? labels.single : labels.plural
      return `${count} ${label}`
    })
  return parts.join(', ')
}

const normalizeCardsForTier = (tier, cards) =>
  cards.map((card) => {
    const resourceId = getResourceId(card.type, card.data)
    const sectionMeta = getAlbumSectionMeta(card.type)
    return {
      id: `${tier}-${card.type}-${resourceId ?? Math.random().toString(36).slice(2, 8)}`,
      uniqueKey: getResourceUniqueKey(card.type, card.data),
      resourceId,
      tier,
      type: card.type,
      data: card.data,
      status: 'pending',
      isSpecial: isSpecialCard(card.type, resourceId),
      section: sectionMeta.title,
    }
  })

const getCompositionFromCards = (cards) => cards.reduce((acc, card) => {
  acc[card.type] = (acc[card.type] ?? 0) + 1
  return acc
}, {})

export const createPackEntry = (tier, resources, options = {}) => {
  const normalizedCards = normalizeCardsForTier(tier, resources)
  const composition = options.composition ?? getCompositionFromCards(normalizedCards)
  const compositionLabel = options.compositionLabel ?? describeComposition(composition)

  return {
    cards: normalizedCards,
    description: compositionLabel,
    composition,
    compositionLabel,
    configurationId: options.configurationId ?? null,
  }
}

