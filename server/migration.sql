DROP TABLE IF EXISTS pets;

CREATE TYPE species AS ENUM ('dog', 'cat', 'parrot');
CREATE TABLE pets (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT,
  description TEXT,
  birthday DATE,
  profile_pic TEXT,
  kind species
);

INSERT INTO pets(name, description, birthday, profile_pic, kind)
VALUES
('Han', 'Smart and shy', '2019-11-07', 'https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/70785342/', 'dog'),
('Solo', 'Large and fluffy', '2022-12-20', 'https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/90012345/', 'dog'),
('Xena', 'Silent but deadly', '1980-01-01', 'https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/90011123/', 'cat');
