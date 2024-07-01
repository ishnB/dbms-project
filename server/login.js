import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(
      "SELECT id, username, password FROM users WHERE username = ?",
      [username],
      (queryErr, results) => {
        connection.release();

        if (queryErr) {
          return res.status(500).json({ error: "Database query error" });
        }

        if (
          results.length === 0 ||
          !verifyPassword(password, results[0].password)
        ) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: results[0].id }, "your_secret_key", {
          expiresIn: "1h",
        });
        res.json({ token });
      }
    );
  });
});

async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = router;
