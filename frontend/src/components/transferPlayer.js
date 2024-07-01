import React, { useState, useEffect } from "react";

const TransferPlayer = () => {
  const [playerID, setPlayerID] = useState("");
  const [newClubID, setNewClubID] = useState("");
  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClubs();
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

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:8080/players");
      if (!response.ok) {
        throw new Error("Error fetching players");
      }
      const playersData = await response.json();
      setPlayers(playersData);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleTransfer = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/transferPlayer/${playerID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newClubID: newClubID }),
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error transferring player:", error);
      setMessage("Error transferring player");
    }
  };

  useEffect(() => {
    if (newClubID) {
      fetchPlayers();
    }
  }, [newClubID]);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Transfer Player</h1>
      {message && <p className="text-green-500">{message}</p>}

      <div className="mb-4">
        <label htmlFor="newClubID" className="block mb-2">
          New Club:
        </label>
        <select
          id="newClubID"
          value={newClubID}
          onChange={(e) => setNewClubID(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Select a club</option>
          {clubs.map((club) => (
            <option key={club.clubID} value={club.clubID}>
              {club.name}
            </option>
          ))}
        </select>
      </div>

      {newClubID && (
        <div>
          <label htmlFor="playerID" className="block mb-2">
            Player:
          </label>
          <select
            id="playerID"
            value={playerID}
            onChange={(e) => setPlayerID(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a player</option>
            {players.map((player) => (
              <option key={player.playerID} value={player.playerID}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleTransfer}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Transfer Player
      </button>
    </div>
  );
};

export default TransferPlayer;
