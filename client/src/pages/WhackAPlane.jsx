import React, { useState, useEffect, useRef } from "react";
import bombImage from "../assets/images/whack-a-plane/bomb.jpg";
import planeImage from "../assets/images/whack-a-plane/plane.png";
import goldenPlaneImage from "../assets/images/whack-a-plane/golden_plane.png";
import blastImage from "../assets/images/whack-a-plane/explode.jpg";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function WhackAPlane() {
  const canvasRef = useRef(null);
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
  const [hitObject, setHitObject] = useState(false);
  const [gameStatus, setGameStatus] = useState("uninitiated");
  const [planePosition, setPlanePosition] = useState({
    x: 0,
    y: 0,
    isPlane: false,
    isGolden: false,
    isBomb: false,
  });

  const getRandomPosition = () => {
    const canvas = canvasRef.current;
    if (!canvas)
      return { x: 0, y: 0, isGolden: false, isPlane: true, isBomb: false };

    const maxX = canvas.width - 50;
    const maxY = canvas.height - 50;
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
    const handleClick = (event) => {
      if (hitObject) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const drawBlast = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      const ctx = canvas.getContext("2d");
      const drawPlane = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      console.log(delay);
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [planePosition, gameStatus, hitObject]);

  const sleep = (duration) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), duration);
    });
  };

  const handleStart = async () => {
    setGameStatus("initiated");

    const countDownTimer = document.createElement("p");
    countDownTimer.id = "countdown_timer";
    document.body.appendChild(countDownTimer);
    for (let i = 3; i > 0; i--) {
      countDownTimer.innerText = i;
      await sleep(1000);
    }
    document.body.removeChild(countDownTimer);
    setScore(0);
    setInterval(() => {
      setDelay((prev) => {
        if (prev - 3 > 500) {
          return prev - 3;
        } else {
          return 500;
        }
      });
    }, 1000);

    setPlanePosition(getRandomPosition());
  };

  return (
    <>
      {gameStatus === "uninitiated" && (
        <main className="w-screen h-screen overflow-x-hidden overflow-y-auto px-[25vw] py-5">
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
            <Button
              callback={() => handleStart()}
              theme="green"
              text="Start Game"
            />
          </div>
        </main>
      )}
      {gameStatus === "initiated" && (
        <main className="flex flex-col gap-10 items-center w-screen h-screen py-5">
          <p>Score: {score}</p>
          <canvas
            ref={canvasRef}
            id="canvasElem"
            height={500}
            width={500}
            className="border border-black bg-white"
          />
        </main>
      )}
      {gameStatus === "over" && (
        <main className="flex items-center justify-center h-screen w-screen">
          <div className="flex-col flex gap-3 items-center p-16 shadow-md rounded-2xl bg-neutral-200">
            <h1 className="font-semibold text-[3rem]">Game Over!</h1>
            <p className="py-5">Score: {score}</p>
            <Button
              text="Play Again!"
              theme="green"
              className="w-3/5"
              callback={() => handleStart()}
            />
            <Button
              text="Exit"
              theme="red"
              className="w-3/5"
              callback={() => navigate("/games")}
            />
          </div>
        </main>
      )}
    </>
  );
}
export default WhackAPlane;
