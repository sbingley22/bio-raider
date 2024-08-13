import React, { useRef, MutableRefObject, useEffect } from "react"
import * as THREE from "three";
import { GamepadState } from "../useGamepad"
import Player from "./Player";

const Character: React.FC<{ 
  type: string,
  gamepadRef: MutableRefObject<GamepadState> | null,
  health: number,
}> = ({ type, gamepadRef, health=100 }) => {
  const group = useRef<THREE.Group>(null)
  const anim = useRef<string>(null)
  const transition = useRef<string>(null)

  const takeDamage = (dmg: number) => {
    if (!group.current) return null
    let tempHealth = group.current.userData.health
    if (!tempHealth) return null

    tempHealth -= dmg
    group.current.userData.health = tempHealth

    return "damaged"
  }

  useEffect(() => {
    if (group.current) {
      group.current.userData.health = health
    }
  }, [health])

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
      />}

    </group>
  )
}

export default Character