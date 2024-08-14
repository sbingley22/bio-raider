import { v4 as uuidv4 } from 'uuid'

export const arenas = {
  "vasculature": {
    "small": [
      {
        img: "vasculature2.png",
        enemies: [],
      }
    ],
    "large": [
      {
        img: "vasculature3.png",
        enemies: [],
      }
    ],
  },
  "bone-marrow": {
    img: "vasculature1.png",
    enemies: [],
  }
}

export const levelData = [
  // level 0 -------------------
  [
    {
      x: 0,
      y: 0,
      name: "vasculature",
      type: "random",
      size: "small",
      pathUp: "open",
      pathRight: "open",
    },
    {
      x: 1,
      y: 0,
      name: "vasculature",
      type: "random",
      size: "large",
      pathLeft: "open",
    },
  ],
  // LEVEL 1 ---------------------
  [
    {
      x: 0,
      y: 1,
      name: "bone-marrow",
      type: "unique",
      size: "small",
      pathDown: "open",
    }
  ],
]