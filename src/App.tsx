import Game from "./components/Game"
import useGamepad from "./components/useGamepad"
import { KeyboardControls } from "@react-three/drei"
import Gamepad from "react-gamepad"
import { useGameStore } from "./components/useGameStore"
import MainMenu from "./components/MainMenu"

function App() {
  const { mode } = useGameStore()
  
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
          { name: "aimKey", keys: ["Space"] },
          { name: "jumpKey", keys: ["'", ";", "Shift"] },
          { name: "interactKey", keys: ["f", "F", "h", "H"] },
          { name: "inventoryLeftKey", keys: ["[", "1"] },
          { name: "inventoryRightKey", keys: ["]", "2"] },
          { name: "inventoryUseKey", keys: ["p", "o", "P", "O", "q", "Q"] },
          { name: "shiftKey", keys: ["v", "V", "n", "N"] },
          { name: "aimUpKey", keys: ["i", "I"] },
          { name: "aimDownKey", keys: ["k", "K"] },
          { name: "aimLeftKey", keys: ["j", "J"] },
          { name: "aimRightKey", keys: ["l", "L"] },
          { name: "outfitPrev", keys: ["9"] },
          { name: "outfitNext", keys: ["0"] },
          { name: "controlModeKey", keys: ["7", "5"]},
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
                <MainMenu
                  gamepadRef={gamepadRef}
                />
              </>
            }
            
            {mode === 1 &&
              <>
                <Game
                  gamepadRef={gamepadRef}
                  loadGame={false}
                />
              </>
            }
            
            {mode === 2 &&
              <>
                <Game
                  gamepadRef={gamepadRef}
                  loadGame={true}
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
