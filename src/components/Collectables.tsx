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
  const { player, inventory, setInventory } = useGameStore()

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
      return
    }

    useGameStore.setState((state) => ({
      hudInfo: {
        ...state.hudInfo,
        msg: "Inventory Full"
      }
    }))
  }

  useFrame(()=>{
    if (!group.current) return
    if (!player.current) return

    const { interact } = getKeys()

    const dist = group.current.position.distanceTo(player.current.position)
    if (dist < 0.75) {
      setHudInfo(prev => ({
        ...prev,
        msg: "E/X to pickup item"
      }))
      if (interact || gamepad.current.interact) {
        pickupItem()
      }
    }
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
