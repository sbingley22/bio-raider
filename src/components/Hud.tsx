import React from 'react'
import { useGameStore } from './useGameStore'

const Hud = () => {
  const { arenaClear, level, levels } = useGameStore()
  const lvl = levels[level[0]][level[1]]
  const pathUp = lvl.pathUp === "open"
  const pathDown = lvl.pathDown === "open"
  const pathLeft = lvl.pathLeft === "open"
  const pathRight = lvl.pathRight === "open"

  return (
    <div className='h-full w-full'>
      { arenaClear && <>
        {pathUp && <div className='absolute top-0 left-0 m-0 w-full h-10 bg-gradient-to-b from-green-700 to-transparent' />}
        {pathDown && <div className='absolute bottom-0 left-0 m-0 w-full h-10 bg-gradient-to-t from-green-700 to-transparent' />}
        {pathLeft && <div className='absolute top-0 left-0 m-0 w-10 h-full bg-gradient-to-r from-green-700 to-transparent' />}
        {pathRight && <div className='absolute top-0 right-0 m-0 w-10 h-full bg-gradient-to-l from-green-700 to-transparent' />}
      
      </>}
    </div>
  )
}

export default Hud