import React, { useEffect, useState } from "react";
import axios from "axios";

const Stats = () => {
  const [topScorers, setTopScorers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";
        if (selectedOption === "topScorers") {
          url = "http://localhost:8080/top10scorers";
        } else if (selectedOption === "topEarners") {
          url = "http://localhost:8080/topEarners";
        }
        const response = await axios.get(url);
        setTopScorers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Stats</h1>
      <select
        className="bg-white border border-gray-300 rounded-md py-2 px-4 mb-4"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        <option value="" disabled hidden>
          Filter
        </option>
        <option value="topScorers">Top Scorers</option>
        <option value="topEarners">Top Earners</option>
      </select>
      {selectedOption === "" ? (
        <div></div>
      ) : (
        <>
          {selectedOption === "topScorers" ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Top Scorers</h2>
              <ul className="list-disc pl-4">
                {topScorers.map((scorer) => (
                  <li key={scorer.id}>
                    {scorer.name} ({scorer.position}) - {scorer.Goals} goals
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-2">Top Earners</h2>
              <ul className="list-disc pl-4">
                {topScorers.map((earner) => (
                  <li key={earner.id}>
                    {earner.name} ({earner.position}) - ${earner.salary}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Stats;
