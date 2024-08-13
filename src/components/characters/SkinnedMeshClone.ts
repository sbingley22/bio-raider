import { useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { Group, Material, AnimationClip, Object3D } from 'three'

export function useSkinnedMeshClone(path: string): {
  scene: Group;
  materials: { [key: string]: Material }
  animations: AnimationClip[]
  nodes: { [key: string]: Object3D}
} {
  const {scene, materials, animations} = useGLTF(path)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes} = useGraph(clonedScene)

  return {scene: clonedScene, materials, animations, nodes}
}

// This custom hook allows three js skinnedMesh GLBs to be reused.