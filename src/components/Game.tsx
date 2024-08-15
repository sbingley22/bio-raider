import { Canvas } from "@react-three/fiber"
import { MutableRefObject, Suspense, } from "react"
import { GamepadState } from "./useGamepad"
import { useGameStore } from "./useGameStore"
import Arena from "./Arena"

interface GameProps {
  gamepadRef: MutableRefObject<GamepadState>
}

const Game: React.FC<GameProps> = ({ gamepadRef }) => {
  const { levelImg } = useGameStore()

  return (
    <div className="w-full h-full"
      style={{
        backgroundImage: `url(./bgs/${levelImg})`, 
        // backgroundImage: `url(./bgs/)`, 
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
          />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default Game