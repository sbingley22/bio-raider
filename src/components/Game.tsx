import { Environment } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { MutableRefObject, Suspense } from "react"
import ShadowCatcher from "./ShadowCatcher"
import Character from "./characters/Character"
import { GamepadState } from "./useGamepad"

interface GameProps {
  setMode: (mode: number) => void
  //setMode: React.Dispatch<React.SetStateAction<number>>;
  gamepadRef: MutableRefObject<GamepadState>
}

const Game: React.FC<GameProps> = ({ setMode, gamepadRef }) => {

  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas
          camera={{
            position: [0, 4, 4],
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