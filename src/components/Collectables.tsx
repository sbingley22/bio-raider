import React, { useEffect, useRef, useState } from "react"
import ItemProps from "./ItemProps"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useGameStore } from "./useGameStore"

interface CollectablesProps {
  id: any,
  name: string,
  type: string,
  pos: Array<number>
  amount: number
  gamepad: any
  collectables: Array<any>
  setCollectables: any
}

const Collectables: React.FC<CollectablesProps> = ({ id, name, type, pos, amount, gamepad, collectables, setCollectables }) => {
  const group = useRef()
  const [visibleNodes, setVisibleNodes] = useState<Array<string>>([])
  const [, getKeys] = useKeyboardControls()
  const { arenas, setArenas, levels, setLevels, level, player, inventory, setInventory } = useGameStore()
  const interactHeld = useRef(false)

  // remove item from levels data
  const removeCollectableFromLevels = () => {
    const tempArenas = {...arenas}
    const name = levels[level[0]][level[1]].name
    const type = levels[level[0]][level[1]].type

    if (type === "unique") {
      // find collectable by id
      tempArenas[name].collectables.forEach(col => {
        if (col.id === id) col.name = ""
      })
      setArenas(tempArenas)
    }
  }

  useEffect(()=>{
    if (type === "HealthKit") {
      setVisibleNodes(["HealthKit"])
    }
    else if (type === "Spray") {
      setVisibleNodes(["Spray"])
    }
    else if (type === "Grenade") {
      setVisibleNodes(["Grenade"])
    }
    else if (type === "Ammo") {
      setVisibleNodes(["Ammo"])
    }
    else if (type === "TypeWriter") {
      setVisibleNodes(["TypeWriter"])
    }
  }, [type])

  const pickupItem = () => {
    const temp = collectables.filter((col)=> col.id !== id)
    setCollectables(temp)

    const tempInventory = [...inventory]
    // check if already contains same item type
    let emptyIndex = null
    for (let index = 0; index < tempInventory.length; index++) {
      const element = tempInventory[index]
      if (element.name === name) {
        element.amount += amount
        setInventory(tempInventory)
        return
      }
      else if (emptyIndex === null && element.name === "") emptyIndex=index
    }

    // put item in first empty index
    if (emptyIndex != null) {
      tempInventory[emptyIndex].name = name
      tempInventory[emptyIndex].amount = amount
      setInventory(tempInventory)
      removeCollectableFromLevels()
      return
    }

    useGameStore.setState((state) => ({
      hudInfo: {
        ...state.hudInfo,
        msg: "Inventory Full"
      }
    }))
  }

  const saveGame = () => {
    // console.log("Saving")
    const saveData = {
      player: {
        health: player?.current.userData.health,
      },
      inventory: inventory,
      level: level,
      arenas: arenas,
    }

    localStorage.setItem("save1", JSON.stringify(saveData))
  }

  useFrame(()=>{
    if (!group.current) return
    if (!player || !player.current) return

    const { interactKey } = getKeys()

    const dist = group.current.position.distanceTo(player.current.position)
    if (dist < 0.75) {
      let message = "E/X to pickup item"
      if (name === "type writer") message = "E/X to save game"
      useGameStore.setState((state) => ({
        hudInfo: {
          ...state.hudInfo,
          msg: message        
        },
      }));

      if (!interactHeld.current && (interactKey || gamepad.current.interact)) {
        if (name === "type writer") {
          saveGame()
        } else {
          pickupItem()
        }
      }
    }

    if (interactKey) interactHeld.current = true
    else interactHeld.current = false
  })

  return (
    <group 
      ref={group}
      position={pos}
    >
      <ItemProps
        visibleNodes={visibleNodes}
      />
    </group>
  )
}

export default Collectables
