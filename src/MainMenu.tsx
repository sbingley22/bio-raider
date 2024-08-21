
import { useGameStore } from "./components/useGameStore";

const MainMenu = ({ gamepadRef }) => {
  const { setMode, options, setOptions } = useGameStore()

  return (
    <div 
      className="text-white w-full h-full flex flex-col items-center p-12 bg-cover bg-center bg-[url('./imgs/menuStill.jpg')]"
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

    </div>
  )
}

export default MainMenu
