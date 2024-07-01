import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: "db_user",
  password: "abcd1234",
  database: "test_db",
  connectionLimit: 5,
});

async function connectDB() {
  let conn;
  try {
    console.log("Trying to connect");
    conn = await pool.getConnection();
    console.log("Connected to MariaDB database");
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}

export default connectDB;
