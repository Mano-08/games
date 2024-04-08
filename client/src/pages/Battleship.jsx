import React, { useEffect } from "react";
import io from "socket.io-client";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import navyShip from "../assets/images/battleship/navyship.png";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import { initialBoardConfig, allShips } from "../utils/initialBoardConfig";
import { UserInfoContext } from "../App";

const socket = io.connect("http://127.0.0.1:5000", {
  transports: ["websocket"],
});

function Battleship() {
  const { user } = React.useContext(UserInfoContext);
  const [selectedShip, setSelectedShip] = React.useState(null);
  const [vertical, setVertical] = React.useState(false);
  const [winner, setWinner] = React.useState(null);
  const [whoseTurn, setWhoseTurn] = React.useState(null);
  const [shipsWrecked, setShipsWrecked] = React.useState(0);
  const [torpedoAttack, setTorpedoAttack] = React.useState(null);
  const [myShipPlacements, setMyShipPlacement] = React.useState({});
  const [isOpponentReady, setIsOpponentReady] = React.useState(false);
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);
  const [allShipsPlaced, setAllShipsPlaced] = React.useState(false);
  const [room, setRoom] = React.useState("");
  const [startGame, setStartGame] = React.useState(false);
  const [myShips, setMyShips] = React.useState(allShips);
  const [opponentsBoard, setOpponentsBoard] =
    React.useState(initialBoardConfig);
  const [myBoard, setMyboard] = React.useState(initialBoardConfig);
  const [display, setDisplay] = React.useState({
    display: false,
    regarding: "",
    data: null,
  });
  const [gameStatus, setGameStatus] = React.useState("uninitiated");

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("full", (room) => {
      toast.error(`Room ${room} is full. Please try another room.`);
    });

    socket.on("youWon", ({ playerId }) => {
      if (playerId !== socket.id) {
        setWinner("player");
        setDisplay({
          display: true,
          regarding: "gameCompleted",
          data: "youWon",
        });
        toast.success("You Won!");
      }
    });

    socket.on("ready", (data) => {
      if (data.playerId !== socket.id) {
        setOpponentsBoard(data.boardConfig);
        setIsOpponentReady(true);
        toast.success("Opponent is Ready!");
      }
    });

    socket.on("dropTorpedo", (data) => {
      setTorpedoAttack(data);
    });

    socket.on("restartGameRequest", (data) => {
      if (data.playerId !== socket.id) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5`}
            >
              <div>
                <p>Your friend wants to play again! What would you say?</p>
                <div className="flex flex-row items-center justify-between">
                  <button
                    onClick={() => {
                      socket.emit("responseRestart", {
                        room,
                        playerId: socket.id,
                        res: "yes",
                      });
                    }}
                  >
                    Yes!
                  </button>
                  <button
                    onClick={() => {
                      socket.emit("responseRestart", {
                        room,
                        playerId: socket.id,
                        res: "no",
                      });
                      toast.dismiss(t.id);
                    }}
                  >
                    Nope!
                  </button>
                </div>
              </div>
            </div>
          ),
          {
            position: "bottom-right",
          }
        );
      }
    });

    socket.on("playerJoined", (data) => {
      setGameStatus("initiated");
      if (data.timeline === "first" && data.playerId === socket.id) {
        setWhoseTurn("player");
        setDisplay({ display: true, regarding: "createRoom", data: data.room });
        toast.success("Room created successfully");
      } else if (data.timeline === "second") {
        removeDialogbox();
        if (data.playerId === socket.id) {
          setWhoseTurn("opponent");
        }
      }
    });

    const handleRightClick = (e) => {
      e.preventDefault();
      setVertical((oldData) => !oldData);
    };

    document.addEventListener("contextmenu", handleRightClick);
    return () => {
      socket.disconnect();
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);

  useEffect(() => {
    if (torpedoAttack) {
      handleTorpedoAttact(torpedoAttack);
    }
  }, [torpedoAttack]);

  function handleTorpedoAttact(data) {
    if (data.playerId !== socket.id) {
      setWhoseTurn("player");
      if (myBoard[data.rindex][data.cindex].ship === true) {
        const { id } = myBoard[data.rindex][data.cindex].details;
        console.log(myShipPlacements, "myship placement");
        console.log(id);
        const {
          length,
          vertical,
          startIndex: { rowStart, colStart },
        } = myShipPlacements[id];
        if (vertical) {
          let wrecked = true;
          for (let row = rowStart; row < rowStart + length; row++) {
            if (myBoard[row][colStart].details.burst === false) {
              wrecked = false;
              break;
            }
          }
          if (wrecked) {
            setShipsWrecked((oldCount) => oldCount + 1);
          }
        } else {
          let wrecked = true;
          for (let col = colStart; col < colStart + length; col++) {
            if (
              myBoard[rowStart][col].details.burst === false &&
              col !== data.cindex
            ) {
              wrecked = false;
              break;
            }
          }
          if (wrecked) {
            setShipsWrecked((oldCount) => oldCount + 1);
          }
        }
      }

      setMyboard((oldData) => {
        const newData = [...oldData];
        const updatedElement = { ...oldData[data.rindex][data.cindex] };
        updatedElement.details.burst = true;
        newData[data.rindex][data.cindex] = updatedElement;
        return newData;
      });
    }
  }

  useEffect(() => {
    if (shipsWrecked === 5) {
      setWinner("opponent");
      toast("You Lost! Better luck next time!");
      setDisplay({
        display: true,
        regarding: "gameCompleted",
        data: "youLost",
      });

      socket.emit("youWon", { room, playerId: socket.id });
    }
  }, [shipsWrecked]);

  const handleJoinRoom = () => {
    if (!user) {
      toast.error("Please login to join room");
      setDisplay({ display: true, regarding: "signin", data: null });
    } else {
      setDisplay({ display: true, regarding: "joinRoom", data: null });
    }
  };

  const handleCreateRoom = () => {
    if (!user) {
      toast.error("Please login to create room");
      setDisplay({ display: true, regarding: "signin", data: null });
    } else {
      const currentTime = new Date().toISOString();
      const roomName = socket.id + currentTime;
      socket.emit("join", { room: roomName, playerId: socket.id });
    }
  };

  const handleJoinGivenRoom = () => {
    socket.emit("join", { room, playerId: socket.id });
    removeDialogbox();
  };

  const removeDialogbox = () => {
    setDisplay({ display: false, regarding: "", data: null });
  };

  const CopyToClipBoard = () => {
    setRoom(display.data);
    navigator.clipboard.writeText(display.data);
    toast.success("Copied to clipboard");
  };

  const handleSelectShip = (selectedShip) => {
    setMyShips((oldData) =>
      oldData.map((ship) => {
        return {
          ...ship,
          selected: ship.id === selectedShip.id ? !ship.selected : false,
        };
      })
    );

    setSelectedShip(selectedShip);
  };

  const handleMouseEnterCell = ({ rindex, cindex }) => {
    if (!selectedShip) return;
    const length = selectedShip.length;
    setMyboard((oldData) => {
      const newMyBoard = [...oldData];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const updatedElement = { ...oldData[row][col] };
          updatedElement.validHover = null;
          newMyBoard[row][col] = updatedElement;
        }
      }
      return newMyBoard;
    });

    if (vertical) {
      if (length + rindex <= 10) {
        let shipExist = false;
        for (let row = rindex; row < length + rindex; row++) {
          if (myBoard[row][cindex]["ship"] === true) {
            shipExist = true;
            break;
          }
        }
        if (!shipExist) {
          setMyboard((oldData) => {
            const newMyBoard = [...oldData];
            for (let row = rindex; row < length + rindex; row++) {
              const updatedElement = { ...newMyBoard[row][cindex] };
              updatedElement.validHover = true;
              newMyBoard[row][cindex] = updatedElement;
            }
            return newMyBoard;
          });
        } else {
          // handle if any ship exists on the way
          setMyboard((oldData) => {
            const newMyBoard = [...oldData];
            for (let row = rindex; row < rindex + selectedShip.length; row++) {
              const updatedElement = { ...oldData[row][cindex] };
              updatedElement.validHover = false;
              newMyBoard[row][cindex] = updatedElement;
            }
            return newMyBoard;
          });
        }
      } else {
        setMyboard((oldData) => {
          const newMyBoard = [...oldData];
          for (let row = rindex; row < 10; row++) {
            const updatedElement = { ...oldData[row][cindex] };
            updatedElement.validHover = false;
            newMyBoard[row][cindex] = updatedElement;
          }
          return newMyBoard;
        });
      }
    } else {
      if (length + cindex <= 10) {
        let shipExist = false;
        for (let col = cindex; col < length + cindex; col++) {
          if (myBoard[rindex][col]["ship"] === true) {
            shipExist = true;
            break;
          }
        }
        if (!shipExist) {
          setMyboard((oldData) => {
            const newMyBoard = [...oldData];
            for (let col = cindex; col < length + cindex; col++) {
              const updatedElement = { ...newMyBoard[rindex][col] };
              updatedElement.validHover = true;
              newMyBoard[rindex][col] = updatedElement;
            }
            return newMyBoard;
          });
        } else {
          // handle if any ship exists on the way
          setMyboard((oldData) => {
            const newMyBoard = [...oldData];
            for (let col = cindex; col < cindex + selectedShip.length; col++) {
              const updatedElement = { ...oldData[rindex][col] };
              updatedElement.validHover = false;
              newMyBoard[rindex][col] = updatedElement;
            }
            return newMyBoard;
          });
        }
      } else {
        setMyboard((oldData) => {
          const newMyBoard = [...oldData];
          for (let col = cindex; col < 10; col++) {
            const updatedElement = { ...oldData[rindex][col] };
            updatedElement.validHover = false;
            newMyBoard[rindex][col] = updatedElement;
          }
          return newMyBoard;
        });
      }
    }
  };

  useEffect(() => {
    console.log(myShipPlacements);
  }, [myShipPlacements]);

  const handlePlaceShip = ({ rindex, cindex, ship }) => {
    if (ship.validHover) {
      setMyShipPlacement((oldData) => {
        const newData = { ...oldData };
        const newElement = {
          length: selectedShip.length,
          vertical,
          startIndex: { rowStart: rindex, colStart: cindex },
        };
        newData[selectedShip.id] = newElement;
        return newData;
      });
      if (vertical) {
        setMyboard((oldData) => {
          const newMyBoard = [...oldData];
          for (let row = rindex; row < rindex + selectedShip.length; row++) {
            const updatedElement = { ...oldData[row][cindex] };
            updatedElement.ship = true;
            updatedElement.details.id = selectedShip.id;
            updatedElement.validHover = null;
            newMyBoard[row][cindex] = updatedElement;
          }
          return newMyBoard;
        });
      } else {
        setMyboard((oldData) => {
          const newMyBoard = [...oldData];
          for (let col = cindex; col < cindex + selectedShip.length; col++) {
            const updatedElement = { ...oldData[rindex][col] };
            updatedElement.ship = true;
            updatedElement.details.id = selectedShip.id;
            updatedElement.validHover = null;
            newMyBoard[rindex][col] = updatedElement;
          }
          return newMyBoard;
        });
      }
      setMyShips((oldData) =>
        oldData.map((ship) =>
          ship.id === selectedShip.id
            ? { ...ship, selected: false, placed: true }
            : ship
        )
      );

      setSelectedShip(null);
    }
  };

  useEffect(() => {
    myShips.every((ship) => ship.placed) && setAllShipsPlaced(true);
  }, [myShips]);

  const handleExitGame = () => {
    console.log("exit");
  };

  useEffect(() => {
    if (isPlayerReady && isOpponentReady) {
      setStartGame(true);
      toast.success("The Battle has Begun!");
    }
  }, [isPlayerReady, isOpponentReady]);

  const handleRestartGame = () => {
    console.log("restart");
  };

  const handleResetBoard = () => {
    setSelectedShip(null);
    removeDialogbox();
    setAllShipsPlaced(false);
    setMyShips(allShips);
    setWinner(null);
    setAllShipsPlaced(false);
    setIsOpponentReady(false);
    setIsPlayerReady(false);
    setMyShipPlacement({});
    setOpponentsBoard((oldData) => {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          oldData[row][col] = {
            ship: false,
            details: {
              id: "noship",
              burst: false,
            },

            validHover: null,
          };
        }
      }
      return oldData;
    });
    setMyboard((oldData) => {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          oldData[row][col] = {
            ship: false,
            details: {
              id: "noship",
              burst: false,
            },

            validHover: null,
          };
        }
      }
      return oldData;
    });
  };

  const handleSendReadyMessage = () => {
    setIsPlayerReady(true);
    socket.emit("ready", { room, boardConfig: myBoard, playerId: socket.id });
  };

  const dropTorpedoes = ({ rindex, cindex }) => {
    if (!startGame) {
      toast.error("Your opponent is not Ready yet!");
      return;
    }
    console.log(whoseTurn);
    if (whoseTurn !== "player") {
      toast.error("Its your opponent's turn!");
      return;
    }
    setWhoseTurn("opponent");
    setOpponentsBoard((oldData) => {
      if (oldData[rindex][cindex].details.burst === false) {
        const newData = [...oldData];
        const updatedElement = { ...oldData[rindex][cindex] };
        updatedElement.details.burst = true;
        newData[rindex][cindex] = updatedElement;
        socket.emit("dropTorpedo", {
          room,
          rindex,
          cindex,
          playerId: socket.id,
        });

        return newData;
      } else {
        toast("Torpedo already dropped here!", {});
        return oldData;
      }
    });
  };
  return (
    <>
      {display.display && display.regarding === "createRoom" && (
        <>
          <div className="bg-black/60 h-screen w-screen fixed top-0 left-0 z-[1000]" />
          <div className="h-[30vh] top-[35vh] left-[20vw] w-[60vw] fixed z-[1005] bg-white">
            Share this room to your friend
            <Button
              callback={() => CopyToClipBoard()}
              theme="green"
              text={display.data}
            />
            <Button
              callback={() => removeDialogbox()}
              theme="red"
              text="Close"
            />
          </div>
        </>
      )}
      {display.display && display.regarding === "joinRoom" && (
        <>
          <div
            onClick={removeDialogbox}
            className="bg-black/60 h-screen w-screen fixed top-0 left-0 z-[1000]"
          />
          <div className="h-[30vh] top-[35vh] left-[20vw] w-[60vw] fixed z-[1005] bg-white">
            Enter room code to join{" "}
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="12193-14-ef243"
            />
            <Button
              callback={() => handleJoinGivenRoom()}
              theme="green"
              text="Join"
            />
          </div>
        </>
      )}
      {display.display &&
        (display.regarding === "signin" || display.regarding === "signup") && (
          <>
            <div
              className="fixed top-0 left-0 h-screen w-screen bg-black/60 z-[1000]"
              onClick={removeDialogbox}
            />
            {display.regarding === "signin" ? (
              <SignIn
                callback={() =>
                  setDisplay({ display: true, regarding: "signup", data: null })
                }
                success={removeDialogbox}
              />
            ) : (
              <SignUp
                success={removeDialogbox}
                callback={() =>
                  setDisplay({ display: true, regarding: "signin", data: null })
                }
              />
            )}
          </>
        )}
      {display.display && display.regarding === "gameCompleted" && (
        <>
          <div className="bg-black/60 h-screen w-screen fixed top-0 left-0 z-[1000]" />
          <div className="h-[30vh] top-[35vh] left-[20vw] w-[60vw] fixed z-[1005] bg-white">
            <div className="flex flex-col">
              {winner === "player" ? (
                <p>Congratulations! you won</p>
              ) : (
                <p>Oops! you lost</p>
              )}
              <div className="p-5 flex-row flex justify-between">
                <Button
                  theme="green"
                  text="Restart"
                  callback={() => handleRestartGame()}
                />
                <Button
                  theme="red"
                  text="Exit"
                  callback={() => handleExitGame()}
                />
              </div>
            </div>
          </div>
        </>
      )}
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
                callback={() => handleJoinRoom()}
                theme="green"
                text="Join room"
              />
              <Button
                callback={() => handleCreateRoom()}
                theme="green"
                text="Create room"
              />
            </div>
          </div>
        </main>
      )}

      {gameStatus === "initiated" && (
        <main className="w-screen h-screen flex flex-col gap-4 overflow-hidden px-[10vw] py-5">
          <div className="flex flex-row items-start justify-between text-black">
            <button className="underline">{"<-"}back</button>
            <button>i</button>
          </div>
          <div className="grid custom-grid-battleship py-8">
            <div className="flex flex-col gap-3 py-2">
              <h1 className="font-bold">
                Select Ship{" "}
                {vertical ? <span>&#8595;</span> : <span>&#8594;</span>}
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
                callback={() => handleResetBoard()}
              />
              <Button
                theme="green"
                text="Ready!"
                disabled={!allShipsPlaced}
                style={{
                  cursor: allShipsPlaced ? "pointer" : "not-allowed",
                }}
                callback={() => handleSendReadyMessage()}
              />
            </div>
            <div className="grid grid-rows-10">
              {myBoard.map((row, rindex) => (
                <div key={rindex} className="grid grid-cols-10">
                  {row.map((ele, cindex) => (
                    <div key={`${rindex}-${cindex}`}>
                      <div
                        style={
                          ele.validHover === null
                            ? ele.ship
                              ? ele.details.burst
                                ? { background: "red" }
                                : { background: "rgb(23 37 84)" }
                              : ele.details.burst
                              ? { background: "gray" }
                              : { background: "rgb(14, 165, 233)" }
                            : ele.validHover === true
                            ? { background: "rgb(29 78 216)" }
                            : ele.validHover === false
                            ? { background: "rgb(248 113 113)" }
                            : {}
                        }
                        className="pt-[100%] w-full outline outline-black outline-[1px] cursor-pointer transition-all duration-100 ease-in-out"
                        onMouseEnter={() =>
                          handleMouseEnterCell({ rindex, cindex })
                        }
                        onClick={() =>
                          handlePlaceShip({ ship: ele, cindex, rindex })
                        }
                      ></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="grid grid-rows-10">
              {opponentsBoard.map((row, rindex) => (
                <div key={`${rindex}-opponent`} className="grid grid-cols-10">
                  {row.map((ele, cindex) => (
                    <div key={`${rindex}-${cindex}-opponent`}>
                      <div
                        style={
                          ele.details.burst
                            ? { background: "gray" }
                            : { background: "rgb(190 24 93)" }
                        }
                        className={`pt-[100%] w-full outline hover:bg-slate-600 outline-black outline-[1px] cursor-pointer transition-all duration-100 ease-in-out`}
                        onClick={() => dropTorpedoes({ rindex, cindex })}
                      ></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default Battleship;
