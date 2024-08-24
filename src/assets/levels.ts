import { v4 as uuidv4 } from 'uuid'

export const arenas = {
  "vasculature": {
    "small": [
      {
        img: "vasculatureSmall0.png",
        enemies: [],
        nets: [
          {
            id: uuidv4(),
            pos: [-1, 0, 2],
            scale: 1,
          },
          {
            id: uuidv4(),
            pos: [3, 0, 4],
            scale: 2,
          },
          {
            id: uuidv4(),
            pos: [-2, 0, 4],
            scale: 1.5,
          },
        ]
      },
      {
        img: "vasculatureSmall0.png",
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
        nets: [
          {
            id: uuidv4(),
            pos: [-1, 0, 2],
            scale: 1,
          },
          {
            id: uuidv4(),
            pos: [3, 0, 4],
            scale: 2,
          },
          {
            id: uuidv4(),
            pos: [2, 0, 4],
            scale: 1.5,
          },
        ]
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
        nets: [
          {
            id: uuidv4(),
            pos: [-1, 0, 6],
            scale: 1.4,
          },
          {
            id: uuidv4(),
            pos: [2, 0, 1],
            scale: 2,
          },
          {
            id: uuidv4(),
            pos: [-5, 0, 4],
            scale: 1.5,
          },
          {
            id: uuidv4(),
            pos: [5, 0, 5],
            scale: 2.5,
          },
        ]
      },
      {
        img: "vasculatureLarge0.png",
        enemies: [
          {
            id: uuidv4(),
            model: "NKCell",
            health: 100,
            pos: [7,0,3],
          },
          {
            id: uuidv4(),
            model: "Neutrophil",
            health: 100,
            pos: [5,0,5],
          },
          {
            id: uuidv4(),
            model: "NKCell",
            health: 100,
            pos: [-1,0,7],
          },
        ],
        nets: [
          {
            id: uuidv4(),
            pos: [1, 0, 6],
            scale: 1.4,
          },
          {
            id: uuidv4(),
            pos: [2, 0, 3],
            scale: 2,
          },
          {
            id: uuidv4(),
            pos: [3, 0, 4],
            scale: 1.5,
          },
          {
            id: uuidv4(),
            pos: [1, 0, 5],
            scale: 2.5,
          },
        ]
      },
    ],
  },
  "bone-marrow": {
    img: "vasculature1.png",
    enemies: [], 
   "collectables": [
      {
        id: uuidv4(),
        name: "type writer",
        type: "TypeWriter",
        pos: [0,0,0],
        amount: 1,
      },
      {
        id: uuidv4(),
        name: "health kit",
        type: "HealthKit",
        pos: [1,0,3],
        amount: 1,
      },
      {
        id: uuidv4(),
        name: "net spray",
        type: "Spray",
        pos: [-1.5,0,3.5],
        amount: 3,
      },
    ]
  },
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
      pathRight: "open",
    },
    {
      x: 2,
      y: 0,
      name: "vasculature",
      type: "random",
      size: "large",
      pathLeft: "open",
      pathRight: "open",
    },
    {
      x: 3,
      y: 0,
      name: "vasculature",
      type: "random",
      size: "small",
      pathUp: "open",
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
    },
    {
      x: 1,
      y: 1,
    },
    {
      x: 2,
      y: 1,
    },
    {
      x: 3,
      y: 1,
      name: "vasculature",
      type: "random",
      size: "small",
      pathDown: "open",
      pathRight: "open",
    },
    {
      x: 4,
      y: 1,
      name: "vasculature",
      type: "random",
      size: "small",
      pathUp: "open",
      pathLeft: "open",
    },
  ],
  // LEVEL 2 ---------------------
  [
    {
      x: 0,
      y: 2,
      name: "bone-marrow",
      type: "unique",
      size: "small",
      pathRight: "open",
    },
    {
      x: 1,
      y: 2,
      name: "vasculature",
      type: "random",
      size: "large",
      pathLeft: "open",
      pathRight: "open",
    },
    {
      x: 2,
      y: 2,
      name: "vasculature",
      type: "random",
      size: "large",
      pathLeft: "open",
      pathRight: "open",
    },
    {
      x: 3,
      y: 2,
      name: "vasculature",
      type: "random",
      size: "small",
      pathRight: "open",
      pathLeft: "open",
    },
    {
      x: 4,
      y: 2,
      name: "bone-marrow",
      type: "unique",
      size: "small",
      pathDown: "open",
      pathLeft: "open",
    },
  ],
]