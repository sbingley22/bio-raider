// useGamepad.js
import { useRef } from "react"

export interface GamepadState {
  moveX: number
  moveY: number;
  aimX: number;
  aimY: number;
  jump: boolean;
  interact: boolean;
  inventoryLeft: boolean;
  inventoryRight: boolean;
  inventoryUse: boolean;
}

const useGamepad = () => {
  const gamepadRef = useRef<GamepadState>({
    moveX: 0,
    moveY: 0,
    aimX: 0,
    aimY: 0,
    jump: false,
    interact: false,
    inventoryLeft: false,
    inventoryRight: false,
    inventoryUse: false,
  });

  const handleGamepadButtonDown = (buttonName: string) => {
    if (!buttonName) return;
    // console.log(`Button ${buttonName} pressed`);

    switch (buttonName) {
      case "A":
        gamepadRef.current.jump = true;
        break;
      case "X":
        gamepadRef.current.interact = true;
        break;
      case "DPadLeft":
        gamepadRef.current.inventoryLeft = true;
        break;
      case "DPadRight":
        gamepadRef.current.inventoryRight = true;
        break;
      case "DPadUp":
        gamepadRef.current.inventoryUse = true;
        break;
      default:
        break;
    }
  }

  const handleGamepadButtonUp = (buttonName: string) => {
    if (!buttonName) return;
    // console.log(`Button ${buttonName} released`);

    switch (buttonName) {
      case "A":
        gamepadRef.current.jump = false;
        break;
      case "X":
        gamepadRef.current.interact = false;
        break;
      case "DPadLeft":
        gamepadRef.current.inventoryLeft = false;
        break;
      case "DPadRight":
        gamepadRef.current.inventoryRight = false;
        break;
      case "DPadUp":
        gamepadRef.current.inventoryUse = false;
        break;
      default:
        break;
    }
  }

  const handleGamepadAxisChange = (axisName: string, value: number) => {
    switch (axisName) {
      case "LeftStickX":
        gamepadRef.current.moveX = value;
        break;
      case "LeftStickY":
        gamepadRef.current.moveY = value;
        break;
      case "RightStickX":
        gamepadRef.current.aimX = value;
        break;
      case "RightStickY":
        gamepadRef.current.aimY = value;
        break;
      default:
        break;
    }
  }

  const handleConnect = (gamepadIndex: number) => {
    console.log(`Gamepad ${gamepadIndex} connected!`);
  };

  const handleDisconnect = (gamepadIndex: number) => {
    console.log(`Gamepad ${gamepadIndex} disconnected!`);
  };

  return {
    gamepadRef,
    handleGamepadButtonDown,
    handleGamepadButtonUp,
    handleGamepadAxisChange,
    handleConnect,
    handleDisconnect,
  }
}

export default useGamepad
