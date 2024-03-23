import React from "react";
import navyShip from "../assets/images/navyship.png";
import Button from "../components/Button";

function Battleship() {
  const [gameStatus, setGameStatus] = React.useState("uninitiated");
  const handleStart = () => {
    console.log("clicked start");
  };
  return (
    <>
      {gameStatus === "uninitiated" && (
        <main className="w-screen h-screen overflow-hidden px-[25vw] py-5">
          <div className="flex flex-col gap-3 p-4 items-center outline outline-2 outline-black rounded-2xl bg-sky-200/50 backdrop-blur-sm	">
            <img
              src={navyShip}
              alt="main"
              className="w-[15vw] h-auto rounded-2xl"
            />
            <div>
              <h1 className="font-bold underline py-4">Rules:</h1>
              <ul className="text-gray-600 flex flex-col gap-1">
                <li className="flex flex-row items-start gap-2">
                  <div>-</div>
                  <div>
                    The game lasts for 75 seconds and the player needs to hit
                    the planes on screen.
                  </div>
                </li>
                <li className="flex flex-row items-start gap-2">
                  <div>-</div>
                  <div>
                    Hitting golden planes gives out 20 points while that of
                    black planes gives out 10 points.
                  </div>
                </li>
                <li className="flex flex-row items-start gap-2">
                  <div>-</div>
                  <div>
                    There are also bombs which should be avoided, hitting a bomb
                    ends the game immediately.
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex flex-row items-center gap-5 my-4">
              <Button
                callback={() => handleStart()}
                theme="green"
                text="Join room"
              />
              <Button
                callback={() => handleStart()}
                theme="green"
                text="Create room"
              />
            </div>
          </div>
        </main>
      )}
      ;
    </>
  );
}

export default Battleship;
