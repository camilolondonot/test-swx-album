const TYPE_LABELS = {
  people: { single: 'personaje', plural: 'personajes' },
  film: { single: 'película', plural: 'películas' },
  starship: { single: 'nave', plural: 'naves' },
}

const createEmptyPackEntry = () => ({
  cards: [],
  description: 'Sin cartas disponibles.',
})

export const createEmptyPacks = () => ({
  basic: createEmptyPackEntry(),
  advanced: createEmptyPackEntry(),
  expert: createEmptyPackEntry(),
})

const pickRandomCards = (source, count = 3) => {
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

export const buildPacks = (data, count = 3) => {
  if (!Array.isArray(data) || data.length === 0) {
    return createEmptyPacks()
  }

  const packEntries = {
    basic: pickRandomCards(data, count),
    advanced: pickRandomCards(data, count),
    expert: pickRandomCards(data, count),
  }

  return Object.fromEntries(
    Object.entries(packEntries).map(([key, cards]) => [
      key,
      {
        cards,
        description: describeCards(cards),
      },
    ]),
  )
}

export default buildPacks

