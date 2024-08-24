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
  ["SurvivorFGen", "Hair-WavyPunk", "Hair-TiedBack", "Pistol", "GownTop", "Shoes-HighTops001"],
  ["SurvivorFGen", "Hair-WavyPunk", "Hair-TiedBack", "Pistol", "GownTop", "Shoes-HighTops001"],
  ["SurvivorFGen", "Hair-WavyPunk", "Hair-TiedBack", "Pistol", "Shoes-HighTops001"],
]

interface Inputs {
  shift: boolean
  dX: number
  dY: number
  aX: number
  aY: number
  jump: boolean
  outfitD: number
  inventoryD: number
  inventoryUse: boolean
  interact: boolean
  map: boolean
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
  const [visibleNodes, setVisibleNodes] = useState(outfits[1])
  const outfit = useRef(1)
  const [skin, setSkin] = useState(1)
  const { setMode, options, arenaClear, level, setLevel, levels, setPlayer, inventory, inventorySlot, setInventorySlot, setInventory,playAudio } = useGameStore()
  const lvl = levels[level[0]][level[1]]

  const [, getKeys] = useKeyboardControls()
  const generalKeyHeld = useRef<boolean>(false)
  const jumpForce = useRef<number | null>(null)
  const targetedEnemy = useRef(null)

  const getInputs = (): Inputs => {
    const { forwardKey, backwardKey, leftKey, rightKey, jumpKey, interactKey, inventoryLeftKey, inventoryRightKey, inventoryUseKey, shiftKey, aimKey, aimUpKey, aimLeftKey, aimRightKey, aimDownKey, outfitPrev, outfitNext, controlModeKey, mapKey } = getKeys()
    const gamepadValid = gamepadRef && gamepadRef.current

    let shift = false
    if (shiftKey) shift = true

    // Movement and aiming
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

    // Single hand ctrls
    if (controlModeKey && !generalKeyHeld.current) {
      // setOptions(oneHand: !oneHand)
      useGameStore.setState((state) => ({
        options: {
          ...state.options,
          oneHand: !state.options.oneHand,
        },
      }));

    }
    if (options.oneHand) {
      const tX = dX
      const tY = dY
      dX = aX
      dY = aY
      aX = tX
      aY = tY
    }
    if (!aX && !aY && (aimKey)) {
      aX = dX
      aY = dY
    }

    // Make diagonals normalised
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

    let inventoryD = 0
    if ((inventoryLeftKey || gamepadRef?.current?.inventoryLeft) && !generalKeyHeld.current) inventoryD = -1
    else if ((inventoryRightKey || gamepadRef?.current?.inventoryRight) && !generalKeyHeld.current) inventoryD = 1

    let inventoryUse = false
    if (!generalKeyHeld.current) {
      if (inventoryUseKey) inventoryUse = true
      if (gamepadRef?.current?.inventoryUse) inventoryUse = true
    }

    let interact = false
    if (interactKey && !generalKeyHeld.current) interact = true

    let map = false
    if (!generalKeyHeld.current && (mapKey || gamepadRef?.current?.map)) map = true

    if (outfitNext || outfitPrev || inventoryLeftKey || inventoryRightKey || interactKey || inventoryUse || mapKey) generalKeyHeld.current = true
    else generalKeyHeld.current = false

    return { shift, dX, dY, aX, aY, jump, outfitD, inventoryD, inventoryUse, interact, map }
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
          setMode(0)
        }, 1000)
      }

      useGameStore.setState((state) => ({
        hudInfo: {
          ...state.hudInfo,
          health: group.current?.userData.health ?? 100
        }
      }))
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
    if (a === "Pistol Fire2") return true
    if (a === "Take Damage") return true
    if (a === "Dying") return true
    if (a === "Stunned") return true

    return false
  }

  const updateInventory = (inputs: Inputs) => {
    if (!group.current) return

    if (inputs.inventoryD) {
      let newSlot = inventorySlot + inputs.inventoryD
      if (newSlot < 0) newSlot = inventory.length - 1
      else if (newSlot >= inventory.length) newSlot = 0
      setInventorySlot(newSlot)
    }

    if (inputs.inventoryUse) {
      const removeItem = () => {
        const tempInv = [...inventory]
        tempInv[inventorySlot].amount -= 1
        if (tempInv[inventorySlot].amount <= 0) {
          tempInv[inventorySlot].name = ""
        }
        setInventory(tempInv)
      }

      const item = inventory[inventorySlot]
      if (item && item.name !== "") {
        if (item.name === "stun grenade") {
          group.current.userData.enemies.forEach((z)=>{
            z.current.userData.actionFlag = "Stunned"
          })
          removeItem()
          playAudio("./audio/gun-cocking.wav", 0.9)
        }
        else if (item.name === "health kit") {
          group.current.userData.health += 50
          if (group.current.userData.health > 100) group.current.userData.health = 100
          useGameStore.setState((state) => ({
            hudInfo: {
              ...state.hudInfo,
              health: group.current?.userData.health ?? 100
            }
          }))
          removeItem()
        }
      }
    }

    if (inputs.outfitD) {
      let newOutfit = outfit.current + inputs.outfitD
      if (newOutfit < 0) newOutfit = outfits.length-1
      else if (newOutfit >= outfits.length) newOutfit = 0
      outfit.current = newOutfit
      setVisibleNodes(outfits[outfit.current])

      if ([1,3].includes(newOutfit)) setSkin(1)
      else setSkin(0)
    }

    if (inputs.map) {
      useGameStore.setState((state) => ({
        hudInfo: {
          ...state.hudInfo,
          showMap: !state.hudInfo.showMap
        }
      }))
    }
  }

  const kick = () => {
    let canKick = true
    if (isUnskippableAnimation()) canKick = false
    if (["Pistol Fire", "Pistol Fire2"].includes(anim.current)) canKick = true

    if (!canKick) return

    if (targetedEnemy.current) {
      const zombie = group.current.userData.enemies.find(z => z.current.id === targetedEnemy.current)
      if (zombie.current.position.distanceTo(group.current.position) < 2.0) { 
        setTimeout(() => { 
          zombie.current.userData.actionFlag = "kicked"
        }, 350)
      }
    }

    anim.current = "Fight Roundhouse"
  }

  const shoot = () => {
    if (isUnskippableAnimation()) return
    // console.log(anim.current)
    anim.current = "Pistol Fire2"

    if (targetedEnemy.current) {
      let dmg = 20
      if (inventory[inventorySlot].name === "power ammo") {
        dmg *= 4
        const tempInventory = [...inventory]
        tempInventory[inventorySlot].amount -= 1
        if (tempInventory[inventorySlot].amount <= 0) {
          tempInventory[inventorySlot].name = ""
          tempInventory[inventorySlot].amount = 0
        }
        setInventory(tempInventory)
        playAudio("./audio/pistol-gunshot.wav", 0.25)
        anim.current = "Pistol Fire"
      }
      else {
        playAudio("./audio/pistol-gunshot.wav", 0.14)
      }

      // debugger
      const enemy = group.current.userData.enemies.find(z => z.current.id === targetedEnemy.current)
      enemy.current.userData.dmgFlag = {
        dmg: dmg,
        position: group.current.position,
        range: null,
      }
    }
  }
    
  const lockOnEnemy = (dx:number, dy:number) => {
    if (!group.current)
      return { x: dx, y: dy }

    let closestEnemy = null;
    let closestDistance = Infinity;
    let closestAngle = Infinity;
    targetedEnemy.current = null

    // Loop through all enemies to find the closest one in the direction the player is facing
    group.current.userData.enemies.forEach(e => {
      if (!e.current) return

      const enemy = e.current
      if (enemy.userData.health <= 0) return
      
      // Get enemy position
      const ex = enemy.position.x;
      const ez = enemy.position.z;

      // Calculate vector from player to enemy
      const vx = ex - group.current.position.x;
      const vz = ez - group.current.position.z;

      // Calculate distance to enemy
      const distance = Math.sqrt(vx * vx + vz * vz);

      // Normalize the direction vector the player is facing
      const len = Math.sqrt(dx * dx + dy * dy);
      const ndx = dx / len;
      const ndy = dy / len;

      // Normalize the vector to the enemy
      const lenEnemy = Math.sqrt(vx * vx + vz * vz);
      const evx = vx / lenEnemy;
      const evz = vz / lenEnemy;

      // Calculate the angle between the player's direction and the vector to the enemy
      const dotProduct = ndx * evx + ndy * evz;
      const angle = Math.acos(dotProduct);

      // Check if this enemy is the closest in the direction the player is facing
      if (angle < Math.PI / 4 && distance < closestDistance && angle < closestAngle) { // You can adjust the angle threshold (Math.PI / 4) as needed
        closestEnemy = { x: vx, y: vz };
        closestDistance = distance;
        closestAngle = angle;
        targetedEnemy.current = enemy.id
      }
    });

    // If no enemy is close enough in the direction, return the original direction
    if (!closestEnemy) {
      return { x: dx, y: dy }
    }

    return closestEnemy
  }
  const aim = (inputs: Inputs) => {
    // console.log("aiming")
    transition.current = "Pistol Aim2"
    if (jumpForce.current !== null) return
    let dx = inputs.aX
    let dy = inputs.aY

    const eLock = lockOnEnemy(dx, dy)
    dx = eLock.x
    dy = eLock.y

    rotateToVec(dx, dy)

    // console.log(targetedEnemy.current)
    if (targetedEnemy.current) {
      if (inputs.jump) {
        // console.log("kicking")
        kick()
      } else {
        // console.log("shooting")
        shoot()
      }
    } 
    else {
      if (!isUnskippableAnimation()) {
        // console.log("aiming")
        anim.current = "Pistol Aim2"
      }
    }
  }

  const movement = (inputs: Inputs, delta: number, ground: string|null) => {
    if (group.current === null) return

    if (inputs.aX || inputs.aY) {
      aim(inputs)
      return
    }

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
      if (ground === "net") speed *= 0.3

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

      let moveAnim = "Jogging"
      if (walking) moveAnim = "Walking"
      if (injured) moveAnim = "WalkingHurt"
      if (ground === "net") moveAnim = "WalkingWade"
      if (!isUnskippableAnimation()) anim.current = moveAnim
      transition.current = moveAnim

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
  
  const jumping = (inputs: Inputs, delta: number, ground: string|null) => {
    if (!group.current) return

    if (jumpForce.current === null) {
      // player is grounded
      if (isUnskippableAnimation()) return
      if (ground === "net") return
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
    let ground = null
    if (group.current?.userData.actionFlag) {
      group.current.userData.actionFlag = null
    }
    if (group.current?.userData.dmgFlag) {
      damaged(group.current.userData.dmgFlag)
      group.current.userData.dmgFlag = null
    }
    if (group.current?.userData.groundFlag) {
      ground = group.current.userData.groundFlag
      group.current.userData.groundFlag = null
    }

    movement(inputs, delta, ground)
    jumping(inputs, delta, ground)

    updateInventory(inputs)
    
    // if (inputs.interact) console.log(group.current?.userData.enemies)
  })

  return (
    <>
      <SurvivorModel
        visibleNodes={visibleNodes}
        skin={skin}
        anim={anim}
        transition={transition}
      />
    </>
  )
}

export default Player