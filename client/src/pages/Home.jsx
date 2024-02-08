import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main
      id="landing_page"
      className="h-screen w-screen flex flex-col items-center gap-5"
    >
      <div className="flex flex-row items-center justify-between px-16 w-screen">
        <p></p>
        <h1 className="text-white text-[3rem]">web games</h1>
        <div className="flex flex-row items-center gap-2">
          <Link to="/signin">
            <button className="rounded-lg px-2 py-0.5 bg-neutral-700 hover:bg-neutral-600 transition-colors duration-300 text-white">
              SignIn
            </button>
          </Link>
          <Link to="/signup">
            <button className="rounded-lg px-2 py-0.5 bg-neutral-700 hover:bg-neutral-600 transition-colors duration-300 text-white">
              SignUp
            </button>
          </Link>
        </div>
      </div>
      {/* <a href="https://www.freepik.com/free-photo/black-brick-wall-background_4640630.htm#query=dark%20brick&position=1&from_view=keyword&track=ais&uuid=15c69838-7ea7-4c08-9996-b8975b79bc1c">
        Image by rawpixel.com
      </a>{" "}
      on Freepik */}
      {/* <a href="https://www.freepik.com/free-photo/plain-bright-red-brick-wall_3081515.htm#query=red%20brick&position=0&from_view=keyword&track=ais&uuid=3c25a8b0-e11f-4386-a9b3-e6ce1197ca49">
        Image by rawpixel.com
      </a>{" "}
      on Freepik */}
      <div className="h-[75vh] w-[70vw] bg-slate-600 rounded-2xl border-2 border-black"></div>
    </main>
  );
}

export default Home;
