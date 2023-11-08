const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'seu-usuario',
    password: 'sua-senha',
    database: 'scheduling_system'
});

module.exports = pool;