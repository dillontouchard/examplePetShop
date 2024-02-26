import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import nodeCache from "node-cache"

const petCache = new nodeCache({stdTTL: 100});

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
    const id = req.params.id;
    const petData = petCache.get(id);
    if (petData) {
      res.send(petData);
    } else {
      pool.query("SELECT * FROM pets WHERE id=$1", [id])
      .then((result) => {
        res.send(result.rows);
        petCache.set(id, result.rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Sorry error');
      });
    }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
