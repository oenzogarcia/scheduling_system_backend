const pool = require('../connection');
 
const createUser = async (data) => {
    const { rows } = await pool.query(
        `
        INSERT INTO users 
        (first_name, last_name, email, cpf, password )
        VALUES 
        ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [data.first_name, data.last_name,data.email,data.cpf, data.password]
    )

    return rows[0];
};

module.exports = {
    createUser
};