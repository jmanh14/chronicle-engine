import { create } from 'zustand'

export const useStore = create((set) => ({
  // screen
  screen: 'landing',
  navigate: (to) => set({ screen: to }),

  // config
  config: null,
  setConfig: (config) => set({ config }),

  // story
  story: [],
  setStory: (story) => set({ story }),

  // inventory
  inventory: { items: [], allies: [], enemies: [], status: [] },
  setInventory: (inventory) => set({ inventory }),

  // movie card
  movieCard: null,
  setMovieCard: (movieCard) => set({ movieCard }),

  // reset everything for a new game
  resetGame: () => set({
    story: [],
    inventory: { items: [], allies: [], enemies: [], status: [] },
    movieCard: null,
    config: null,
  }),
}))