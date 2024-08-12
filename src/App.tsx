import { useState } from "react"
import Game from "./components/Game"
import useGamepad from "./components/useGamepad"
import { KeyboardControls } from "@react-three/drei"
import Gamepad from "react-gamepad"

function App() {
  const [mode, setMode] = useState(1)
  
  // Use the custom useGamepad hook
  const {
    gamepadRef,
    handleGamepadButtonDown,
    handleGamepadButtonUp,
    handleGamepadAxisChange,
    handleConnect,
    handleDisconnect,
  } = useGamepad()

  return (
    <div className="dynamic-width">
      <KeyboardControls
        map={[
          { name: "forwardKey", keys: ["ArrowUp", "w", "W"] },
          { name: "backwardKey", keys: ["ArrowDown", "s", "S"] },
          { name: "leftKey", keys: ["ArrowLeft", "a", "A"] },
          { name: "rightKey", keys: ["ArrowRight", "d", "D"] },
          { name: "jumpKey", keys: ["Space"] },
          { name: "interactKey", keys: ["f", "F", "E", "e"] },
          { name: "inventoryLeftKey", keys: ["[", "1"] },
          { name: "inventoryRightKey", keys: ["]", "2"] },
          { name: "inventoryUseKey", keys: ["p", "o", "P", "O"] },
          { name: "shiftKey", keys: ["Shift"] },
          { name: "aimUpKey", keys: ["i", "I"] },
          { name: "aimDownKey", keys: ["k", "K"] },
          { name: "aimLeftKey", keys: ["j", "J"] },
          { name: "aimRightKey", keys: ["l", "L"] },
        ]}
      >
        <Gamepad
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onButtonDown={handleGamepadButtonDown}
          onButtonUp={handleGamepadButtonUp}
          onAxisChange={handleGamepadAxisChange}
        >
          <>
            {mode === 0 &&
              <>
                <h1 className="text-5xl font-bold underline">
                  Hello world!
                </h1>
              </>
            }
            
            {mode === 1 &&
              <>
                <Game
                  setMode={setMode}
                  gamepadRef={gamepadRef}
                />
              </>
            }
          </>
        </Gamepad>
      </KeyboardControls>
    </div>
  )
}

export default App
