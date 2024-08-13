import React, { useRef, MutableRefObject, useEffect } from "react"
import * as THREE from "three"
import { GamepadState } from "../useGamepad"
import Player from "./Player"
import { useThree } from "@react-three/fiber"
import { arenas } from "../../assets/levels"
import { useGameStore } from "../useGameStore"

const vec3 = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const quat = new THREE.Quaternion()

const Character: React.FC<{ 
  type: string,
  gamepadRef: MutableRefObject<GamepadState> | null,
  health: number,
}> = ({ type, gamepadRef, health=100 }) => {
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
    if (lvl && lvl.arena) {
      const arenaSize = lvl.arena
      if (arenaSize === "small") {
        zNear = 3
        zFar = -2
      }
    }

    // Clamp within the calculated bounds
    const clampedX = Math.max(Math.min(newX, halfWidth), -halfWidth)
    const clampedZ = Math.max(Math.min(newZ, zNear), zFar)

    return {clampedX, clampedZ}
  }
  const moveInBounds = (dx: number, dy: number) => {
    if (!group.current) return
    const bounds = withinBounds(group.current.position.x + dx, group.current.position.z + dy)
    group.current.position.x = bounds.clampedX
    group.current.position.z = bounds.clampedZ
  }

  const takeDamage = (dmg: number) => {
    if (!group.current) return null
    let tempHealth = group.current.userData.health
    if (!tempHealth) return null

    tempHealth -= dmg
    group.current.userData.health = tempHealth

    return "damaged"
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

  useEffect(() => {
    const lvl = levels[level[0]][level[1]]
    if (!lvl) {
      console.error("Cannot Load Level!")
      return
    }

    if (lvl.arena) {
      if (camera) {
        if (lvl.arena === "small") {
          camera.position.y = 5
          camera.position.z = 5
        }
        else if (lvl.arena === "large") {
          camera.position.y = 8
          camera.position.z = 8
        }
      }
    }

  }, [camera, level, levels])

  return (
    <group 
      ref={group}
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

    </group>
  )
}

export default Character