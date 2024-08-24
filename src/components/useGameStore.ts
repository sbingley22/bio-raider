import { create } from "zustand"
import { arenas, levelData } from "../assets/levels"
import * as THREE from 'three'
import { MutableRefObject } from 'react'


interface GameOptions {
  altCost: number
  oneHand: boolean
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
  setArenas: (arenas: never) => void
  level: Array<number>
  setLevel: (level: Array<number>) => void
  levels: Array<Array<any>>
  setLevels: (levels: Array<Array<any>>) => void
  levelImg: string
  setLevelImg: (levelImg: string) => void
  arenaClear: boolean
  setArenaClear: (arenaClear: boolean) => void
  player: MutableRefObject<THREE.Group> | null
  setPlayer: (player: THREE.Group) => void
  enemies: Array<EnemyObject>
  setEnemies: (enemies: Array<EnemyObject>) => void
  nets: Array<any>
  setNets: (nets: Array<any>) => void
  hudInfo: any
  setHudInfo: (hudInfo: any) => void
  inventory: Array<any>
  setInventory: (inventory: Array<any>) => void
  inventorySlot: number
  setInventorySlot: (inventorySlot: number) => void

  playAudio: (src: string, volume?: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  mode: 0,
  setMode: (mode) => set({ mode }),
  options: {
    altCost: 0,
    oneHand: false,
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
  player: null,
  setPlayer: (player) => set({ player }),
  enemies: [],
  setEnemies: (enemies) => set({ enemies }),
  nets: [],
  setNets: (nets) => set({ nets }),
  hudInfo: {
    msg: "",
    health: 100,
  },
  setHudInfo: (hudInfo) => set({ hudInfo }),
  inventory: [
    {
      name: "power ammo",
      amount: 20
    },
    {
      name: "stun grenade",
      amount: 1,
    },
    {name:"",amount:0},
    {name:"",amount:0},
    {name:"",amount:0},
    {name:"",amount:0},
  ],
  setInventory: (inventory) => set({ inventory }),
  inventorySlot: 0,
  setInventorySlot: (inventorySlot) => set({ inventorySlot }),

  playAudio: (src, volume = 1) => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play();
  },

}))
