import { useFrame, useThree } from '@react-three/fiber'
import { Environment } from "@react-three/drei"
import React, { useEffect, MutableRefObject, useRef, useState } from 'react'
import { GamepadState } from './useGamepad'
import { useGameStore } from './useGameStore'
import ShadowCatcher from "./ShadowCatcher"
import Character from "./characters/Character"
import Collectables from './Collectables'

interface ArenaProps {
  gamepadRef: MutableRefObject<GamepadState>
}

const Arena: React.FC<ArenaProps> = ({ gamepadRef }) => {
  const { camera } = useThree()
  const { arenas, level, levels, setLevelImg, arenaClear, setArenaClear, enemies, setEnemies } = useGameStore()
  const arenaTimer = useRef<number>(0)

  const [collectables, setCollectables] = useState([])
  
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
    // console.log("New Level: ", lvl.name, level)

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
          camera.position.z = 8
        }
        else if (lvl.size === "large") {
          camera.position.y = 8
          camera.position.z = 12.8
        }
      }
    }

    arenaTimer.current = 0
    setArenaClear(false)
    if (arena.enemies && arena.enemies.length > 0) {
      setEnemies(arena.enemies)
      // console.log(arena.enemies, enemies)
    }
    else {
      setEnemies([])
    }

    if (arena.collectables && arena.collectables.length > 0) {
      setCollectables(arena.collectables)
    }
    else {
      setCollectables([])
    }

  }, [arenas, camera, level, levels, setArenaClear, setEnemies, setLevelImg])

  useFrame((_state,delta)=>{
    if (arenaTimer.current !== null) {
      arenaTimer.current += delta

      if (arenaTimer.current > 1) {
        if (enemies.length <= 0) {
          if (!arenaClear) setArenaClear(true)
        }
      }
    }
  })
  

  return (
    <>
      <Environment 
        preset="night" 
        environmentIntensity={4} 
        environmentRotation={[0,level[0] + level[1],0]}
      />
      <ShadowCatcher scale={2} />
      <directionalLight 
        castShadow 
        position={[0, 10, 0]} 
        intensity={0.1}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10} 
      />

      <Character 
        type="Player"
        gamepadRef={gamepadRef}
        health={100}
      />

      {Array.isArray(enemies) && enemies.map((enemy) => (
        <Character
          key={enemy.id}
          type='Enemy'
          id={enemy.id}
          model={enemy.model}
          health={enemy.health}
          position={enemy.pos}
        />
      ))}

      {collectables.map(collectable=> (
        <Collectables
          key={collectable.id}
          id={collectable.id}
          name={collectable.name}
          type={collectable.type}
          pos={collectable.pos}
          amount={collectable.amount}
          gamepad={gamepadRef}
          collectables={collectables}
          setCollectables={setCollectables}
        />
      ))}

    </>
  )
}

export default Arena