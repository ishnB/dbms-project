import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stats from "./components/stats";
import Login from "./components/login";
import Landing from "./components/landing";
import Register from "./components/register";
import Standings from "./components/standings";
import Clubs from "./components/clubs";
import ClubPlayersPage from "./components/clubPlayers";
import MatchList from "./components/matches";
import AddMatch from "./components/addMatch";
import Navbar from "./components/navbar";
import AddPlayer from "./components/addPlayer";
import AddGoal from "./components/addGoal";
import TransferPlayer from "./components/transferPlayer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/stats" element={<Stats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/club-players" element={<ClubPlayersPage />} />
        <Route path="/matches" element={<MatchList />} />
        <Route path="/add-match" element={<AddMatch />} />
        <Route path="/add-player" element={<AddPlayer />} />
        <Route path="/add-goal" element={<AddGoal />} />
        <Route path="/transfer-player" element={<TransferPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
