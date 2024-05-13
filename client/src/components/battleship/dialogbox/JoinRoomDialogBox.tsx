import React from "react";
import Button from "../../Button";

function JoinRoomDialogBox({
  removeDialogbox,
  room,
  setRoom,
  handleJoinGivenRoom,
}: {
  removeDialogbox: () => void;
  room: string | null;
  setRoom: React.Dispatch<React.SetStateAction<string | null>>;
  handleJoinGivenRoom: () => void;
}) {
  return (
    <>
      <div
        onClick={removeDialogbox}
        className="bg-black/60 h-screen w-screen fixed top-0 left-0 z-[1000]"
      />
      <div className="h-[30vh] top-[35vh] left-[20vw] w-[60vw] fixed z-[1005] bg-white rounded-xl flex flex-col gap-5 p-7 text-center">
        <p>Enter room code to join </p>
        <input
          value={room as string}
          onChange={(e) => setRoom(e.target.value)}
          className="outline outline-black p-2 rounded-md w-[90%] mx-auto"
        />
        <div>
          <Button
            style={{}}
            className=""
            callback={() => handleJoinGivenRoom()}
            theme="green"
            disabled={room ? room.length < 1 : true}
            text="Join Room"
          />
        </div>
      </div>
    </>
  );
}

export default JoinRoomDialogBox;
