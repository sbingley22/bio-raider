import { Environment } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { MutableRefObject, SetStateAction, Suspense, Dispatch } from "react"
import ShadowCatcher from "./ShadowCatcher"
import Character from "./characters/Character"
import { GamepadState } from "./useGamepad"
import { useGameStore } from "./useGameStore"

interface GameProps {
  // setMode: (mode: number) => void
  //setMode: React.Dispatch<React.SetStateAction<number>>;
  gamepadRef: MutableRefObject<GamepadState>
  // options: { altCost: number }
  // setOptions: Dispatch<SetStateAction<{ altCost: number }>>
}

const Game: React.FC<GameProps> = ({ gamepadRef }) => {
  const { setMode, options, setOptions } = useGameStore()

  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas
          camera={{
            position: [0, 8, 8],
            fov: 20,
          }}
        >
          <Environment preset="night" environmentIntensity={4} />
          <ShadowCatcher />
          <directionalLight castShadow position={[0, 10, 0]} intensity={0.1} />

          <Character 
            type="Player"
            gamepadRef={gamepadRef}
          />

        </Canvas>
      </Suspense>
    </div>
  )
}

export default Game