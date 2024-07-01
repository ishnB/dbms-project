import React, { useState, useEffect } from "react";

const ClubPlayersPage = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [players, setPlayers] = useState([]);
  const [manager, setManager] = useState([]);
  const [clubName, setClubName] = useState("");

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

  const fetchPlayers = async (clubID) => {
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

  const fetchManager = async (clubID) => {
    try {
      const response = await fetch(`http://localhost:8080/manager/${clubID}`);
      if (!response.ok) {
        throw new Error("Error fetching manager");
      }
      const managerData = await response.json();
      setManager(managerData);
      console.log(managerData);
    } catch (error) {
      console.error("Error fetching manager:", error);
    }
  };

  const handleClubChange = (e) => {
    const selectedClubID = e.target.value.split(",")[0];
    const selectedClubName = e.target.value.split(",")[1];
    setSelectedClub(selectedClubID);
    fetchManager(selectedClubID);
    fetchPlayers(selectedClubID);
    setClubName(selectedClubName);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Club Players</h1>
      <label htmlFor="clubs" className="block mb-2">
        Clubs:
      </label>
      <select
        id="clubs"
        value={selectedClub}
        onChange={handleClubChange}
        className="border border-gray-300 rounded-md p-2 mb-4"
      >
        <option value="">Select a club</option>
        {clubs.map((club) => (
          <option key={club.clubID} value={`${club.clubID},${club.name}`}>
            {club.name}
          </option>
        ))}
      </select>
      {selectedClub && manager.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manager of {clubName}</h2>
          <p>{manager[0].name}</p>
          <h2 className="text-xl font-semibold mb-4">Players of {clubName}</h2>
          <ul className="list-disc pl-4">
            {players.map((player) => (
              <li key={player.playerID}>{player.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClubPlayersPage;
