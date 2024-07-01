import React, { useState, useEffect } from "react";

const AddPlayer = () => {
  const [formData, setFormData] = useState({
    clubID: "",
    name: "",
    age: "",
    nationality: "",
    salary: "",
    position: "",
    goalCount: "0",
  });
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      const response = await fetch("http://localhost:8080/addPlayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error adding player");
        setMessage("");
      } else {
        setMessage(data.message || "Player added successfully");
        setError("");
        setFormData({
          clubID: "",
          name: "",
          age: "",
          nationality: "",
          salary: "",
          position: "",
          goalCount: "0",
        });
      }
    } catch (error) {
      console.error("Error adding player:", error);
      setError("Error adding player");
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Add Player</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="clubID" className="block mb-2 font-semibold">
            Club:
          </label>
          <select
            id="clubID"
            name="clubID"
            value={formData.clubID}
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
          <label htmlFor="name" className="block mb-2 font-semibold">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block mb-2 font-semibold">
            Age:
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nationality" className="block mb-2 font-semibold">
            Nationality:
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="salary" className="block mb-2 font-semibold">
            Salary:
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="position" className="block mb-2 font-semibold">
            Position:
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Player
        </button>
      </form>
    </div>
  );
};

export default AddPlayer;
