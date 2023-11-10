const dotenv = require('dotenv');

const { Pool } = require('pg');

dotenv.config();

const pool = new Pool({
    host: process.env.HOST_DATABASE,
    port: process.env.PORT_DATABASE,
    user: process.env.USER_DATABASE,
    password: process.env.PASSWORD_DATABASE,
    database: process.env.DATABASE
});

module.exports = pool;