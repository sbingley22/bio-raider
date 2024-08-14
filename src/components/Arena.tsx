import { useThree } from '@react-three/fiber'
import { Environment } from "@react-three/drei"
import React, { useEffect, MutableRefObject } from 'react'
import { GamepadState } from './useGamepad'
import { useGameStore } from './useGameStore'
import ShadowCatcher from "./ShadowCatcher"
import Character from "./characters/Character"

interface ArenaProps {
  gamepadRef: MutableRefObject<GamepadState>
}

const Arena: React.FC<ArenaProps> = ({ gamepadRef }) => {
  const { camera } = useThree()
  const { arenas, level, levels, setLevelImg, setArenaClear, enemies, setEnemies } = useGameStore()
  
  useEffect(() => {
    const lvl = levels[level[0]][level[1]]
    if (!lvl) {
      console.error("Cannot Load Level!")
      return
    }
    if (!lvl.name || !arenas[lvl.name]) {
      console.error("Cannot Find Arena")
      return
    }
    console.log("New Level: ", lvl.name, level)

    let arena = arenas[lvl.name]
    if (lvl.type === "random") {
      // select random arena type
      const subArenas = arena[lvl.size]
      const index = Math.floor(Math.random() * subArenas.length)
      arena = subArenas[index]
    }
    setLevelImg(arena.img)

    if (lvl.size) {
      if (camera) {
        if (lvl.size === "small") {
          camera.position.y = 5
          camera.position.z = 5
        }
        else if (lvl.size === "large") {
          camera.position.y = 8
          camera.position.z = 8
        }
      }
    }

    if (arena.enemies && arena.enemies.length > 0) {
      setEnemies(arena.enemies)
      setArenaClear(false)
    }
    else {
      setEnemies([])
      setArenaClear(true)
    }

  }, [arenas, camera, level, levels, setArenaClear, setEnemies, setLevelImg])

  return (
    <>
      <Environment preset="night" environmentIntensity={4} />
      <ShadowCatcher />
      <directionalLight castShadow position={[0, 10, 0]} intensity={0.1} />

      <Character 
        type="Player"
        gamepadRef={gamepadRef}
        health={75}
      />
    </>
  )
}

export default Arena