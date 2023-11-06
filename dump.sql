CREATE DATABASE scheduling_system;

CREATE TABLE users (
    id serial PRIMARY KEY,
    name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    cpf text NOT NULL UNIQUE,
    password text NOT NULL 
);

