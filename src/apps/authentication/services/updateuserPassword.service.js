const pool = require('../../../connection');

const updateUserPasswordService = async (id, password) => {
    const { rows } = await pool.query(
        `
        UPDATE users 
        SET password = $1
        WHERE id = $2
        RETURNING *
        `,
        [password, id]
    );

    return rows[0];
};

module.exports = {
    updateUserPasswordService
};