import { Link } from "react-router-dom";
import whack_a_plane from "../assets/images/whackAPlane.gif";
import GameCard from "../components/GameCard";

function Games() {
  return (
    <div className="px-28">
      <div className="flex flex-row justify-end gap-8 py-7">
        <Link to="/signup" className="hover:underline">
          signup
        </Link>
        <Link to="/signin" className="hover:underline">
          signin
        </Link>
      </div>
      <div className="bg-neutral-800 h-[80vh] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-4 rounded-[10px]">
        <GameCard
          name="Whack a Plane"
          href="/games/whack-a-plane"
          image={whack_a_plane}
          description="Whack the planes as they show up."
        />
      </div>
    </div>
  );
}

export default Games;
