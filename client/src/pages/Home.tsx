import { Link } from "react-router-dom";
import React from "react";

function Home() {
  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center text-center">
        <div>
          <p className="text-[2.5rem]">EMBARK ON EPIC QUEST</p>
          <p className="text-[1.3rem]"> IN OUR DYNAMIC GAMING LANDSCAPE.</p>
        </div>
        <span>
          <Link
            to="/games"
            className={`bg-green-600 hover:outline outline-green-400 text-base rounded-lg px-8 py-3 transition-colors duration-300 text-white`}
          >
            Get Started
          </Link>
        </span>
      </div>
    </main>
  );
}

export default Home;

{
  /* We must have to provide credits to the one who created the pixelated grass/land image*/
  /* <a href="https://www.freepik.com/free-vector/arcade-game-world-pixel-scene_4814931.htm#query=pixel%20art%20grass&position=49&from_view=keyword&track=ais&uuid=89cec0a9-8c02-49f1-b2c9-eb2452ac2069">Image by stockgiu</a> on Freepik */
}
