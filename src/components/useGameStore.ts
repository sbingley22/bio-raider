import { create } from "zustand";

interface GameOptions {
  altCost: number;
}

// Define the Zustand store
interface GameState {
  mode: number;
  setMode: (mode: number) => void;
  options: GameOptions;
  setOptions: (options: Partial<GameOptions>) => void;
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
}));
