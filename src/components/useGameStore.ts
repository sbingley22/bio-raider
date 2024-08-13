import { create } from "zustand"
import { levelData } from "../assets/levels"

interface GameOptions {
  altCost: number
}

// Define the Zustand store
interface GameState {
  mode: number
  setMode: (mode: number) => void
  options: GameOptions
  setOptions: (options: Partial<GameOptions>) => void
  level: Array<number>
  setLevel: (level: Array<number>) => void
  levels: Array<Array<any>>
  setLevels: (levels: Array<Array<any>>) => void
}

export const useGameStore = create<GameState>((set) => ({
  mode: 1,
  setMode: (mode) => set({ mode }),
  options: {
    altCost: 0,
  },
  setOptions: (newOptions) =>
    set((state) => ({
      options: { ...state.options, ...newOptions },
    })),
  level: [0,0],
  setLevel: (level) => set({ level }),
  levels: levelData,
  setLevels: (levels) => set({ levels }),
}))
