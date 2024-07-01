import React, { useEffect, useState } from "react";

const StandingsTable = ({ standings }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Club Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Points
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Goals Scored
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Goals Conceded
            </th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {standings.map((club, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-4 whitespace-nowrap">{club.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{club.points}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                {club.goals_scored}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {club.goals_conceded}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Standings = () => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch("http://localhost:8080/standings");
        if (!response.ok) {
          throw new Error("Error fetching standings");
        }
        const data = await response.json();
        setStandings(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchStandings();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Standings</h2>
      <StandingsTable standings={standings} />
    </div>
  );
};

export default Standings;
