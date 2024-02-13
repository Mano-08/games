import { Link } from "react-router-dom";
import whack_a_mole from "../assets/images/diglet.jpeg";
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
      <div className="bg-neutral-800 h-[80vh] overflow-x-hidden overflow-y-auto px-4 flex flex-col gap-4 py-12 rounded-[10px]">
        <GameCard
          name="Whack a Mole"
          href="/games/whack-a-mole"
          image={whack_a_mole}
          description="Whack the moles as they pop up."
        />

        <GameCard
          name="Whack a Mole"
          href="/games/whack-a-mole"
          image={whack_a_mole}
          description="Whack the moles as they pop up."
        />
      </div>
    </div>
  );
}

export default Games;
