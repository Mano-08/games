import React from "react";
import navyShip from "../../assets/images/battleship/navyship.png";
import Button from "../Button";

function LandingPage({
  handleJoinRoom,
  handleCreateRoom,
}: {
  handleJoinRoom: () => void;
  handleCreateRoom: () => void;
}) {
  return (
    <main className="w-screen h-screen overflow-hidden flex items-center justify-center px-[20vw]">
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
              <div>Two players place ships on a grid.</div>
            </li>
            <li className="flex flex-row items-start gap-2">
              <div>-</div>
              <div>
                They take turns guessing coordinates to sink opponent's hidden
                ships.
              </div>
            </li>
            <li className="flex flex-row items-start gap-2">
              <div>-</div>
              <div>The first to sink all enemy ships wins.</div>
            </li>
          </ul>
        </div>
        <div className="flex flex-row items-center gap-5 my-4">
          <Button
            className=""
            style={{}}
            disabled={false}
            callback={handleJoinRoom}
            theme="green"
            text="Join room"
          />
          <Button
            className=""
            style={{}}
            disabled={false}
            callback={handleCreateRoom}
            theme="green"
            text="Create room"
          />
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
