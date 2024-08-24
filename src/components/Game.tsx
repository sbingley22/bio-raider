import { Canvas } from "@react-three/fiber"
import { MutableRefObject, Suspense, useEffect, } from "react"
import { GamepadState } from "./useGamepad"
import { useGameStore } from "./useGameStore"
import Arena from "./Arena"
import Hud from "./Hud"

interface GameProps {
  gamepadRef: MutableRefObject<GamepadState>
  loadGame: boolean
}

const Game: React.FC<GameProps> = ({ gamepadRef, loadGame=false }) => {
  const { levelImg } = useGameStore()

  return (
    <div className="w-full h-full"
      style={{
        // backgroundImage: `url(./bgs/${levelImg})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center"
      }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas
          camera={{
            position: [0, 8, 8],
            fov: 50,
          }}
          shadows
        >
          <Arena 
            gamepadRef={gamepadRef}
            loadGame={loadGame}
          />
        </Canvas>
      </Suspense>

      <Hud />
    </div>
  )
}

export default Game