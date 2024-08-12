import React, { useRef, MutableRefObject } from "react"
import * as THREE from "three";
import { GamepadState } from "../useGamepad"
import Player from "./Player";

const Character: React.FC<{ 
  type: string,
  gamepadRef: MutableRefObject<GamepadState> | null
}> = ({ type, gamepadRef }) => {
  const group = useRef<THREE.Group>(null)

  return (
    <group 
      ref={group}
    >
      {type==="Player" && <Player
        group={group}
        gamepadRef={gamepadRef}
      />}

    </group>
  )
}

export default Character