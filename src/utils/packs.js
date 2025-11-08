import { getResourceId, getResourceUniqueKey } from './cards'

const TYPE_LABELS = {
  people: { single: 'personaje', plural: 'personajes' },
  film: { single: 'película', plural: 'películas' },
  starship: { single: 'nave', plural: 'naves' },
}

const PACK_KEYS = ['basic', 'advanced', 'expert']
const DEFAULT_PACK_COUNT = 5

const createEmptyPackEntry = () => ({
  cards: [],
  description: 'Sin cartas disponibles.',
})

export const createEmptyPacks = () => PACK_KEYS.reduce((acc, key) => {
  acc[key] = createEmptyPackEntry()
  return acc
}, {})

const pickRandomCards = (source, count = DEFAULT_PACK_COUNT) => {
  if (!Array.isArray(source) || source.length === 0) {
    return []
  }

  const pool = [...source]
  const result = []

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const index = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(index, 1)[0])
  }

  return result
}

const buildCardId = (tier, card) => {
  const base =
    card?.data?.url ??
    card?.data?.name ??
    card?.data?.title ??
    Math.random().toString(36).slice(2, 8)

  return `${tier}-${card?.type ?? 'unknown'}-${base}-${Math.random().toString(36).slice(2, 6)}`
}

const normalizeCardsForTier = (tier, cards) =>
  cards.map((card) => {
    const resourceId = getResourceId(card.type, card.data)
    return {
      id: buildCardId(tier, card),
      uniqueKey: getResourceUniqueKey(card.type, card.data),
      resourceId,
      tier,
      type: card.type,
      data: card.data,
      status: 'pending',
    }
  })

const describeCards = (cards) => {
  if (!cards.length) {
    return 'Sin cartas disponibles.'
  }

  const counts = cards.reduce((acc, card) => {
    const key = card?.type
    if (!key) return acc
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  const parts = Object.entries(counts).map(([type, count]) => {
    const labels = TYPE_LABELS[type] ?? { single: type, plural: `${type}s` }
    const label = count === 1 ? labels.single : labels.plural
    return `${count} ${label}`
  })

  return parts.join(', ')
}

export const buildPacks = (data, count = DEFAULT_PACK_COUNT) => {
  if (!Array.isArray(data) || data.length === 0) {
    return createEmptyPacks()
  }

  const randomizedPool = pickRandomCards(data, data.length)

  const packEntries = PACK_KEYS.reduce((acc, tier) => {
    const picked = randomizedPool.splice(0, count)
    const needsMore = picked.length < count

    const completedPick = needsMore
      ? [
        ...picked,
        ...pickRandomCards(data, count - picked.length),
      ]
      : picked

    const normalized = normalizeCardsForTier(tier, completedPick)
    acc[tier] = {
      cards: normalized,
      description: describeCards(normalized),
    }
    return acc
  }, {})

  return packEntries
}

export default buildPacks

