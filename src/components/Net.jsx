import React, { useRef, useState } from 'react'
import ItemProps from "./ItemProps"
import { useGameStore } from "./useGameStore"
import { useFrame } from '@react-three/fiber'

const Net = ({ id, pos=[0,0,0], scale=1 }) => {
  const [visibleNodes, setVisibleNodes] = useState(["Net"])
  const { player, nets, setNets, inventory, inventorySlot, setInventory } = useGameStore()
  const group = useRef()

  const yRot = Math.floor((pos[0] + pos[1] + pos[2]) % 4) * (Math.PI/2)

  const removeItem = () => {
    const tempInv = [...inventory]
    tempInv[inventorySlot].amount -= 1
    if (tempInv[inventorySlot].amount <= 0) {
      tempInv[inventorySlot].name = ""
    }
    setInventory(tempInv)
  }

  useFrame((state,delta)=>{
    if (!player || !player.current) return
    if (!group || !group.current) return

    const distance = group.current.position.distanceTo(player.current.position)
    if (distance < scale) {
      const item = inventory[inventorySlot]
      if (item.name === "net spray") {
        // Remove net and reduce item count
        const tempNets = nets.filter((net) => net.id !== id)
        setNets(tempNets)

        removeItem()
      }
      else {
        player.current.userData.groundFlag = "net"
      }
    }
  })

  return (
    <group
      ref={group}
      position={pos}
      scale={[scale, 1, scale]}
      rotation={[0, yRot, 0]}
    >
      <ItemProps
        visibleNodes={visibleNodes} 
      />
    </group>
  )
}

export default Net