import React, { useState, useEffect } from "react";

const AddMatch = () => {
  const [formData, setFormData] = useState({
    homeClubID: "",
    awayClubID: "",
    refereeID: "",
    result: "",
    matchDate: "",
  });
  const [clubs, setClubs] = useState([]);
  const [referees, setReferees] = useState([]);

  useEffect(() => {
    fetchClubs();
    fetchReferees();
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

  const fetchReferees = async () => {
    try {
      const response = await fetch("http://localhost:8080/referees");
      if (!response.ok) {
        throw new Error("Error fetching referees");
      }
      const refereesData = await response.json();
      setReferees(refereesData);
    } catch (error) {
      console.error("Error fetching referees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/addMatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Error adding match");
      }
      alert("Match added successfully!");

      setFormData({
        homeClubID: "",
        awayClubID: "",
        refereeID: "",
        result: "",
        matchDate: "",
      });
    } catch (error) {
      console.error("Error adding match:", error);
      alert("Error adding match");
    }
  };

  return (
    <div className="bg-mainBg min-h-screen">
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-semibold mb-6">Add Match</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="homeClubID" className="block">
              Home Club:
            </label>
            <select
              id="homeClubID"
              name="homeClubID"
              value={formData.homeClubID}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">Select Home Club</option>
              {clubs.map((club) => (
                <option key={club.clubID} value={club.clubID}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="awayClubID" className="block">
              Away Club:
            </label>
            <select
              id="awayClubID"
              name="awayClubID"
              value={formData.awayClubID}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">Select Away Club</option>
              {clubs
                .filter((club) => club.clubID !== formData.homeClubID)
                .map((club) => (
                  <option key={club.clubID} value={club.clubID}>
                    {club.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="refereeID" className="block">
              Referee:
            </label>
            <select
              id="refereeID"
              name="refereeID"
              value={formData.refereeID}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">Select Referee</option>
              {referees.map((referee) => (
                <option key={referee.refereeID} value={referee.refereeID}>
                  {referee.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="result" className="block">
              Result (1 - Home Team Victory, 0 - Draw, -1 - Away Team Victory):
            </label>
            <input
              type="text"
              id="result"
              name="result"
              value={formData.result}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="matchDate" className="block">
              Match Date:
            </label>
            <input
              type="datetime-local"
              id="matchDate"
              name="matchDate"
              value={formData.matchDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Match
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMatch;
