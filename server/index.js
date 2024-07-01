import cors from "cors";
import express from "express";
import mariadb from "mariadb";
import connectDB from "./config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: "db_user",
  password: "abcd1234",
  database: "test_db",
  connectionLimit: 5,
});

connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    methods: "GET, POST, PATCH, DELETE, PUT",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let conn;
  try {
    conn = await pool.getConnection();
    const existingUser = await conn.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length) {
      return res.status(409).json({ error: "Username already exists" });
    }

    await conn.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Error registering user" });
  } finally {
    if (conn) conn.end();
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (!user.length) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user[0].password);

    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user[0].id }, "your_secret_key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Error authenticating user:", err);
    res.status(500).json({ error: "Error authenticating user" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/clubs", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Club");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    res.status(500).json({ error: "Error fetching clubs" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/referees", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Referee");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching referees:", err);
    res.status(500).json({ error: "Error fetching referees" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/players/:clubID", async (req, res) => {
  const clubID = req.params.clubID;
  let conn;

  try {
    conn = await pool.getConnection();
    const query = "SELECT * FROM Player WHERE clubID = ?";
    const rows = await conn.query(query, [clubID]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ error: "Error fetching players" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/manager/:clubID", async (req, res) => {
  const clubID = req.params.clubID;
  let conn;

  try {
    conn = await pool.getConnection();
    const query = "SELECT * FROM Manager WHERE clubID = ?";
    const rows = await conn.query(query, [clubID]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching manager:", err);
    res.status(500).json({ error: "Error fetching manager" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/matches", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `
      SELECT m.matchID, m.homeClubID, hc.name AS homeClubName, 
             m.awayClubID, ac.name AS awayClubName, 
             m.refereeID, m.result, m.matchDate, m.stadium
      FROM Matches m
      JOIN Club hc ON m.homeClubID = hc.clubID
      JOIN Club ac ON m.awayClubID = ac.clubID
    `;
    const rows = await conn.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ error: "Error fetching matches" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/goals/:matchID", async (req, res) => {
  const matchID = req.params.matchID;
  let conn;

  try {
    conn = await pool.getConnection();
    const query = "SELECT * FROM Goal WHERE matchID = ?";
    const rows = await conn.query(query, [matchID]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Error fetching goals" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/sponsors", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT c.name AS Club, s.name AS Sponsor FROM Club c LEFT JOIN Sponsor s ON c.sponsorID = s.sponsorID"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching sponsors:", err);
    res.status(500).json({ error: "Error fetching sponsors" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/players", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * from player");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ error: "Error fetching players" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/clubsOverview", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT c.name AS Club, m.name AS Manager, COUNT(p.playerID) AS Players FROM Club c JOIN Manager m ON c.clubID = m.clubID JOIN Player p ON c.clubID = p.clubID GROUP BY c.clubID"
    );
    const formattedRows = rows.map((row) => ({
      Club: row.Club,
      Manager: row.Manager,
      Players: Number(row.Players),
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error("Error fetching overview:", err);
    res.status(500).json({ error: "Error fetching overview" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/refereeWork", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT m.matchDate, m.stadium, hc.name AS HomeClub, ac.name AS AwayClub, r.name AS Referee FROM `Matches` m JOIN Club hc ON m.homeClubID = hc.clubID JOIN Club ac ON m.awayClubID = ac.clubID JOIN Referee r ON m.refereeID = r.refereeID ORDER BY m.matchDate"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching overview:", err);
    res.status(500).json({ error: "Error fetching overview" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/top10scorers", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT p.name, p.position, COUNT(g.goalID) AS Goals FROM Player p JOIN Goal g ON p.playerID = g.playerID GROUP BY p.playerID ORDER BY Goals DESC LIMIT 10"
    );
    const formattedRows = rows.map((row) => ({
      name: row.name,
      position: row.position,
      Goals: row.Goals.toString(),
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({ error: "Error fetching list" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/standings", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT name, points FROM Club ORDER BY points DESC, goals_scored DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({ error: "Error fetching list" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/filterByNumGoals/:numGoals", async (req, res) => {
  const numGoals = req.params.numGoals;
  let conn;

  try {
    conn = await pool.getConnection();
    const query =
      "SELECT m.matchID, m.matchDate,m.stadium, c_home.name AS homeClubName, c_away.name AS awayClubName, SUM(CASE WHEN g.goalID IS NOT NULL THEN 1 ELSE 0 END) AS TotalGoals FROM Matches m LEFT JOIN Goal g ON m.matchID = g.matchID LEFT JOIN Club c_home ON m.homeClubID = c_home.clubID LEFT JOIN Club c_away ON m.awayClubID = c_away.clubID GROUP BY m.matchID HAVING TotalGoals > ?";
    const rows = await conn.query(query, [numGoals]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ error: "Error fetching matches" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/topEarners", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT name, position, salary FROM Player ORDER BY salary DESC LIMIT 5"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({ error: "Error fetching list" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/matches/:clubID", async (req, res) => {
  const clubID = req.params.clubID;
  let conn;

  try {
    conn = await pool.getConnection();
    const query =
      "SELECT m.matchID, m.matchDate, hc.name AS HomeTeam, ac.name AS AwayTeam, m.result FROM `Matches` m JOIN Club hc ON m.homeClubID = hc.clubID JOIN Club ac ON m.awayClubID = ac.clubID WHERE hc.clubID = ? OR ac.clubID = ?";
    const rows = await conn.query(query, [clubID, clubID]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ error: "Error fetching matches" });
  } finally {
    if (conn) conn.end();
  }
});

app.post("/addPlayer", async (req, res) => {
  const { clubID, name, age, nationality, salary, position, goalCount } =
    req.body;

  if (
    !clubID ||
    !name ||
    !age ||
    !nationality ||
    !salary ||
    !position ||
    !goalCount
  ) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO Player (clubID, name, age, nationality, salary, position, goalCount) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [clubID, name, age, nationality, salary, position, goalCount]
    );

    res.status(201).json({ message: "Player added successfully" });
  } catch (err) {
    console.error("Error adding player:", err);
    res.status(500).json({ error: "Error adding player" });
  } finally {
    if (conn) conn.end();
  }
});

app.post("/addGoal", async (req, res) => {
  const { playerID, matchID, minScored, goalType } = req.body;

  if (!playerID || !matchID || !minScored || !goalType) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO Goal (playerID, matchID, minScored, goalType) VALUES (?, ?, ?, ?)",
      [playerID, matchID, minScored, goalType]
    );

    res.status(201).json({ message: "Goal added successfully" });
  } catch (err) {
    console.error("Error adding goal:", err);
    res.status(500).json({ error: "Error adding goal" });
  } finally {
    if (conn) conn.release();
  }
});

app.put("/transferPlayer/:playerID", async (req, res) => {
  const playerID = req.params.playerID;
  const { newClubID } = req.body;

  if (!newClubID) {
    return res.status(400).json({ error: "Missing new club ID" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE Player SET clubID = ? WHERE playerID = ?", [
      newClubID,
      playerID,
    ]);

    res.status(200).json({ message: "Player transferred successfully" });
  } catch (err) {
    console.error("Error transferring player:", err);
    res.status(500).json({ error: "Error transferring player" });
  } finally {
    if (conn) conn.end();
  }
});

app.post("/addMatch", async (req, res) => {
  const { homeClubID, awayClubID, refereeID, matchDate, result } = req.body;

  if (!homeClubID || !awayClubID || !refereeID || !matchDate || !result) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("CALL InsertNewMatches(?, ?, ?, ?, ?)", [
      homeClubID,
      awayClubID,
      refereeID,
      matchDate,
      result,
    ]);

    res.status(201).json({ message: "Match added successfully" });
  } catch (err) {
    console.error("Error adding match:", err);
    res.status(500).json({ error: "Error adding match" });
  } finally {
    if (conn) conn.end();
  }
});

app.put("/goalsByNationality", async (req, res) => {
  const { nationality } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    const query =
      "SELECT p.name AS PlayerName, COUNT(g.goalID) AS GoalsScored FROM Player p LEFT JOIN Goal g ON p.playerID = g.playerID WHERE p.nationality = ? GROUP BY p.playerID ORDER BY GoalsScored DESC";
    const rows = await conn.query(query, [nationality]);
    console.log(nationality);
    const formattedRows = rows.map((row) => ({
      PlayerName: row.PlayerName,
      GoalsScored: row.GoalsScored.toString(),
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Error fetching goals" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/topScorer/:clubID", async (req, res) => {
  const clubID = req.params.clubID;
  let conn;

  try {
    conn = await pool.getConnection();
    const query =
      "SELECT p.name AS PlayerName, COUNT(g.goalID) AS GoalsScored FROM Player p LEFT JOIN Goal g ON p.playerID = g.playerID WHERE p.clubID = ? GROUP BY p.playerID ORDER BY GoalsScored DESC LIMIT 1";
    const rows = await conn.query(query, [clubID]);
    const topScorer = {
      PlayerName: rows[0].PlayerName,
      GoalsScored: rows[0].GoalsScored.toString(),
    };
    res.json(topScorer);
  } catch (err) {
    console.error("Error fetching player:", err);
    res.status(500).json({ error: "Error fetching player" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/top5clubs", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT c.name AS ClubName, SUM(p.goalCount) AS TotalGoals FROM Club c JOIN Player p ON c.clubID = p.clubID GROUP BY c.clubID ORDER BY TotalGoals DESC LIMIT 5"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({ error: "Error fetching list" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/bottom5clubs", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT c.name AS ClubName, IFNULL(SUM(p.goalCount), 0) AS TotalGoals FROM Club c LEFT JOIN Player p ON c.clubID = p.clubID GROUP BY c.clubID ORDER BY TotalGoals ASC, c.name ASC LIMIT 5"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({ error: "Error fetching list" });
  } finally {
    if (conn) conn.end();
  }
});

app.listen(8080, () => {
  console.log("listening on *:8080");
});
