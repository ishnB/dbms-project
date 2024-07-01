import React, { useState, useEffect } from "react";

const Clubs = () => {
  const [selectedOption, setSelectedOption] = useState("clubsOverview");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${selectedOption}`);
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [selectedOption]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const renderData = () => {
    switch (selectedOption) {
      case "clubsOverview":
        return renderOverview();
      case "top5clubs":
        return renderTop5Clubs();
      case "bottom5clubs":
        return renderBottom5Clubs();
      case "sponsors":
        return renderSponsors();
      default:
        return null;
    }
  };

  const renderOverview = () => {
    return (
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Clubs Overview</h2>
        {data.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{item.Club}</p>
            <p>Manager: {item.Manager}</p>
            <p>Players: {item.Players}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderTop5Clubs = () => {
    return (
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Top 5 Clubs</h2>
        {data.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{item.ClubName}</p>
            <p>Total Goals: {item.TotalGoals}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderBottom5Clubs = () => {
    return (
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Bottom 5 Clubs</h2>
        {data.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{item.ClubName}</p>
            <p>Total Goals: {item.TotalGoals}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSponsors = () => {
    return (
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Sponsors</h2>
        {data.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{item.Club}</p>
            <p>Sponsor: {item.Sponsor}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Clubs</h1>
      <select
        value={selectedOption}
        onChange={handleOptionChange}
        className="border border-gray-300 rounded-md p-2 mb-4"
      >
        <option value="clubsOverview">Overview</option>
        <option value="top5clubs">Top 5 Clubs</option>
        <option value="bottom5clubs">Bottom 5 Clubs</option>
        <option value="sponsors">Sponsors</option>
      </select>
      {renderData()}
    </div>
  );
};

export default Clubs;
