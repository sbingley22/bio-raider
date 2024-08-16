import React, { MutableRefObject, useEffect, useRef } from 'react'
import glb from "../../assets/HumanoidCells.glb?url"
import { useSkinnedMeshClone } from "./SkinnedMeshClone"
import { useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const CharacterModel: React.FC<{
  visibleNodes: Array<string>,
  anim: MutableRefObject<string | null>,
  transition: MutableRefObject<string | null>
}>  = ({ visibleNodes, anim, transition}) => {
  const { scene, nodes, animations } = useSkinnedMeshClone(glb)
  const { actions, mixer } = useAnimations(animations, scene)
  const lastAnim = useRef(anim.current)

  // Initial setup
  useEffect(()=>{
    console.log(nodes, actions)

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") { 
        node.visible = false
        node.castShadow = true
        // node.frustumCulled = false
      }
    })

    if (actions["float idle"]) {
      actions["float idle"].play()
    }
  }, [nodes, actions])

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

  // Mixer Settings
  useEffect(()=>{
    if (!mixer) return
    if (actions === null) return

    const oneShotAnims = ["float dmg", "float jab"]
    oneShotAnims.forEach(osa => {
      if (actions[osa] === null) return
      actions[osa].clampWhenFinished = true
      actions[osa].repetitions = 1
    })

    const animFinished = (e) => {
      const action = e.action.getClip().name
      console.log("action finished", action)
      // debugger

      if (action === "float dmg") {
        anim.current = "float idle"
        if (transition.current) anim.current = transition.current
        return
      }
      if (action === "float jab") {
        anim.current = "float stance"
        return
      }
      if (action === "dying") {
        return
      }

      anim.current = "float idle"
    }

    mixer.addEventListener("finished", animFinished)

    return () => mixer.removeEventListener("finished", animFinished)
  }, [mixer, actions, anim, transition])

  const getFadeTime = () => {
    let trans = 0.1

    return trans
  }

  // Update Animations
  const updateAnimations = () => {
    if (anim.current === lastAnim.current) return
    // console.log(anim.current)
    // debugger

    if (!actions) return
    if (!lastAnim.current) lastAnim.current = ""
    if (!anim.current) anim.current = "float idle"

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

export default CharacterModel