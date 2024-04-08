import React, { useContext } from "react";
import whack_a_plane from "../assets/images/whack-a-plane/whackAPlane.gif";
import battle_ship from "../assets/images/battleship/battleship.gif";
import { UserInfoContext } from "../App";
import GameCard from "../components/GameCard";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";

function Games() {
  const [dialogBox, setDialogBox] = React.useState("");
  const removeDialogBox = () => setDialogBox("");
  const { user } = useContext(UserInfoContext);

  return (
    <div className="px-28">
      <div className="flex flex-row justify-end gap-8 py-7">
        {user ? (
          <p className="">Welcome, {user}</p>
        ) : (
          <>
            <button
              onClick={() => setDialogBox("signup")}
              className="hover:underline"
            >
              signup
            </button>
            <button
              onClick={() => setDialogBox("signin")}
              className="hover:underline"
            >
              signin
            </button>
          </>
        )}
      </div>

      {dialogBox && (
        <>
          <div
            className="fixed top-0 left-0 h-screen w-screen bg-black/60 z-[1000]"
            onClick={removeDialogBox}
          />
          {dialogBox === "signin" ? (
            <SignIn
              success={removeDialogBox}
              callback={() => setDialogBox("signup")}
            />
          ) : (
            <SignUp
              success={removeDialogBox}
              callback={() => setDialogBox("signin")}
            />
          )}
        </>
      )}

      <div className="bg-neutral-800 h-[80vh] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-4 rounded-[10px]">
        <GameCard
          name="Battleship"
          href="/games/battleship"
          image={battle_ship}
          description="Destroy all the ships of your opponent!"
        />
        <GameCard
          name="Whack a Plane"
          href="/games/whack-a-plane"
          image={whack_a_plane}
          description="Whack the planes as they show up!"
        />
      </div>
    </div>
  );
}

export default Games;
