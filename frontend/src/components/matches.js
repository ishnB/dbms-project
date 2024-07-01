import React, { useState, useEffect } from "react";

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [goals, setGoals] = useState([]);
  const [numGoalsFilter, setNumGoalsFilter] = useState(0);

  useEffect(() => {
    fetchMatches();
  }, []);

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

  const fetchGoalsByMatchID = async (matchID) => {
    try {
      const response = await fetch(`http://localhost:8080/goals/${matchID}`);
      if (!response.ok) {
        throw new Error("Error fetching goals");
      }
      const goalsData = await response.json();
      setGoals(goalsData);
      setSelectedMatch(matchID);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleMatchClick = (matchID) => {
    fetchGoalsByMatchID(matchID);
  };

  const handleFilterChange = (e) => {
    setNumGoalsFilter(e.target.value);
    fetchFilteredMatches(e.target.value);
  };

  const fetchFilteredMatches = async (numGoals) => {
    try {
      const response = await fetch(
        `http://localhost:8080/filterByNumGoals/${numGoals}`
      );
      if (!response.ok) {
        throw new Error("Error fetching filtered matches");
      }
      const filteredMatchesData = await response.json();
      setMatches(filteredMatchesData);
    } catch (error) {
      console.error("Error fetching filtered matches:", error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Match List</h1>
      <label htmlFor="numGoalsFilter" className="block mb-2">
        Filter Matches by Number of Goals:
      </label>
      <input
        type="number"
        id="numGoalsFilter"
        value={numGoalsFilter}
        onChange={handleFilterChange}
        className="border border-gray-300 rounded-md p-2 mb-4"
      />
      <ul>
        {matches.map((match) => (
          <li
            key={match.matchID}
            onClick={() => handleMatchClick(match.matchID)}
            className="cursor-pointer bg-gray-100 rounded-md p-2 mb-2"
          >
            {match.matchDate} - {match.homeClubName}{" "}
            {match.result === 1 ? "vs" : ""} {match.awayClubName} -{" "}
            {match.stadium}
          </li>
        ))}
      </ul>
      {selectedMatch && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
            Goals for Match {selectedMatch}
          </h2>
          <ul>
            {goals.map((goal) => (
              <li key={goal.goalID}>{goal.goalType}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchList;
