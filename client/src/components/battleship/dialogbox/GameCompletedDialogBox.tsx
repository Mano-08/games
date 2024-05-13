import React from "react";
import Button from "../../Button";

function GameCompletedDialogBox({
  handleExitGame,
  winner,
}: {
  handleExitGame: () => void;
  winner: string;
}) {
  return (
    <>
      <div className="bg-black/60 h-screen w-screen fixed top-0 left-0 z-[1000]" />
      <div className="h-[30vh] top-[35vh] left-[20vw] text-center w-[60vw] fixed z-[1005] bg-white rounded-xl">
        <div className="flex flex-col p-7 gap-6">
          {winner === "player" ? (
            <p>Congratulations! great moves, Captain!</p>
          ) : (
            <p>Better luck next time, Captain!</p>
          )}
          <div className="flex justify-center">
            <Button
              theme="red"
              text="Exit"
              disabled={false}
              style={{}}
              className="w-[50%]"
              callback={handleExitGame}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GameCompletedDialogBox;
