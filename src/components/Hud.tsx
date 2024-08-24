import React from 'react'
import { useGameStore } from './useGameStore'
import jillHealthyImg from "../assets/status/jillHealthy2.png"
import jillHealthyImgDev from "../assets/dev/status/jillHealthy1.png"
import jillHurtImg from "../assets/status/jillHurt1.png"
import jillHurtImgDev from "../assets/dev/status/jillHurt2.png"
import { useEffect } from "react"

const nextAreaClass = "from-purple-700 to-transparent"

const Hud = () => {
  const { options, arenaClear, level, levels, hudInfo, setHudInfo, inventory, inventorySlot } = useGameStore()
  const lvl = levels[level[0]][level[1]]
  // console.log("Hud lvl", lvl, level, levels)
  const pathUp = lvl.pathUp === "open"
  const pathDown = lvl.pathDown === "open"
  const pathLeft = lvl.pathLeft === "open"
  const pathRight = lvl.pathRight === "open"

  let hudImg = options.altCost>2? jillHealthyImgDev : jillHealthyImg 
  let bgCol = "rgba(0,255,0,0.2)"
  if (hudInfo.health < 50) {
    hudImg = options.altCost>2? jillHurtImgDev : jillHurtImg
    bgCol = "rgba(255,0,0,0.2)"
  }
  else if (hudInfo.health < 75) bgCol = "rgba(133,133,0,0.2)"

  const imgSize = options.altCost>2 ? 256 : 128

  useEffect(()=>{
    const item = inventory[inventorySlot]
    if (!item || item.name === "") return

    let msg = "O/P/D-Up "
    if (item.name === "stun grenade") msg += "to use stun grenade"
    else if (item.name === "health kit") msg += "to use health kit"
    else if (item.name === "net spray") msg = "use net spray by walking on slime and recieve no damage"
    else if (item.name === "power ammo") msg = "shoot with power ammo to deal high dmg"

    useGameStore.setState((state) => ({
      hudInfo: {
        ...state.hudInfo,
        msg: msg
      },
    }));


  }, [inventory, inventorySlot, setHudInfo])

  return (
    <div className='h-full w-full'>
      { arenaClear && <>
        {pathUp && <div className={'absolute top-0 left-0 m-0 w-full h-10 bg-gradient-to-b ' + nextAreaClass} />}
        {pathDown && <div className={'absolute bottom-0 left-0 m-0 w-full h-10 bg-gradient-to-t ' + nextAreaClass} />}
        {pathLeft && <div className={'absolute top-0 left-0 m-0 w-10 h-full bg-gradient-to-r ' + nextAreaClass} />}
        {pathRight && <div className={'absolute top-0 right-0 m-0 w-10 h-full bg-gradient-to-l ' + nextAreaClass} />}
      </>}

      <img 
        className="absolute bottom-0 right-0 border-black border-4"
        style={{width: imgSize, height: imgSize, backgroundColor: bgCol}}
        src={hudImg} 
      />

      <p className="absolute bottom-0 left-0 m-2 text-green-500">{hudInfo.msg}</p>

      <div className="absolute top-0 left-0 m-0 text-yellow-50 flex w-full box-border justify-center items-center text-center">
        {inventory.map((inv, index) => (
          <p
            key={"inventory"+index}
            className={`${index===inventorySlot? "border-slate-500" : "border-slate-800"} p-1 m-1 bg-slate-950 border-2 inline-block flex-grow`}
          >{`${inv.name !== "" ? inv.name + " x" + inv.amount : ""}`}</p>
        ))}
      </div>

    </div>
  )
}

export default Hud