import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { PORT, DATABASE_URL } = process.env;

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
});

await pool.connect();

const app = express();

app.use(express.json());

app.get("/pets", (req, res) => {
  pool.query("SELECT * FROM pets").then((result) => {
    res.send(result.rows);
  });
});

app.get("/pets/dogs", (req, res) => {
  pool.query("SELECT * FROM pets WHERE kind='dog'").then((result) => {
    res.send(result.rows);
  });
});

app.get("/pets/:id", (req, res) => {
  pool.query("SELECT * FROM pets WHERE id=$1", [req.params.id]).then((result) => {
    res.send(result.rows);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
