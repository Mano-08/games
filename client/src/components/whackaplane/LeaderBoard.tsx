import React, { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../../App";
import axios from "axios";

function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState<
    { username: string; score: string }[]
  >([]);
  const { token } = useContext(UserInfoContext);

  useEffect(() => {
    const getLeaderBoard = async () => {
      const result = await axios.post(
        "http://127.0.0.1:5000/api/whackaplane/getLeaderBoard",
        { token }
      );
      setLeaderBoard(result.data.leaderBoard);
    };
    getLeaderBoard();
  }, []);
  return (
    <table className="absolute top-[15vh] right-5">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="py-3 px-4 uppercase font-semibold text-sm">Rank</th>
          <th className="py-3 px-4 uppercase font-semibold text-sm">
            Username
          </th>
          <th className="py-3 px-4 uppercase font-semibold text-sm">Score</th>
        </tr>
      </thead>
      <tbody>
        {leaderBoard.map((player, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
          >
            <td className="py-3 px-4">{index + 1}</td>
            <td className="py-3 px-4">{player.username}</td>
            <td className="py-3 px-4">{player.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeaderBoard;
