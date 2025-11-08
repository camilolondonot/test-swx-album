import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createEmptyPacks, createPackEntry } from '@/utils/packs'
import { PACK_CONFIGURATIONS } from '@/constants/packs'
import { getResourceByUrl } from '@/Services/Api'
import { getResourceUniqueKey } from '@/utils/cards'

const storageFallback = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

const getStorage = () => (typeof window !== 'undefined' ? window.localStorage : storageFallback)

const initialState = {
  completedData: [],
  packs: createEmptyPacks(),
  albumUser: [],
  cooldownEndsAt: null,
}

const pickRandomConfiguration = () => {
  const index = Math.floor(Math.random() * PACK_CONFIGURATIONS.length)
  return PACK_CONFIGURATIONS[index]
}

const sampleResourcesForComposition = (completedData, composition) => {
  const selected = []
  const usedKeys = new Set()

  Object.entries(composition).forEach(([type, count]) => {
    if (count <= 0) return
    const pool = completedData.filter((item) => item.type === type)
    const available = pool.filter((item) => {
      const key = getResourceUniqueKey(type, item.data)
      return key && !usedKeys.has(key)
    })

    const mutablePool = [...available]
    for (let i = 0; i < count && mutablePool.length > 0; i += 1) {
      const index = Math.floor(Math.random() * mutablePool.length)
      const resource = mutablePool.splice(index, 1)[0]
      const key = getResourceUniqueKey(type, resource.data)
      if (!key) continue
      usedKeys.add(key)
      selected.push({ type, data: resource.data })
    }
  })

  return selected
}

export const useStoreData = create(persist(
  (set, get) => ({
    ...initialState,

    setCompletedData: (completedData) => {
      set({
        completedData,
        packs: createEmptyPacks(),
      })
    },

    addCardToAlbum: (card) => set((state) => {
      if (!card?.uniqueKey) {
        return state
      }

      const alreadyExists = state.albumUser.some((item) => item.uniqueKey === card.uniqueKey)
      if (alreadyExists) {
        return state
      }

      return {
        albumUser: [...state.albumUser, card],
      }
    }),

    setAlbumUser: (albumUser) => set({ albumUser }),

    assignCardStatus: (tier, cardId, status) => set((state) => {
      if (!tier || !cardId) {
        return state
      }

      const pack = state.packs[tier]
      if (!pack) {
        return state
      }

      const updatedCards = pack.cards.map((card) => (card.id === cardId
        ? { ...card, status }
        : card))

      const updatedPack = {
        ...pack,
        cards: updatedCards,
      }

      const selectedCard = updatedCards.find((card) => card.id === cardId)
      const shouldAddToAlbum = status === 'added' && selectedCard
      const albumAlreadyContains = shouldAddToAlbum && selectedCard?.uniqueKey
        ? state.albumUser.some((card) => card.uniqueKey === selectedCard.uniqueKey)
        : false

      const updatedAlbum = shouldAddToAlbum && selectedCard?.uniqueKey && !albumAlreadyContains
        ? [...state.albumUser, selectedCard]
        : state.albumUser

      return {
        packs: {
          ...state.packs,
          [tier]: updatedPack,
        },
        albumUser: updatedAlbum,
      }
    }),

    openPack: async (tier) => {
      const state = get()
      if (!tier) throw new Error('Tier no válido')
      if (!Array.isArray(state.completedData) || state.completedData.length === 0) {
        throw new Error('No hay datos disponibles para generar cartas.')
      }

      const configuration = pickRandomConfiguration()
      const resources = sampleResourcesForComposition(state.completedData, configuration.composition)

      if (resources.length === 0) {
        throw new Error('No fue posible generar cartas para este sobre.')
      }

      const fetchedResources = await Promise.all(resources.map(async (resource) => {
        try {
          const data = await getResourceByUrl(resource.data?.url)
          return {
            type: resource.type,
            data: data ?? resource.data,
          }
        } catch (error) {
          console.error('No se pudo obtener el recurso', error)
          return resource
        }
      }))

      const packEntry = createPackEntry(tier, fetchedResources, {
        configurationId: configuration.id,
        composition: configuration.composition,
        compositionLabel: configuration.label,
      })

      set((current) => ({
        packs: {
          ...current.packs,
          [tier]: packEntry,
        },
      }))

      return packEntry
    },

    startCooldown: (durationMs = 60_000) => {
      const endsAt = Date.now() + durationMs
      set({ cooldownEndsAt: endsAt })
      return endsAt
    },

    setCooldownEndsAt: (timestamp) => set({ cooldownEndsAt: timestamp }),

    clearCooldown: () => set({ cooldownEndsAt: null }),

    resetStore: () => set({ ...initialState }),
  }),
  {
    name: 'album-swx-store',
    storage: createJSONStorage(getStorage),
    partialize: (state) => ({
      albumUser: state.albumUser,
      cooldownEndsAt: state.cooldownEndsAt,
    }),
  },
))
