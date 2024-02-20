import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import nodeCache from "node-cache";

const petCache = new nodeCache({stdTTL: 100});
dotenv.config({ path: "../.env" });

const { PORT, DATABASE_URL } = process.env;

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
});

await pool.connect();

const app = express();

app.use(express.json());

app.get("/api/pets", (req, res) => {
  pool.query("SELECT * FROM pets").then((result) => {
    res.send(result.rows);
  });
});

app.get("/api/pets/dogs", (req, res) => {
  pool.query("SELECT * FROM pets WHERE kind='dog'").then((result) => {
    res.send(result.rows);
  });
});
/* We are using this route mainly */
app.get("/api/pets/:id", (req, res) => {
  const id = req.params.id;
  //get the pet from cache
  const petData = petCache.get(id);

  if (petData) {
    //pet was in cache so just send the response
    res.send(petData);
  } else {
    //if no pet in cache, get from database
    //cache miss
    pool.query("SELECT * FROM pets WHERE id=$1", [id])
    .then((result) => {
      res.send(result.rows);
      //add result to cache for future requests
      petCache.set(id, result.rows);
     })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Sorry error');
    });
  }
});

//verify with loader io
app.get("/loaderio-e1866d3d698aa57b9c71d052ae0bcec2/", (req, res) => {
  res.send('loaderio-e1866d3d698aa57b9c71d052ae0bcec2');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
