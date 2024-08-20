import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import glb from "../../assets/survivor.glb?url"
import { useSkinnedMeshClone } from "./SkinnedMeshClone"
import { useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const SurvivorModel: React.FC<{
  visibleNodes: Array<string>,
  skin: number,
  anim: MutableRefObject<string | null>,
  transition: MutableRefObject<string | null>
}> = ({ visibleNodes, skin, anim, transition }) => {
  const { scene, nodes, animations, materials } = useSkinnedMeshClone(glb)
  const { actions, mixer } = useAnimations(animations, scene)
  const lastAnim = useRef(anim.current)
  const [skins, setSkins] = useState<Array<any>>([])

  // Initial setup
  useEffect(()=>{
    console.log(nodes, actions)

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") { 
        node.visible = false
        node.castShadow = true
      }
    })

    if (actions["Idle"]) {
      actions["Idle"].play()
    }

    const tempSkins = [...skins]
    if (nodes["SurvivorF"]?.material && !tempSkins.includes(nodes["SurvivorF"].material)) {
      tempSkins.push(materials[nodes["SurvivorF"].material.name])
    }
    if (nodes["SurvivorFGen"]?.material && !tempSkins.includes(nodes["SurvivorFGen"].material)) {
      tempSkins.push(materials[nodes["SurvivorFGen"].material.name])
    }
    setSkins(tempSkins)

  }, [nodes, actions, materials])

  // Set visible nodes
  useEffect(()=>{
    if (!visibleNodes) return

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") node.visible = false
    })

    visibleNodes.forEach(vn => {
      const node = nodes[vn]
      if (!node) return

      node.visible = true
      if (node.type === "Group") {
        node.children.forEach((child: { visible: boolean }) => {
          child.visible = true
        })
      }
    })
  }, [visibleNodes, nodes])

  // Change Skin
  useEffect(()=>{
    if (skin === null) return
    if (!skins || skins.length < 1) return
    if (skin >= skins.length) return

    // if (skin === 1) debugger
    nodes["SurvivorF"].material = skins[skin]
    nodes["SurvivorFGen"].material = skins[skin]

  }, [skin, skins, nodes])

  // Mixer Settings
  useEffect(()=>{
    if (!mixer) return
    if (actions === null) return

    const oneShotAnims = ["Fight Jab", "Fight Roundhouse", "Fight Straight", "Jump", "Land", "Pistol Fire", "Pistol Fire2", "Take Damage", "Dying", "Stunned"]
    oneShotAnims.forEach(osa => {
      if (actions[osa] === null) return
      actions[osa].clampWhenFinished = true
      actions[osa].repetitions = 1
    })

    const animFinished = (e) => {
      const action = e.action.getClip().name
      // console.log(action)
      // debugger

      if (action === "Pistol Fire") {
        if (anim.current === "Fight Roundhouse") return
        anim.current = "Pistol Aim"
        return
      }
      if (action === "Pistol Fire2") {
        if (anim.current === "Fight Roundhouse") return
        anim.current = "Pistol Aim2"
        return
      }
      if (action === "Fight Roundhouse") {
        anim.current = "Pistol Aim2"
        return
      }
      if (action === "Jump") {
        anim.current = "Fall"
        return
      }
      if (action === "Land") {
        anim.current = transition.current 
        return
      }
      if (action === "Take Damage") {
        if (transition.current) anim.current = transition.current
      }
      if (action === "Dying") {
        return
      }

      anim.current = "Idle"
    }

    mixer.addEventListener("finished", animFinished)

    return () => mixer.removeEventListener("finished", animFinished)
  }, [mixer, actions, anim, transition])

  const getFadeTime = () => {
    let trans = 0.1
    if (anim.current === "WalkingStagger" && lastAnim.current === "Idle") trans = 0.2
    if (anim.current === "Idle" && lastAnim.current === "WalkingStagger") trans = 0.2

    return trans
  }

  // Update Animations
  const updateAnimations = () => {
    if (anim.current === lastAnim.current) return
    // console.log(anim.current)
    // debugger

    if (!actions) return
    if (!lastAnim.current) lastAnim.current = ""
    if (!anim.current) anim.current = "Idle"

    const fadeTime = getFadeTime()

    const lastAction = actions[lastAnim.current]
    const currentAction = actions[anim.current]

    if (lastAction) lastAction.fadeOut(fadeTime)
    if (currentAction) currentAction.reset().fadeIn(fadeTime).play()

    lastAnim.current = anim.current
  }

  // Game Loop
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useFrame((_state, _delta) => {
    updateAnimations()
  })
  
  return (
    <>
      <primitive object={scene} />
    </>
  )
}

export default SurvivorModel