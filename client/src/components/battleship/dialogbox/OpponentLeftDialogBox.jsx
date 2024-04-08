import Button from "../../Button";

function OpponentLeftDialogBox({ handleExitGame }) {
  return (
    <>
      <div className="bg-black/60 h-screen w-screen fixed top-0 left-0 z-[1000]" />
      <div className="h-[30vh] top-[35vh] left-[20vw] text-center w-[60vw] fixed z-[1005] bg-white rounded-xl">
        <div className="flex flex-col p-7 gap-6">
          <p>Your opponent has left the room</p>
          <div className="flex justify-center">
            <Button
              theme="red"
              text="Exit Room"
              callback={() => handleExitGame()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default OpponentLeftDialogBox;
