CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    kind VARCHAR(255),
    name VARCHAR(255)
);