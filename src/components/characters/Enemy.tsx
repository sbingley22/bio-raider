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
    group.current.userData.range = 1.4
    group.current.userData.speed = 3
    group.current.userData.attackPower = 20
    group.current.userData.attackCooldown = 0

    if (model === "NKCell") {
      setVisibleNodes(["NKCell", "NKCape"])
      group.current.userData.aiMode = "melee"
      group.current.userData.range = 1.4
      group.current.userData.speed = 3
    }
    else if (model === "Neutrophil") {
      setVisibleNodes(["Neutrophil", "NeutroNet", "NeutroRos"])
      group.current.userData.aiMode = "melee"
      group.current.userData.range = 1.4
      group.current.userData.speed = 2
    }
  }, [model])

  const damaged = (flag: any) => {
    if (!group.current) return

    const dmgStatus = takeDamage(flag)
    if (dmgStatus==="damaged") {
      if (group.current.userData.health <= 0) {
        // Enemy Dead
        anim.current = "Dying"
        // remove from enemies userData
        removeFromEnemiesRef()
        // remove from enemies state
        setTimeout(()=>removeFromEnemiesState(), 1000)
      }
      else {
        const chance = Math.random()
        if (chance < 0.1) {
          anim.current = "float stunned"
          return
        }
        anim.current = "float dmg"
      }
    }
  }

  const removeFromEnemiesRef = () => {
    if (!player?.current) return
    if (!group.current) return

    const temp = player.current.userData.enemies.filter(e => e.current.id !== group.current.id)
    player.current.userData.enemies = temp
  }

  const removeFromEnemiesState = () => {
    setEnemies((prev) => {
      return prev.filter(enemy => enemy.id !== id)
    })
  }

  const isUnskippableAnimation = () => {
    const a = anim.current
    if (a === "float jab") return true
    if (a === "float straight") return true
    if (a === "float dmg") return true
    if (a === "float dying") return true
    if (a === "float stunned") return true

    return false
  }

  const aiMelee = (px, pz, vx, vz, delta) => {
    if (!group.current) return

    const distance = Math.sqrt(vx*vx + vz*vz)
    const pvx = vx / distance
    const pvz = vz / distance

    // Face Player
    rotateToVec(pvx, pvz)

    const range =  group.current.userData.range
    if (distance < range) {
      // Attack target
      group.current.userData.attackCooldown -= delta

      if (group.current.userData.attackCooldown <= 0) {
        // Attack Player
        if (!isUnskippableAnimation() || ["Take Damage"].includes(anim.current)) {
          const chance = Math.random()
          anim.current = "float jab"
          if (chance > 0.5) anim.current = "float straight"

          group.current.userData.attackCooldown = 1
          setTimeout(()=>{
            player.current.userData.dmgFlag = {
              type: "melee",
              dmg: group.current.userData.attackPower,
              pos: group.current.position,
              range: group.current.userData.range
            }
          }, 250)
        }
      }
      else {
        if (!isUnskippableAnimation()) {
          anim.current = "Fight Stance"
        }
      }
    }
    else {
      // Close distance to target
      if (["float jab", "float straight"].includes(anim.current)) return

      let tempSpeed = group.current.userData.speed
      if (anim.current === "float dmg") tempSpeed *= 0.5
      const tempX = group.current.position.x + (tempSpeed * pvx * delta)
      const tempZ = group.current.position.z + (tempSpeed * pvz * delta)
      let canMove = true

      // check to see if path is blocked by other enemies
      player.current.userData.enemies.forEach(e => {
        if (group.current.id === e.current.id) return

        const vx = e.current.position.x - group.current.position.x
        const vz = e.current.position.z - group.current.position.z
        const distance = Math.sqrt(vx*vx + vz*vz)

        if (distance < 0.75) {
          const evx = vx / distance
          const evz = vz / distance

          const dotProduct = pvx * evx + pvz * evz
          // is enemy ahead within a small angle
          if (dotProduct > 0.9) {
            canMove = false
          }
        }
      })

      if (canMove) {
        group.current.position.x = tempX
        group.current.position.z = tempZ

        if (!isUnskippableAnimation()) {
          anim.current = "float fwd"
        }
      }
      else {
        if (!isUnskippableAnimation()) {
          anim.current = "float fwd"
        }
      }
    }
  }

  // Game Loop
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useFrame((_state, delta) => {

    // Check flags
    if (group.current?.userData.actionFlag) {
      group.current.userData.actionFlag = null
    }
    if (group.current?.userData.dmgFlag) {
      damaged(group.current.userData.dmgFlag)
      group.current.userData.dmgFlag = null
    }

    // Get player position etc
    if (!group.current) return
    if (!player?.current) return
    const px = player.current.position.x
    const pz = player.current.position.z
    const vx = px - group.current.position.x
    const vz = pz - group.current.position.z

    // Ai
    const aiMode = group.current?.userData.aiMode
    if (aiMode === "melee") {
      aiMelee(px, pz, vx, vz, delta)
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