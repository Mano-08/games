import Button from "../../Button";
import React from "react";

interface PropDisplay {
  display: boolean;
  regarding: string;
  data: null | string;
}

function CreateRoomDialogBox({
  CopyToClipBoard,
  removeDialogbox,
  display,
}: {
  CopyToClipBoard: () => void;
  removeDialogbox: () => void;
  display: PropDisplay;
}) {
  return (
    <>
      <div className="bg-black/60 h-screen w-screen fixed top-0 left-0 z-[1000]" />
      <div className="h-[40vh] top-[30vh] left-[20vw] w-[60vw] flex flex-col justify-between p-7 text-center fixed z-[1005] bg-white rounded-xl">
        <div className="flex flex-col gap-4">
          <p>Share this room ID to your friend</p>
          <Button
            style={{}}
            disabled={false}
            callback={CopyToClipBoard}
            theme="gray"
            className="w-[90%] mx-auto"
            text={display.data as string}
          />
        </div>
        <div className="flex justify-center">
          <Button
            className=""
            disabled={false}
            style={{}}
            callback={removeDialogbox}
            theme="red"
            text="Close"
          />
        </div>
      </div>
    </>
  );
}

export default CreateRoomDialogBox;
