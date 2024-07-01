import React, { useState, useEffect } from "react";

const AddGoal = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [minScored, setMinScored] = useState(0);
  const [goalType, setGoalType] = useState("");
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClubs();
    fetchMatches();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch("http://localhost:8080/clubs");
      if (!response.ok) {
        throw new Error("Error fetching clubs");
      }
      const clubsData = await response.json();
      setClubs(clubsData);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchPlayersByClub = async (clubID) => {
    try {
      const response = await fetch(`http://localhost:8080/players/${clubID}`);
      if (!response.ok) {
        throw new Error("Error fetching players");
      }
      const playersData = await response.json();
      setPlayers(playersData);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await fetch("http://localhost:8080/matches");
      if (!response.ok) {
        throw new Error("Error fetching matches");
      }
      const matchesData = await response.json();
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedClub") {
      setSelectedClub(value);
      fetchPlayersByClub(value);
    } else if (name === "selectedPlayer") {
      setSelectedPlayer(value);
    } else if (name === "selectedMatch") {
      setSelectedMatch(value);
    } else if (name === "minScored") {
      setMinScored(value);
    } else if (name === "goalType") {
      setGoalType(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/addGoal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerID: selectedPlayer,
          matchID: selectedMatch,
          minScored: minScored,
          goalType: goalType,
        }),
      });
      const data = await response.json();
      alert(data.message);
      setSelectedClub("");
      setSelectedPlayer("");
      setMinScored(0);
      setGoalType("");
      setSelectedMatch("");
    } catch (error) {
      console.error("Error adding goal:", error);
      setMessage("Error adding goal");
    }
  };

  return (
    <div className="bg-mainBg min-h-screen">
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-semibold mb-6">Add Goal</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="selectedClub" className="block mb-2 font-semibold">
              Select Club:
            </label>
            <select
              id="selectedClub"
              name="selectedClub"
              value={selectedClub}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club.clubID} value={club.clubID}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="selectedPlayer"
              className="block mb-2 font-semibold"
            >
              Select Player:
            </label>
            <select
              id="selectedPlayer"
              name="selectedPlayer"
              value={selectedPlayer}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a player</option>
              {players.map((player) => (
                <option key={player.playerID} value={player.playerID}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="minScored" className="block mb-2 font-semibold">
              Min Scored:
            </label>
            <input
              type="number"
              id="minScored"
              name="minScored"
              value={minScored}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="goalType" className="block mb-2 font-semibold">
              Goal Type:
            </label>
            <input
              type="text"
              id="goalType"
              name="goalType"
              value={goalType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="selectedMatch" className="block mb-2 font-semibold">
              Select Match:
            </label>
            <select
              id="selectedMatch"
              name="selectedMatch"
              value={selectedMatch}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a match</option>
              {matches.map((match) => (
                <option key={match.matchID} value={match.matchID}>
                  {match.matchDate} - {match.homeClubName}{" "}
                  {match.result === 1 ? "vs" : ""} {match.awayClubName} -{" "}
                  {match.stadium}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Goal
          </button>
        </form>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default AddGoal;
