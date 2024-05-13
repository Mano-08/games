import React, { useEffect, useState, useContext } from "react";
import * as io from "socket.io-client";
import SignUp from "../components/SignUp";
import captain from "../assets/images/battleship/captain.png";
import SignIn from "../components/SignIn";
import { toast } from "react-hot-toast";
import MessageBox from "../components/battleship/MessageBox";
import messageIcon from "../assets/images/battleship/message.jpg";
import axios from "axios";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { initialBoardConfig, allShips } from "../utils/initialBoardConfig";
import { UserInfoContext } from "../App";
import OpponentsBoard from "../components/battleship/OpponentBoard";
import MyBoard from "../components/battleship/MyBoard";
import SelectShip from "../components/battleship/SelectShip";
import LandingPage from "../components/battleship/LandingPage";
import CreateRoomDialogBox from "../components/battleship/dialogbox/CreateRoomDialogBox";
import JoinRoomDialogBox from "../components/battleship/dialogbox/JoinRoomDialogBox";
import GameCompletedDialogBox from "../components/battleship/dialogbox/GameCompletedDialogBox";
import OpponentLeftDialogBox from "../components/battleship/dialogbox/OpponentLeftDialogBox";
import Button from "../components/Button";
import { PropBoardCell, PropShip } from "../types/types";

const socket = io.connect("http://127.0.0.1:5000", {
  transports: ["websocket"],
});

function Battleship() {
  const { user, token, logout } = useContext(UserInfoContext);
  const [consecutiveHit, setConsecutiveHit] = useState(false);
  const [consecutiveDamage, setConsecutiveDamage] = useState(false);
  const [score, setScore] = useState(1000);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [selectedShip, setSelectedShip] = useState<null | PropShip>(null);
  const [vertical, setVertical] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [whoseTurn, setWhoseTurn] = useState<string | null>(null);
  const [shipsWrecked, setShipsWrecked] = useState(0);
  const [torpedoAttack, setTorpedoAttack] = useState(null);
  const [myShipPlacements, setMyShipPlacement] = useState<{
    [key: string]: {
      length: number;
      vertical: boolean;
      startIndex: { rowStart: number; colStart: number };
    };
  }>({});
  const [isOpponentReady, setIsOpponentReady] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [allShipsPlaced, setAllShipsPlaced] = useState<boolean>(false);
  const [room, setRoom] = useState<null | string>("");
  const [startGame, setStartGame] = useState<boolean>(false);
  const [myShips, setMyShips] = useState<PropShip[]>(allShips);
  const [opponentsBoard, setOpponentsBoard] =
    useState<PropBoardCell[][]>(initialBoardConfig);
  const [myBoard, setMyboard] = useState<PropBoardCell[][]>(initialBoardConfig);
  const [display, setDisplay] = useState<{
    display: boolean;
    regarding: string;
    data: string | null;
  }>({
    display: false,
    regarding: "",
    data: null,
  });
  const [gameStatus, setGameStatus] = useState<string>("uninitiated");

  const { width, height } = useWindowSize();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameStatus === "uninitiated") return;
      e.preventDefault();
      // e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("receiveMessage", ({ playerId, message }) => {
      if (playerId !== socket.id) {
        toast.custom((t) => (
          <div className="flex flex-col items-center gap-3 p-3 bg-white rounded-2xl outline-2 outline-black outline">
            <p>Message received!</p>
            <div className="flex flex-row items-center gap-3">
              <img src={captain} alt="captain" className="h-32 w-32" />
              <p>{message}</p>
            </div>
            <div>
              <Button
                className=""
                style={{}}
                disabled={false}
                theme="red"
                text="close"
                callback={() => toast.dismiss(t.id)}
              />
            </div>
          </div>
        ));
      }
    });
    socket.on("playerLeft", ({ username }) => {
      toast(`${username} left the room.`);
      setOpponentLeft(true);
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

    socket.on("invalidtoken", () => {
      logout();
      toast.error("Invalid token! Please login again");
    });

    socket.on("ready", (data) => {
      if (data.playerId !== socket.id) {
        setOpponentsBoard(data.boardConfig);
        setIsOpponentReady(true);
        toast.success("Opponent is Ready!");
      } else {
        toast.success("Message sent!");
      }
    });

    socket.on("dropTorpedo", (data) => {
      setTorpedoAttack(data);
    });

    socket.on("oneShipDown", ({ playerId, shipId }) => {
      if (playerId !== socket.id) {
        toast(`enemy's ${shipId} is wrecked!`);
      }
    });

    socket.on("playerJoined", (data) => {
      setGameStatus("initiated");
      setHighScore(data.score);
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

    const handleRightClick = (e: MouseEvent) => {
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

  useEffect(() => {
    if (opponentLeft) {
      setDisplay({ display: true, regarding: "opponentLeft", data: null });
    }
  }, [opponentLeft]);

  useEffect(() => {
    if (gameStatus === "initiated") {
      if (score > highScore) {
        if (score > highScore) {
          setHighScore(score);
        }
        const url = `http://127.0.0.1:5000/api/battleship/updatescore`;
        axios.post(url, { score, token }).then((response) => {
          if (response.data && response.data.message === "success") {
            toast.success("Score updated successfully");
          }
        });
      }
    }
  }, [winner]);

  const handleTorpedoAttact = (data: {
    room: string;
    rindex: number;
    cindex: number;
    playerId: string;
  }) => {
    if (data.playerId !== socket.id) {
      setWhoseTurn("player");
      if (myBoard[data.rindex][data.cindex].ship === true) {
        if (consecutiveDamage) {
          setScore((oldScore) => oldScore - 20);
        } else {
          setScore((oldScore) => oldScore - 10);
        }
        setConsecutiveDamage(true);
        const { id } = myBoard[data.rindex][data.cindex].details;

        const {
          length,
          vertical,
          startIndex: { rowStart, colStart },
        }: {
          length: number;
          vertical: boolean;
          startIndex: { rowStart: number; colStart: number };
        } = myShipPlacements[id];

        let wrecked = true;
        if (vertical) {
          for (let row = rowStart; row < rowStart + length; row++) {
            if (myBoard[row][colStart].details.burst === false) {
              wrecked = false;
              break;
            }
          }
        } else {
          for (let col = colStart; col < colStart + length; col++) {
            if (
              myBoard[rowStart][col].details.burst === false &&
              col !== data.cindex
            ) {
              wrecked = false;
              break;
            }
          }
        }
        if (wrecked) {
          setShipsWrecked((oldCount) => oldCount + 1);
          toast(`your ${id} is wrecked!`);
          socket.emit("oneShipDown", {
            room,
            playerId: socket.id,
            shipId: id,
          });
        }
      } else {
        setConsecutiveDamage(true);
      }

      setMyboard((oldData) => {
        const newData = [...oldData];
        const updatedElement = { ...oldData[data.rindex][data.cindex] };
        updatedElement.details.burst = true;
        newData[data.rindex][data.cindex] = updatedElement;
        return newData;
      });
    }
  };

  useEffect(() => {
    if (gameStatus === "initiated") {
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
      socket.emit("join", { room: roomName, playerId: socket.id, token });
    }
  };

  const handleJoinGivenRoom = () => {
    socket.emit("join", { room, playerId: socket.id, token });
    removeDialogbox();
  };

  const removeDialogbox = () => {
    setDisplay({ display: false, regarding: "", data: null });
  };

  const CopyToClipBoard = () => {
    setRoom(display.data);
    if (display.data) {
      navigator.clipboard.writeText(display.data);
      toast.success("Copied to clipboard");
    }
  };

  const handleSelectShip = (selectedShip: PropShip) => {
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

  const handleMouseEnterCell = ({
    rindex,
    cindex,
  }: {
    rindex: number;
    cindex: number;
  }) => {
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

  const sendMessage = (message: string) => {
    socket.emit("sendMessage", {
      room,
      playerId: socket.id,
      message: message,
    });
  };

  const handlePlaceShip = ({
    rindex,
    cindex,
    ship,
  }: {
    rindex: number;
    cindex: number;
    ship: any;
  }) => {
    if (ship.validHover && selectedShip !== null) {
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
    socket.emit("leaveRoom", {
      room,
      username: user,
    });
    resetGame();
  };

  useEffect(() => {
    if (isPlayerReady && isOpponentReady) {
      setStartGame(true);
      toast.success("The Battle has Begun!");
    }
  }, [isPlayerReady, isOpponentReady]);

  const resetGame = () => {
    handleResetBoard();
    setRoom("");
    setGameStatus("uninitiated");
    setWinner(null);
    setOpponentLeft(false);
    setConsecutiveHit(false);
    setIsOpponentReady(false);
    setIsPlayerReady(false);
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
  };

  const handleResetBoard = () => {
    setSelectedShip(null);
    removeDialogbox();
    setAllShipsPlaced(false);
    setScore(1000);
    setMyShips(allShips);
    setAllShipsPlaced(false);
    setMyShipPlacement({});
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

  const dropTorpedoes = ({
    rindex,
    cindex,
  }: {
    rindex: number;
    cindex: number;
  }) => {
    if (!startGame) {
      toast.error("Both players need to be ready to start the game!");
      return;
    }
    if (whoseTurn !== "player") {
      toast.error("Its your opponent's turn!");
      return;
    }
    setWhoseTurn("opponent");
    if (opponentsBoard[rindex][cindex].ship === true) {
      if (consecutiveHit) {
        setScore((oldScore) => oldScore + 20);
      } else {
        setScore((oldScore) => oldScore + 10);
      }
      setConsecutiveHit(true);
    } else {
      setScore((oldScore) => oldScore - 10);
      setConsecutiveHit(false);
    }
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
      {/* ************************* GAME UNINITIATED -- Player has not joined the room ***************************** */}

      {gameStatus === "uninitiated" && (
        <LandingPage
          handleCreateRoom={handleCreateRoom}
          handleJoinRoom={handleJoinRoom}
        />
      )}

      {/* ************************* GAME INITIATED -- Player has joined the room ***************************** */}

      {gameStatus === "initiated" && (
        <main className="w-screen h-screen flex flex-col gap-4 overflow-hidden px-[10vw] py-5">
          {display.display && display.regarding === "sendMessage" && (
            <>
              <div
                className="fixed top-0 left-0 h-screen w-screen bg-black/60 z-[1000]"
                onClick={removeDialogbox}
              />
              <MessageBox sendMessage={sendMessage} />
            </>
          )}
          <button
            onClick={() =>
              setDisplay({
                display: true,
                regarding: "sendMessage",
                data: null,
              })
            }
          >
            <img
              src={messageIcon}
              alt="message icon"
              className="h-12 w-12 rounded-sm absolute bottom-5 right-5"
            ></img>
          </button>
          <div className="flex flex-row items-start justify-between text-black">
            <button onClick={handleExitGame} className="underline">
              {"<-"}exit
            </button>
            <div className="flex flex-row items-start gap-7">
              <p>Score: {score}</p> -
              <p className="text-slate-800">HighScore: {highScore}</p>
            </div>
          </div>
          <div className="grid custom-grid-battleship py-8">
            <SelectShip
              vertical={vertical}
              myShips={myShips}
              isPlayerReady={isPlayerReady}
              handleSelectShip={handleSelectShip}
              handleResetBoard={handleResetBoard}
              handleSendReadyMessage={handleSendReadyMessage}
              allShipsPlaced={allShipsPlaced}
            />
            <MyBoard
              myBoard={myBoard}
              handleMouseEnterCell={handleMouseEnterCell}
              handlePlaceShip={handlePlaceShip}
            />
            <OpponentsBoard
              opponentsBoard={opponentsBoard}
              dropTorpedoes={dropTorpedoes}
            />
          </div>
        </main>
      )}

      {/* *********************************************** DIALOG BOXES ************************************************* */}

      {display.display && display.regarding === "createRoom" && (
        <CreateRoomDialogBox
          removeDialogbox={removeDialogbox}
          CopyToClipBoard={CopyToClipBoard}
          display={display}
        />
      )}

      {display.display && display.regarding === "opponentLeft" && (
        <OpponentLeftDialogBox handleExitGame={handleExitGame} />
      )}
      {display.display && display.regarding === "joinRoom" && (
        <JoinRoomDialogBox
          removeDialogbox={removeDialogbox}
          room={room}
          setRoom={setRoom}
          handleJoinGivenRoom={handleJoinGivenRoom}
        />
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

      {winner === "player" && <Confetti width={width} height={height} />}
      {display.display && display.regarding === "gameCompleted" && (
        <GameCompletedDialogBox
          handleExitGame={handleExitGame}
          winner={winner as string}
        />
      )}
    </>
  );
}

export default Battleship;
