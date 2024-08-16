import { v4 as uuidv4 } from 'uuid'

export const arenas = {
  "vasculature": {
    "small": [
      {
        img: "vasculatureSmall0.png",
        enemies: [],
      }
    ],
    "large": [
      {
        img: "vasculatureLarge0.png",
        enemies: [
          {
            id: uuidv4(),
            model: "NKCell",
            health: 100,
            pos: [-1,0,3],
          },
          {
            id: uuidv4(),
            model: "Neutrophil",
            health: 100,
            pos: [3,0,5],
          },
          {
            id: uuidv4(),
            model: "NKCell",
            health: 100,
            pos: [-1,0,7],
          },
        ],
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