const pool = require('../../../connection');

const updateUserService = async (id, value) => {
    const { rows } = await pool.query(
        `
        UPDATE users 
        SET active = $1
        WHERE id = $2
        RETURNING *
        `,
        [value, id]
    );

    return rows[0];
};

module.exports = {
    updateUserService
};