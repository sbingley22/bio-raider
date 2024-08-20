import React, { useEffect, useRef } from "react"
import glb from "../assets/reProps.glb?url"
import { useGLTF } from "@react-three/drei"
import { clone } from "three/examples/jsm/utils/SkeletonUtils"

const ItemProps: React.FC<{
  visibleNodes: Array<string>
}> = ({ visibleNodes }) => {
  const { scene } = useGLTF(glb)
  const sceneRef = useRef()

  // Clone scene to create unique instances
  // Initial Setup
  useEffect(() => {
    if (scene) {
      sceneRef.current = clone(scene)
    }

    sceneRef.current.traverse((node) => {
      // console.log(node.name)
      if (node.isMesh) {
        node.visible = false
        node.castShadow = true
      }
    })
  }, [scene])

  // Set visible nodes
  useEffect(() => {
    if (!sceneRef.current || !visibleNodes) return

    visibleNodes.forEach((vn) => {
      const node = sceneRef.current.getObjectByName(vn)
      if (!node) return

      node.visible = true
      if (node.isGroup) {
        node.children.forEach((child) => {
          child.visible = true
        })
      }
    })
  }, [visibleNodes])

  return (
    <group>
      {sceneRef.current && <primitive object={sceneRef.current} />}
    </group>
  )
}

export default ItemProps