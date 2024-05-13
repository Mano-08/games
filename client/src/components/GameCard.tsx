import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

function GameCard({
  name,
  href,
  image,
  description,
}: {
  name: string;
  href: string;
  image: any;
  description: string;
}) {
  return (
    <Link to={href} className="text-white flex flex-row items-start gap-10">
      <img
        src={image}
        alt={name}
        className="h-[50vh] w-[30vw] rounded-[6px] object-cover"
      />
      <div className="flex flex-col gap-4 py-2">
        <h1>{name}</h1>
        <p className="text-neutral-400">{description}</p>
        <div>
          <Button
            style={{}}
            className=""
            disabled={false}
            callback={() => {}}
            text="Play"
            theme="green"
          />
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
