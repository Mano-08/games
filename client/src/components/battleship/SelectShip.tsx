import React from "react";
import Button from "../Button";
import { PropShip } from "../../types/types";

function SelectShip({
  vertical,
  myShips,
  isPlayerReady,
  handleSelectShip,
  handleResetBoard,
  handleSendReadyMessage,
  allShipsPlaced,
}: {
  vertical: boolean;
  myShips: PropShip[];
  isPlayerReady: boolean;
  handleSelectShip: (ship: PropShip) => void;
  handleResetBoard: () => void;
  handleSendReadyMessage: () => void;
  allShipsPlaced: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 py-2">
      <h1 className="font-bold">
        Select Ship {vertical ? <span>&#8595;</span> : <span>&#8594;</span>}
      </h1>
      <div className="flex flex-col gap-2">
        {myShips.map((ship) => (
          <button
            key={ship.id}
            className="text-left rounded-md hover:outline outline-black outline-2 px-2 py-1"
            onClick={() => !ship.placed && handleSelectShip(ship)}
            style={
              ship.selected
                ? { background: "white" }
                : ship.placed
                ? { background: "gray" }
                : {}
            }
          >
            {ship.id}-{ship.length}
          </button>
        ))}
      </div>
      <Button
        theme="reset"
        text="Reset"
        className="mt-10"
        style={{
          cursor: isPlayerReady ? "not-allowed" : "pointer",
        }}
        disabled={isPlayerReady}
        callback={handleResetBoard}
      />
      <Button
        className=""
        theme="green"
        text="Ready!"
        disabled={!allShipsPlaced || isPlayerReady}
        style={{
          cursor: !allShipsPlaced || isPlayerReady ? "not-allowed" : "pointer",
        }}
        callback={handleSendReadyMessage}
      />
    </div>
  );
}

export default SelectShip;
