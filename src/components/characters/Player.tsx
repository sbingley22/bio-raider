import { MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import CharacterModel from "./CharacterModel"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import { GamepadState } from "../useGamepad"

interface PlayerProps {
  group: MutableRefObject<THREE.Group | null>,
  gamepadRef: MutableRefObject<GamepadState | null> | null
}

const Player = ({ group, gamepadRef }: PlayerProps) => {
  console.log("Player Rerender")
  const [, getKeys] = useKeyboardControls()
  
  const getInputs = () => {
    let jump: boolean = false

    if (gamepadRef && gamepadRef.current) {
      if (gamepadRef.current.jump) jump = true
    }
    
    const { forwardKey, backwardKey, leftKey, rightKey, jumpKey, interactKey, inventoryLeftKey, inventoryRightKey, inventoryUseKey, shiftKey, aimUpKey, aimLeftKey, aimRightKey, aimDownKey } = getKeys()

    if (jumpKey) jump = true

    return { jump }
  }

  useFrame((_state,delta) => {
    if (group.current === null) return

    const inputs = getInputs()
    if (inputs.jump) {
      group.current.position.x += 0.1 * delta
    }
  })

  return (
    <>
      <CharacterModel
      />
    </>
  )
}

export default Player