import React from "react";
import { Link } from "react-router-dom";

function GameCard({ name, href, image, description }) {
  return (
    <Link to={href} className="text-white flex flex-row items-start gap-10">
      <img
        src={image}
        alt={name}
        className="h-[50vh] rounded-[6px] w-1/2 object-cover"
      />
      <div className="flex flex-col gap-4 py-2">
        <h1>{name}</h1>
        <p className="text-neutral-400">{description}</p>
        <div>
          <button
            className={`bg-green-600 hover:outline outline-green-400 text-base rounded-lg px-8 py-3 transition-colors duration-300 text-white`}
          >
            Play
          </button>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
