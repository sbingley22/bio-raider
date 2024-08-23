/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, MutableRefObject, useEffect } from "react"
import * as THREE from "three"
import { GamepadState } from "../useGamepad"
import Player from "./Player"
import { useThree } from "@react-three/fiber"
import { useGameStore } from "../useGameStore"
import Enemy from "./Enemy"

const vec3 = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const quat = new THREE.Quaternion()

const Character: React.FC<{ 
  type: string,
  gamepadRef: MutableRefObject<GamepadState> | null,
  id: never | null,
  model: string | null,
  health: number,
  position: Array<number>,
  splatterFlag: MutableRefObject<string> | null,
}> = ({ type, gamepadRef=null, id=null, model=null, health=100, position=[0,0,0], splatterFlag }) => {
  const group = useRef<THREE.Group>(null)
  const anim = useRef<string>(null)
  const transition = useRef<string>(null)
  const { camera } = useThree()
  const { level, levels } = useGameStore()

  const withinBounds = (newX: number, newZ: number) => {
    // if (!camera) return
    const fov = camera.fov
    const aspect = camera.aspect

    const cameraX = camera.position.x;
    const cameraY = camera.position.y;
    const cameraZ = camera.position.z;

    const playerX = 0
    const playerY = 0
    const playerZ = newZ

    // Calculate the distance from the camera to the player
    const distance = Math.sqrt(
      Math.pow(cameraX - playerX, 2) +
      Math.pow(cameraY - playerY, 2) +
      Math.pow(cameraZ - playerZ, 2)
    )

    // Calculate half width distance from the camera
    const marginFactor = 1.0 - (2/distance)
    const fovInRadians = fov * (Math.PI / 180) / 2
    const halfWidth = Math.tan(fovInRadians) * distance * aspect * marginFactor
    
    let zNear = 5
    let zFar = -5
    const lvl = levels[level[0]][level[1]]
    if (lvl && lvl.size) {
      const arenaSize = lvl.size
      if (arenaSize === "small") {
        zNear = 6
        zFar = -0
      }
      else if (arenaSize === "large") {
        zNear = 9.5
        zFar = -0
      }
    }

    // Clamp within the calculated bounds
    const clampedX = Math.max(Math.min(newX, halfWidth), -halfWidth)
    const clampedZ = Math.max(Math.min(newZ, zNear), zFar)

    return {clampedX, clampedZ}
  }
  const moveInBounds = (dx: number, dy: number) => {
    if (!group.current) return null
    const bounds = withinBounds(group.current.position.x + dx, group.current.position.z + dy)

    let outOfBounds: number | null = null
    if (bounds.clampedX > group.current.position.x + dx) outOfBounds = 0
    else if (bounds.clampedX < group.current.position.x + dx) outOfBounds = 2
    else if (bounds.clampedZ > group.current.position.z + dy) outOfBounds = 1
    else if (bounds.clampedZ < group.current.position.z + dy) outOfBounds = 3

    group.current.position.x = bounds.clampedX
    group.current.position.z = bounds.clampedZ

    return outOfBounds
  }

  const takeDamage = (flag: any) => {
    if (!group.current) return null
    let tempHealth = group.current.userData.health
    if (!tempHealth) return null
    let status = "damaged"

    // incoming melee
    if (flag.type === "melee") {
      if (flag.pos) {
        if (flag.range) {
          const distance = group.current.position.distanceTo(flag.pos)
          if (distance > flag.range) return "missed"
        }
      }
    }

    let dmgMultiplier = 1
    if (anim.current === "float stunned") {
      dmgMultiplier = 1.2
    }

    tempHealth -= flag.dmg * dmgMultiplier
    group.current.userData.health = tempHealth

    splatterFlag.current = {
      pos: group.current.position,
      color: type==="Player"? 0x772211 : 0x556611,
    }

    return status
  }

  const rotateToVec = (dx: number, dy: number) => {
    if (!group.current) return
    // Calculate target rotation
    const direction = vec3.set(dx, 0, dy).normalize()
    const angle = Math.atan2(direction.x, direction.z)

    // Create quaternions for current and target rotations
    const currentQuaternion = group.current.quaternion.clone()
    const targetQuaternion = quat.setFromAxisAngle(vec3b.set(0, 1, 0), angle)

    // Interpolate rotation using slerp
    currentQuaternion.slerp(targetQuaternion, 0.1)
    group.current.quaternion.copy(currentQuaternion)
  }

  useEffect(() => {
    if (group.current) {
      group.current.userData.health = health
    }
  }, [health])

  return (
    <group 
      ref={group}
      position={position}
    >
      {type==="Player" && <Player
        group={group}
        gamepadRef={gamepadRef}
        anim={anim}
        transition={transition}
        takeDamage={takeDamage}
        rotateToVec={rotateToVec}
        moveInBounds={moveInBounds}
      />}

      {type==="Enemy" && <Enemy
        id={id}
        model={model}
        group={group}
        anim={anim}
        transition={transition}
        takeDamage={takeDamage}
        rotateToVec={rotateToVec}
        moveInBounds={moveInBounds}
      />}
    </group>
  )
}

export default Character