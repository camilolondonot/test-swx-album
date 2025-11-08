import { create } from 'zustand'
import { buildPacks, createEmptyPacks } from '@/utils/packs'

const createInitialState = () => ({
  completedData: [],
  packs: createEmptyPacks(),
  albumUser: [],
})

export const useStoreData = create((set) => ({
  ...createInitialState(),

  setCompletedData: (completedData) => set(() => ({
    completedData,
    packs: buildPacks(completedData),
  })),

  regeneratePacks: () => set((state) => ({
    packs: buildPacks(state.completedData),
  })),

  setAlbumUser: (albumUser) => set({ albumUser }),

  resetStore: () => set(createInitialState()),
}))