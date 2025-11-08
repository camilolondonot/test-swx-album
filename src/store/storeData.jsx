import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { buildPacks, createEmptyPacks } from '@/utils/packs'

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

export const useStoreData = create(persist(
  (set, get) => ({
    ...initialState,

    setCompletedData: (completedData) => {
      const packs = buildPacks(completedData)
      set({ completedData, packs })
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
