import { faker } from '@faker-js/faker';
import pg from 'pg';
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { DATABASE_URL } = process.env;

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
});

await pool.connect();


//million insert statements
/*
INSERT INTO pets(name, description, birthday, profile_pic, kind)
VALUES
('Han', 'Smart and shy', '2019-11-07', 'https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/70785342/', 'dog'),
*/
const insertPromises = [];
//for loop
for (let i = 0; i < 10; i++) {
  //create an animal
  let newAnimal = createDog();
  //insert animal into database using pg
  insertPromises.push(pool.query(
    'INSERT INTO  pets(name, description, birthday, profile_pic, kind) VALUES ($1, $2, $3, $4, $5)',
    newAnimal)
    .catch((err) => console.log(err)));
}

Promise.all(insertPromises)
  .then((data) => {
    console.log('seed complete');
    process.exit(0);
    })
  .catch((err) => console.log(err));


function createDog() {
  const name = faker.person.firstName();
  const description = faker.animal.dog();
  const birthday = faker.date.birthdate({min: 1, max: 15, mode: 'age'});
  const profile_pic = faker.image.url();
  const kind = 'dog';
  return [name, description, birthday, profile_pic, kind];
}