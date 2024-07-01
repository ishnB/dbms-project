import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-wider">Football Manager</div>
        <ul className="flex space-x-6 text-lg">
          <li>
            <a href="/add-match" className="hover:text-blue-500">
              Add Match
            </a>
          </li>
          <li>
            <a href="/add-goal" className="hover:text-blue-500">
              Add Goals
            </a>
          </li>
          <li>
            <a href="/add-player" className="hover:text-blue-500">
              Add Player
            </a>
          </li>
          <li>
            <a href="/clubs" className="hover:text-blue-500">
              Clubs
            </a>
          </li>
          <li>
            <a href="/club-players" className="hover:text-blue-500">
              Players
            </a>
          </li>
          <li>
            <a href="/transfer-player" className="hover:text-blue-500">
              Transfer Player
            </a>
          </li>
          <li>
            <a href="/matches" className="hover:text-blue-500">
              Matches
            </a>
          </li>
          <li>
            <a href="/standings" className="hover:text-blue-500">
              Standings
            </a>
          </li>
          <li>
            <a href="/stats" className="hover:text-blue-500">
              Stats
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
