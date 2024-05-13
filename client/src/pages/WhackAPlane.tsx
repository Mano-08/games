import React, { useState, useEffect, useRef, useContext } from "react";
import bombImage from "../assets/images/whack-a-plane/bomb.jpg";
import planeImage from "../assets/images/whack-a-plane/plane.png";
import goldenPlaneImage from "../assets/images/whack-a-plane/golden_plane.png";
import blastImage from "../assets/images/whack-a-plane/explode.jpg";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeaderBoard from "../components/whackaplane/LeaderBoard";
import { UserInfoContext } from "../App";

function WhackAPlane() {
  const canvasRef = useRef(null);
  const COUNTDOWN_TIMER = 75;
  const navigate = useNavigate();
  const bomb = new Image();
  bomb.src = bombImage;
  const plane = new Image();
  plane.src = planeImage;
  const goldenPlane = new Image();
  goldenPlane.src = goldenPlaneImage;
  const blast = new Image();
  blast.src = blastImage;

  const [score, setScore] = useState(0);
  const [delay, setDelay] = useState(2000);
  const [highScore, setHighScore] = useState(0);
  const [delayInterval, setDelayInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [countdownInterval, setCountdownInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [countDown, setCountDown] = useState(COUNTDOWN_TIMER);
  const [hitObject, setHitObject] = useState(false);
  const [gameStatus, setGameStatus] = useState("uninitiated");
  const [planePosition, setPlanePosition] = useState({
    x: 0,
    y: 0,
    isPlane: false,
    isGolden: false,
    isBomb: false,
  });

  const { token } = useContext(UserInfoContext);
  const getRandomPosition = () => {
    const canvas = canvasRef.current;
    if (!canvas)
      return { x: 0, y: 0, isGolden: false, isPlane: true, isBomb: false };

    const maxX = (canvas as HTMLCanvasElement).width - 50;
    const maxY = (canvas as HTMLCanvasElement).height - 50;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    const randomValue = Math.random();
    let isGolden = false;
    let isPlane = false;
    let isBomb = false;
    if (randomValue < 0.2) {
      isGolden = true;
    } else if (randomValue < 0.4) {
      isBomb = true;
    } else {
      isPlane = true;
    }

    return { x, y, isGolden, isPlane, isBomb };
  };

  useEffect(() => {
    const getHighScore = async () => {
      try {
        const result = await axios.post(
          "http://127.0.0.1:5000/api/whackaplane/gethighscore",
          { token }
        );
        setHighScore(result.data.highScore);
      } catch (error) {
        console.log(error);
      }
    };
    getHighScore();
  }, []);

  const updateHighScore = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/whackaplane/updatehighscore",
        {
          token,
          score,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (gameStatus === "over") {
      if (score > highScore) {
        updateHighScore();
        setHighScore(score);
      }

      if (countdownInterval) clearInterval(countdownInterval);
      if (delayInterval) clearInterval(delayInterval);

      setCountdownInterval(null);
      setDelayInterval(null);
    }
  }, [gameStatus]);

  useEffect(() => {
    const handleClick: any = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (hitObject) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = (canvas as HTMLCanvasElement).getContext("2d");
      if (!ctx) return;
      const rect = (canvas as HTMLCanvasElement).getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const drawBlast = () => {
        ctx.clearRect(
          0,
          0,
          (canvas as HTMLCanvasElement).width,
          (canvas as HTMLCanvasElement).height
        );
        ctx.drawImage(blast, planePosition.x, planePosition.y, 50, 50);
      };
      const render = () => {
        drawBlast();
        requestAnimationFrame(render);
      };

      if (
        mouseX >= planePosition.x &&
        mouseX <= planePosition.x + 50 &&
        mouseY >= planePosition.y &&
        mouseY <= planePosition.y + 50
      ) {
        if (planePosition.isPlane) {
          setScore((prev) => prev + 10);
        } else if (planePosition.isGolden) {
          setScore((prev) => prev + 20);
        } else {
          setGameStatus("over");
        }
        setHitObject(true);
        render();
      }
    };

    if (gameStatus === "initiated" && !hitObject) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = (canvas as HTMLCanvasElement).getContext("2d");
      if (!ctx) return;
      const drawPlane = () => {
        ctx.clearRect(
          0,
          0,
          (canvas as HTMLCanvasElement).width,
          (canvas as HTMLCanvasElement).height
        );
        if (planePosition.isPlane) {
          ctx.drawImage(plane, planePosition.x, planePosition.y, 50, 50);
        } else if (planePosition.isGolden) {
          ctx.drawImage(goldenPlane, planePosition.x, planePosition.y, 50, 50);
        } else {
          ctx.drawImage(bomb, planePosition.x, planePosition.y, 50, 50);
        }
      };

      const render = () => {
        drawPlane();
        requestAnimationFrame(render);
      };

      render();
      setTimeout(() => {
        setHitObject(false);
        setPlanePosition(getRandomPosition());
      }, delay);
      (canvas as HTMLCanvasElement).addEventListener("click", handleClick);
      return () =>
        (canvas as HTMLCanvasElement).removeEventListener("click", handleClick);
    }
  }, [planePosition, gameStatus, hitObject]);

  const sleep = (duration: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), duration);
    });
  };

  const resetGame = () => {
    setScore(0);
    setCountDown(COUNTDOWN_TIMER);
    setHitObject(false);
  };

  const curtainDown3Seconds = async () => {
    const countDownTimer = document.createElement("p");
    countDownTimer.id = "countdown_timer";
    document.body.appendChild(countDownTimer);
    for (let i = 3; i > 0; i--) {
      countDownTimer.innerText = `${i}`;
      await sleep(1000);
    }
    document.body.removeChild(countDownTimer);
  };

  const handleStart = async () => {
    resetGame();
    setGameStatus("initiated");

    await curtainDown3Seconds();

    let frequency = setInterval(() => {
      setDelay((prev) => {
        if (prev - 3 > 500) {
          return prev - 3;
        } else {
          return 500;
        }
      });
    }, 1000);
    let countdownIterations = 0;

    setDelayInterval(frequency);
    let timer = setInterval(() => {
      setCountDown((prev) => {
        countdownIterations++;
        if (countdownIterations >= COUNTDOWN_TIMER) {
          setGameStatus("over");
        }
        return prev - 1;
      });
    }, 1000);

    setCountdownInterval(timer);
    setPlanePosition(getRandomPosition());
  };

  const handleGoBack = () => navigate("/games");

  return (
    <>
      {gameStatus === "uninitiated" && (
        <main className="w-screen h-screen overflow-x-hidden overflow-y-auto px-[20vw] flex items-center justify-center">
          <div className="flex flex-col gap-3 p-4 items-center outline outline-2 outline-black rounded-2xl bg-sky-200/50 backdrop-blur-sm	">
            <img
              src={goldenPlaneImage}
              alt="main"
              className="w-[15vw] h-auto rounded-2xl"
            />
            <div>
              <h1 className="font-bold underline py-4">Rules:</h1>
              <ul className="text-gray-600 flex flex-col gap-1">
                <li className="flex flex-row items-start gap-2">
                  <div>-</div>
                  <div>
                    Hit planes as they randomly appear on a grid. Each hit earns
                    points, but hitting a golden plane grants extra.
                  </div>
                </li>
                <li className="flex flex-row items-start gap-2">
                  <div>-</div>
                  <div>Beware the bomb plane, ending the game.</div>
                </li>
                <li className="flex flex-row items-start gap-2">
                  <div>-</div>
                  <div>
                    Test your reflexes in this aerial twist on the classic
                    Whack-A-Plane arcade game!
                  </div>
                </li>
              </ul>
            </div>
            <Button
              style={{}}
              className=""
              disabled={false}
              callback={() => handleStart()}
              theme="green"
              text="Start Game"
            />
          </div>
        </main>
      )}
      {gameStatus === "initiated" && (
        <main className="flex flex-col gap-5 items-center w-screen h-screen py-5">
          <div className="grid grid-cols-3 w-screen px-[3vw] pt-1">
            <button
              onClick={handleGoBack}
              className="underline flex justify-start items-start"
            >
              {"<-"}back
            </button>
            <p className="item-end flex justify-center items-start">
              Timer: {countDown}
            </p>
            <div className="flex flex-col gap-1 justify-end items-end">
              <p>HighScore: {highScore}</p>
              <p>Score: {score}</p>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            id="canvasElem"
            height={500}
            width={500}
            className="border border-black bg-white"
          />
          <LeaderBoard />
        </main>
      )}
      {gameStatus === "over" && (
        <main className="flex items-center justify-center h-screen w-screen">
          <div className="flex-col flex gap-3 items-center p-16 shadow-md rounded-2xl bg-neutral-200">
            <h1 className="font-semibold text-[3rem]">Game Over!</h1>
            <p className="py-5">Score: {score}</p>
            <Button
              style={{}}
              disabled={false}
              text="Play Again!"
              theme="green"
              className="w-3/5"
              callback={handleStart}
            />
            <Button
              disabled={false}
              style={{}}
              text="Exit"
              theme="red"
              className="w-3/5"
              callback={handleGoBack}
            />
          </div>
        </main>
      )}
    </>
  );
}
export default WhackAPlane;
