import React, { ReactNode } from "react";
import bg_img from "../assets/images/grass.jpg";
import { useLocation } from "react-router-dom";
import cloud1 from "../assets/images/cloud1.png";
import cloud2 from "../assets/images/cloud2.png";

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { pathname } = location;
  if (
    pathname === "/games/whack-a-plane" ||
    pathname === "/games/whack-a-plane/play"
  )
    return (
      <div className="bg-[#56caff] h-screen w-screen relative overflow-x-hidden overflow-y-hidden">
        <img
          src={cloud1}
          alt="a cloud"
          className="h-[27vh] absolute w-auto custom-animation-cloud1"
        />
        <img
          src={cloud2}
          alt="a cloud"
          className="h-[33vh] absolute w-auto custom-animation-cloud2"
        />
        <div className="relative z-[999999]">{children}</div>
      </div>
    );
  else if (pathname === "/games/battleship") {
    return (
      <div className="bg-sea overflow-x-hidden overflow-y-hidden relative">
        <div className="relative z-[100] h-screen w-screen overflow-hidden">
          {children}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-custom overflow-x-hidden overflow-y-hidden relative">
        <img
          src={bg_img}
          className="w-screen h-36 bottom-0 left-0 absolute z-0"
          alt="background"
        />
        <img
          src={cloud1}
          alt="a cloud"
          className="h-[27vh] absolute w-auto custom-animation-cloud1"
        />
        <img
          src={cloud2}
          alt="a cloud"
          className="h-[33vh] absolute w-auto custom-animation-cloud2"
        />
        <div className="relative z-[100] h-screen w-screen overflow-hidden">
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;
