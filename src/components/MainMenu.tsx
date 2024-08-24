import { useState } from "react";
import { useGameStore } from "./useGameStore";

const MainMenu = ({ gamepadRef }) => {
  const { setMode, options, setOptions } = useGameStore()
  const [showHelp, setShowHelp] = useState(false)

  if (showHelp) return (
    <div
      className="text-white w-full h-full m-4 p-4"
      >
        <h1 className="text-3xl w-full text-center">How to Play:</h1>

        <div className="m-2 p-2">
          <p>Escape your body, battle autoimmunity!</p>
          <p>F / H / X = Interact and pickup items</p>
          <p>JKLI / Right Analogue = Aim</p>
          <p>[ ] / d-left / d-right = select item</p>
          <p>O / Q / d-up = use item</p>
          <p>; / ' / Shift / A = Jump or kick whilst aiming</p>
          <p>m / c = Show map</p>
        </div>

        <div 
          className="text-3xl p-2 m-4"
          style={{backgroundColor: "rgba(0,0,0,0.85)"}}
        >
          <button onClick={()=>setShowHelp(false)}>CLOSE</button>
        </div>

      </div>
  )
  return (
    <div 
      className="text-white w-full h-full flex flex-col items-center p-12 bg-cover bg-center bg-[url('./stills/menuStill.jpg')]"
    >
      <h1 
        className="text-5xl font-serif mb-6 p-4 rounded-lg border-red-900 border-8"
        style={{backgroundColor: "rgba(0,0,0,0.75)"}}
      >Bio Raider</h1>

      <div 
        className="text-3xl border-red-900 hover:border-red-800 border-2 rounded-md p-2 m-4"
        style={{backgroundColor: "rgba(0,0,0,0.85)"}}
      >
        <button onClick={()=>setMode(1)}>START</button>
      </div>

      <div 
        className="text-3xl border-red-900 hover:border-red-800 border-2 rounded-md p-2 m-4"
        style={{backgroundColor: "rgba(0,0,0,0.85)"}}
      >
        <button onClick={()=>setMode(2)}>CONTINUE</button>
      </div>

      <div 
        className="text-3xl border-red-900 hover:border-red-800 border-2 rounded-md p-2 m-4"
        style={{backgroundColor: "rgba(0,0,0,0.85)"}}
      >
        <button onClick={()=>setShowHelp(true)}>HOW TO PLAY</button>
      </div>

    </div>
  )
}

export default MainMenu
