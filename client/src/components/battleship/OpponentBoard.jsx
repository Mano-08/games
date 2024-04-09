import React from "react";

function OpponentBoard({ dropTorpedoes, opponentsBoard }) {
  return (
    <div className="grid grid-rows-10 outline outline-black outline-[2px]">
      {opponentsBoard.map((row, rindex) => (
        <div key={`${rindex}-opponent`} className="grid grid-cols-10">
          {row.map((ele, cindex) => (
            <div key={`${rindex}-${cindex}-opponent`}>
              <div
                style={
                  ele.details.burst
                    ? ele.ship
                      ? { background: "rgba(164,21,21,0.80)" }
                      : { background: "rgba(79,79,79,0.80)" }
                    : { background: "rgba(0,0,0,0.1)" }
                }
                className="pt-[100%] cursor-crosshair w-full outline outline-black outline-[0.5px] transition-all duration-100 ease-in-out"
                onClick={() => dropTorpedoes({ rindex, cindex })}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default OpponentBoard;
