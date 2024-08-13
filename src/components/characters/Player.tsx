import { MutableRefObject, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import { GamepadState } from "../useGamepad"
import SurvivorModel from "./SurvivorModel"

const outfits = [
  ["SurvivorF", "Hair-WavyPunk", "Pistol", "GownFull"],
  ["SurvivorF", "Hair-WavyPunk", "Pistol", "GownTop", "Shoes-HighTops001"],
  ["SurvivorFGen", "Hair-WavyPunk", "Pistol", "GownTop", "Shoes-HighTops001"],
  ["SurvivorFGen", "Hair-WavyPunk", "Pistol", "Shoes-HighTops001"],
]

interface Inputs {
  dX: number
  dY: number
  aX: number
  aY: number
  jump: boolean
  outfitD: number
}

interface PlayerProps {
  group: MutableRefObject<THREE.Group | null>,
  gamepadRef: MutableRefObject<GamepadState | null> | null,
  anim: MutableRefObject<string | null>, 
  transition: MutableRefObject<string | null>,
  takeDamage: (dmg: number) => string | null
}

const Player = ({ group, gamepadRef, anim, transition, takeDamage }: PlayerProps) => {
  // console.log("Player Rerender")
  const [visibleNodes, setVisibleNodes] = useState(outfits[0])
  const outfit = useRef(0)

  const [, getKeys] = useKeyboardControls()
  const generalKeyHeld = useRef<boolean>(false)

  const getInputs = (): Inputs => {
    const { forwardKey, backwardKey, leftKey, rightKey, jumpKey, interactKey, inventoryLeftKey, inventoryRightKey, inventoryUseKey, shiftKey, aimUpKey, aimLeftKey, aimRightKey, aimDownKey, outfitPrev, outfitNext } = getKeys()
    const gamepadValid = gamepadRef && gamepadRef.current

    let dX = 0
    let dY = 0
    let aX = 0
    let aY = 0
    if (gamepadValid) {
      if (gamepadRef.current?.moveX) dX = gamepadRef.current.moveX 
      if (gamepadRef.current?.moveY) dY = gamepadRef.current.moveY 
      if (gamepadRef.current?.aimX) aX = gamepadRef.current.aimX 
      if (gamepadRef.current?.aimY) aY = gamepadRef.current.aimY 
    }
    if (leftKey) dX = -1
    else if (rightKey) dX = 1
    if (forwardKey) dY = -1
    else if (backwardKey) dY = 1
    if (aimLeftKey) aX = -1
    else if (aimRightKey) aX = 1
    if (aimUpKey) aY = -1
    else if (aimDownKey) aY = 1

    let jump = false
    if (gamepadValid) {
      if (gamepadRef.current?.jump) jump = true
    }
    if (jumpKey) jump = true

    let outfitD = 0
    if (outfitPrev && !generalKeyHeld.current) outfitD = -1
    else if (outfitNext && !generalKeyHeld.current) outfitD = 1

    if (outfitNext || outfitPrev || inventoryLeftKey || inventoryRightKey) generalKeyHeld.current = true
    else generalKeyHeld.current = false

    return { dX, dY, aX, aY, jump, outfitD }
  }

  const updateInventory = (inputs: Inputs) => {
    if (inputs.outfitD) {
      let newOutfit = outfit.current + inputs.outfitD
      if (newOutfit < 0) newOutfit = outfits.length-1
      else if (newOutfit >= outfits.length) newOutfit = 0
      outfit.current = newOutfit
      setVisibleNodes(outfits[outfit.current])
    }
  }

  const movement = (inputs: Inputs, delta: number) => {
    if (group.current === null) return

    let speed = 1
    if (inputs.dX) {
      group.current.position.x += inputs.dX * speed * delta
    }
    if (inputs.dY) {
      group.current.position.z += inputs.dY * speed * delta
    }
  }

  useFrame((_state,delta) => {
    const inputs = getInputs()
    movement(inputs, delta)
    updateInventory(inputs)
  })

  return (
    <>
      <SurvivorModel
        visibleNodes={visibleNodes}
        anim={anim}
        transition={transition}
      />
    </>
  )
}

export default Player