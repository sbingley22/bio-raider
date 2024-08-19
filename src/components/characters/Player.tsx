/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import { GamepadState } from "../useGamepad"
import SurvivorModel from "./SurvivorModel"
import { useGameStore } from "../useGameStore"

const outfits = [
  ["SurvivorF", "Hair-WavyPunk", "Pistol", "GownFull", "Shoes-HighTops001"],
  ["SurvivorF", "Hair-WavyPunk", "Pistol", "GownTop", "Shoes-HighTops001"],
  ["SurvivorFGen", "Hair-WavyPunk", "Pistol", "GownTop", "Shoes-HighTops001"],
  ["SurvivorFGen", "Hair-WavyPunk", "Pistol", "Shoes-HighTops001"],
]

interface Inputs {
  shift: boolean
  dX: number
  dY: number
  aX: number
  aY: number
  jump: boolean
  outfitD: number
  interact: boolean
}

interface PlayerProps {
  group: MutableRefObject<THREE.Group | null>,
  gamepadRef: MutableRefObject<GamepadState | null> | null,
  anim: MutableRefObject<string | null>, 
  transition: MutableRefObject<string | null>,
  enemies: Array<any>,
  takeDamage: (dmg: number) => string | null,
  rotateToVec: (dx: number, dy: number) => void,
  moveInBounds: (dx: number, dy: number) => number | null,
}

const Player = ({ group, gamepadRef, anim, transition, takeDamage, rotateToVec, moveInBounds }: PlayerProps) => {
  // console.log("Player Rerender")
  const [visibleNodes, setVisibleNodes] = useState(outfits[0])
  const outfit = useRef(0)
  const { setMode, arenaClear, level, setLevel, levels, setPlayer, enemies, setHudInfo, playAudio } = useGameStore()
  const lvl = levels[level[0]][level[1]]

  const [, getKeys] = useKeyboardControls()
  const generalKeyHeld = useRef<boolean>(false)
  const jumpForce = useRef<number | null>(null)

  const getInputs = (): Inputs => {
    const { forwardKey, backwardKey, leftKey, rightKey, jumpKey, interactKey, inventoryLeftKey, inventoryRightKey, inventoryUseKey, shiftKey, aimUpKey, aimLeftKey, aimRightKey, aimDownKey, outfitPrev, outfitNext } = getKeys()
    const gamepadValid = gamepadRef && gamepadRef.current

    let shift = false
    if (shiftKey) shift = true

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
    if (Math.abs(dX) >= 1 && Math.abs(dY) >= 1) {
      dX *= 0.7
      dY *= 0.7
    }

    let jump = false
    if (gamepadValid) {
      if (gamepadRef.current?.jump) jump = true
    }
    if (jumpKey) jump = true

    let outfitD = 0
    if (outfitPrev && !generalKeyHeld.current) outfitD = -1
    else if (outfitNext && !generalKeyHeld.current) outfitD = 1

    let interact = false
    if (interactKey && !generalKeyHeld.current) interact = true

    if (outfitNext || outfitPrev || inventoryLeftKey || inventoryRightKey || interactKey) generalKeyHeld.current = true
    else generalKeyHeld.current = false

    return { shift, dX, dY, aX, aY, jump, outfitD, interact }
  }

  const damaged = (flag: any) => {
    if (!group.current) return

    const dmgStatus = takeDamage(flag)
    if (dmgStatus==="damaged") {
      playAudio("./audio/f-hurt.ogg", 0.3)
      anim.current = "Take Damage"
      
      if (group.current.userData.health <= 0) {
        // game over
        anim.current = "Dying"
        setTimeout(()=>{
          // setMode(0)
        }, 1000)
      }

      console.log(group.current.userData.health ?? 200)
      setHudInfo({
        health: group.current.userData.health ?? 200
      })
    }
  }
  
  const isUnskippableAnimation = () => {
    const a = anim.current
    if (a === "Fall") return true
    if (a === "Fight Jab") return true
    if (a === "Fight Roundhouse") return true
    if (a === "Fight Straight") return true
    if (a === "Jump") return true
    if (a === "Land") return true
    if (a === "Pistol Fire") return true
    if (a === "Take Damage") return true
    if (a === "Dying") return true
    if (a === "Stunned") return true

    return false
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

    if (inputs.dX || inputs.dY)
    {
      let walking = false
      let injured = false
      let speed = 4
      if (group.current.userData.health < 35) {
        walking = true
        injured = true
      }
      if (inputs.shift) walking = true
      if (walking)  speed *= 0.5

      let dx = 0
      let dy = 0
      if (inputs.dX) {
        dx += inputs.dX * speed * delta
      }
      if (inputs.dY) {
        dy += inputs.dY * speed * delta
      }
      const outOfBounds = moveInBounds(dx, dy)
      rotateToVec(inputs.dX, inputs.dY)

      if (!isUnskippableAnimation()) anim.current = walking? injured? "WalkingHurt" : "Walking" : "Jogging"
      transition.current = walking? injured? "WalkingHurt" : "Walking" : "Jogging"

      if (outOfBounds !== null && arenaClear) {
        // console.log(outOfBounds)
        if (outOfBounds === 0 && lvl.pathLeft === "open") {
          setLevel([level[0], level[1] - 1])
          group.current.position.x = 16
        }
        else if (outOfBounds === 1 && lvl.pathUp === "open") {
          setLevel([level[0] + 1, level[1]])
          group.current.position.z = 16
        }
        if (outOfBounds === 2 && lvl.pathRight === "open") {
          setLevel([level[0], level[1] + 1])
          group.current.position.x = -10
        }
        else if (outOfBounds === 3 && lvl.pathDown === "open") {
          setLevel([level[0] - 1, level[1]])
          group.current.position.z = -0
        }
      }
    }
    else {
      if (!isUnskippableAnimation()) anim.current = "Idle"
      transition.current = "Idle"
    }
  }
  
  const jumping = (inputs: Inputs, delta: number) => {
    if (!group.current) return

    if (jumpForce.current === null) {
      // player is grounded
      if (isUnskippableAnimation()) return
      if (inputs.aX || inputs.aY) return
      if (inputs.jump) {
        jumpForce.current = 0.09
        anim.current = "Jump"
      }
    }
    else {
      // player is jumping
      jumpForce.current -= delta * 0.15
      group.current.position.y += jumpForce.current
      if (group.current.position.y <= 0) {
        // player has landed
        group.current.position.y = 0
        anim.current = "Land"
        jumpForce.current = null
      }
    }
  }

  useEffect(()=>{
    if (!group.current) return

    group.current.userData.enemies = []
    setPlayer(group)
  }, [group, setPlayer])

  useFrame((_state,delta) => {
    const inputs = getInputs()

    // Check Flags
    if (group.current?.userData.actionFlag) {
      group.current.userData.actionFlag = null
    }
    if (group.current?.userData.dmgFlag) {
      damaged(group.current.userData.dmgFlag)
      group.current.userData.dmgFlag = null
    }

    movement(inputs, delta)
    jumping(inputs, delta)

    updateInventory(inputs)
    
    if (inputs.interact) console.log(group.current?.userData.enemies)
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