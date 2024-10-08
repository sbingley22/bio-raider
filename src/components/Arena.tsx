import { useFrame, useThree } from '@react-three/fiber'
import { Environment } from "@react-three/drei"
import React, { useEffect, MutableRefObject, useRef, useState } from 'react'
import { GamepadState } from './useGamepad'
import { useGameStore } from './useGameStore'
import ShadowCatcher from "./ShadowCatcher"
import Character from "./characters/Character"
import Collectables from './Collectables'
import Net from './Net'
import BloodManager from "./BloodManager"

interface ArenaProps {
  gamepadRef: MutableRefObject<GamepadState>
  loadGame: boolean
}

const Arena: React.FC<ArenaProps> = ({ gamepadRef, loadGame=false }) => {
  const { camera } = useThree()
  const { arenas, setArenas, level, setLevel, levels, setLevelImg, arenaClear, setArenaClear, player, enemies, setEnemies, setInventory, nets, setNets } = useGameStore()
  const arenaTimer = useRef<number>(0)

  const [collectables, setCollectables] = useState([])
  const splatterFlag = useRef(null)
 
  // load save data
  useEffect(()=>{
    if (!loadGame) return

    const data = JSON.parse(localStorage.getItem('save1'))
    if (data) {
      // console.log("Load data: ", data)
      if (player?.current) player.current.userData.health = data.player.health ?? 100
      if (data.inventory) setInventory(data.inventory)
      if (data.level) setLevel(data.level)
      if (data.arenas) setArenas(data.arenas)
    }
    else {
      console.log("Couldn't load data")
    }
  }, [loadGame]) 

  // load level
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

    if (arena.nets && arena.nets.length > 0) {
      setNets(arena.nets)
    }
    else {
      setNets([])
    }

  }, [arenas, camera, level, levels, setArenaClear, setEnemies, setLevelImg, setNets])

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
  
  const levelName = levels[level[0]][level[1]].name
  let ePreset = "night"
  let eIntensity = 6
  if (levelName === "bone-marrow") {
    ePreset = "forest"
    eIntensity = 1
  }

  return (
    <>
      <Environment 
        preset={ePreset} 
        environmentIntensity={eIntensity} 
        environmentRotation={[0,level[0] + level[1],0]}
        background
        backgroundIntensity={eIntensity/2}
        // ground={{
        //   scale: 20,
        //   }
        // }
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
        splatterFlag={splatterFlag}
      />

      {Array.isArray(enemies) && enemies.map((enemy) => (
        <Character
          key={enemy.id}
          type='Enemy'
          id={enemy.id}
          model={enemy.model}
          health={enemy.health}
          position={enemy.pos}
          splatterFlag={splatterFlag}
        />
      ))}

      {collectables.map(collectable=> (
        collectable.name !== "" && <Collectables
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

      {nets.map(net=> (
        <Net
          key={net.id}
          id={net.id}
          pos={net.pos}
          scale={net.scale}
        />
      ))}

      <BloodManager splatterFlag={splatterFlag} />

    </>
  )
}

export default Arena