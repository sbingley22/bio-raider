import { create } from "zustand"
import { arenas, levelData } from "../assets/levels"

interface GameOptions {
  altCost: number
}

interface EnemyObject {
  id: any
  ref: any
  type: string
  model: string
  pos: Array<number>
  health: number
}

// Define the Zustand store
interface GameState {
  mode: number
  setMode: (mode: number) => void
  options: GameOptions
  setOptions: (options: Partial<GameOptions>) => void
  arenas: any
  setArenas: (arenas: any) => void
  level: Array<number>
  setLevel: (level: Array<number>) => void
  levels: Array<Array<any>>
  setLevels: (levels: Array<Array<any>>) => void
  levelImg: string
  setLevelImg: (levelImg: string) => void
  arenaClear: boolean
  setArenaClear: (arenaClear: boolean) => void
  enemies: Array<EnemyObject>
  setEnemies: (enemies: Array<EnemyObject>) => void

  playAudio: (src: string, volume?: number) => void
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
  arenas: arenas,
  setArenas: (arenas) => set({ arenas }),
  level: [0,0],
  setLevel: (level) => set({ level }),
  levels: levelData,
  setLevels: (levels) => set({ levels }),
  levelImg: "vasculature1.png",
  setLevelImg: (levelImg) => set({ levelImg }),
  arenaClear: false,
  setArenaClear: (arenaClear) => set({ arenaClear }),
  enemies: [],

  playAudio: (src, volume = 1) => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play();
  }, setEnemies: (enemies) => set({ enemies }),

}))
