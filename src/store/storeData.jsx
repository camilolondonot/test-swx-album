import { create } from 'zustand'
import { buildPacks, createEmptyPacks } from '@/utils/packs'

export const useStoreData = create((set) => ({
  completedData: [],
  packs: createEmptyPacks(),
  albumUser: [],

  setCompletedData: (completedData) => {
    const packs = buildPacks(completedData)
    set({ completedData, packs })
  },

  addCardToAlbum: (card) => set((state) => ({
    albumUser: [...state.albumUser, card],
  })),

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
    const albumAlreadyContains = shouldAddToAlbum
      ? state.albumUser.some((card) => card.id === cardId)
      : false

    const updatedAlbum = shouldAddToAlbum && !albumAlreadyContains
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

  resetStore: () => set({
    completedData: [],
    packs: createEmptyPacks(),
    albumUser: [],
  }),
}))
