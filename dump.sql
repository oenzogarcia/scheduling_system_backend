CREATE TABLE users (
    id serial PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    cpf text NOT NULL UNIQUE,
    password text NOT NULL,
    created_at timestamp DEFAULT NOW(),
    active boolean DEFAULT false
);


CREATE TABLE doctors (
    id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE specialties (
    id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE doctors_specialties (
    doctor_id integer REFERENCES doctors(id),
    specialty_id integer REFERENCES specialties(id),
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE appointments (
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    day date NOT NULL,
    hour time NOT NULL,
    specialty text NOT NUll,
    specialty_id integer REFERENCES specialties(id),
    doctor_id integer REFERENCES doctors(id),
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE doctors_appointments (
    doctor_id integer REFERENCES doctors(id),
    appointment_id integer REFERENCES appointments(id),
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE users_appointments (
    user_id integer REFERENCES users(id),
    appointment_id integer REFERENCES appointments(id),
    created_at timestamp DEFAULT NOW()
);





