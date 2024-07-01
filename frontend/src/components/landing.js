import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  return (
    <div>
      {username ? (
        <div>
          <h1>Welcome {username}</h1>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Landing;
