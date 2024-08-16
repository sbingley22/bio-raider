import React, { MutableRefObject, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../useGameStore'
import CharacterModel from './CharacterModel'
import { useFrame } from '@react-three/fiber'

interface EnemyProps {
  id: never,
  model: string,
  group: MutableRefObject<THREE.Group | null>,
  anim: MutableRefObject<string | null>,
  transition: MutableRefObject<string | null>,
  takeDamage: (dmg: number) => string | null,
  rotateToVec: (dx: number, dy: number) => void,
  moveInBounds: (dx: number, dy: number) => number | null,
}

const Enemy = ({ id, model="NKCell", group, anim, transition, takeDamage, rotateToVec, moveInBounds }: EnemyProps) => {
  const [visibleNodes, setVisibleNodes] = useState(["NKCell"])
  const { player, enemies, setEnemies, playAudio } = useGameStore()

  // Add to player user data
  useEffect(()=>{
    // update enemies state with react group ref
    if (player) {
      player.current.userData.enemies.push(group)
    }
  }, [group, player])

  // Setup model type
  useEffect(()=>{
    if (!group.current) return

    group.current.userData.aiMode = "melee"
    group.current.userData.range = 1
    group.current.userData.speed = 3

    if (model === "NKCell") {
      setVisibleNodes(["NKCell", "NKCape"])
      group.current.userData.aiMode = "melee"
      group.current.userData.range = 1
      group.current.userData.speed = 3
    }
    else if (model === "Neutrophil") {
      setVisibleNodes(["Neutrophil", "NeutroNet", "NeutroRos"])
      group.current.userData.aiMode = "melee"
      group.current.userData.range = 1.1
      group.current.userData.speed = 2
    }
  }, [model])

  const aiMelee = () => {
    if (!group.current) return

    const distance = player?.current.position.distanceTo(group.current?.position)
    const range =  group.current.userData.range
    if (distance < range) {
      // Attack target

    }
    else {
      // Close distance to target

    }
  }

  // Game Loop
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useFrame((_state, delta) => {

    // Check flags


    // Ai
    const aiMode = group.current?.userData.aiMode
    if (aiMode === "melee") {
      aiMelee()
    }
  })

  return (
    <>
      <CharacterModel
        visibleNodes={visibleNodes}
        anim={anim}
        transition={transition}
      />
    </>
  )
}

export default Enemy