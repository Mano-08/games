function MyBoard({ myBoard, handleMouseEnterCell, handlePlaceShip }) {
  return (
    <div className="grid grid-rows-10 outline outline-black outline-[2px]">
      {myBoard.map((row, rindex) => (
        <div key={rindex} className="grid grid-cols-10">
          {row.map((ele, cindex) => (
            <div key={`${rindex}-${cindex}`}>
              <div
                style={
                  ele.validHover === null
                    ? ele.ship
                      ? ele.details.burst
                        ? { background: "rgba(7,0,27,0.8)" }
                        : { background: "rgba(16,0,65,0.8)" }
                      : ele.details.burst
                      ? { background: "rgba(79,79,79,0.80)" }
                      : { background: "rgba(0,0,0,0.1)" }
                    : ele.validHover === true
                    ? { background: "rgba(0,0,0,0.5)" }
                    : ele.validHover === false
                    ? { background: "rgba(195,56,56,0.73)" }
                    : {}
                }
                className="pt-[100%] w-full cursor-crosshair outline outline-black outline-[1px] transition-all duration-100 ease-in-out"
                onMouseEnter={() => handleMouseEnterCell({ rindex, cindex })}
                onClick={() => handlePlaceShip({ ship: ele, cindex, rindex })}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MyBoard;
