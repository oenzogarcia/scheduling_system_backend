const pool = require('../../../connection');

const updateDoctorService = async (name, id) => {
    const { rows, rowCount } = await pool.query(`
    UPDATE doctors
    SET
    name = $1
    WHERE id = $2
    `, [name, id]);

    return {
        rows,
        rowCount
    }
}

module.exports = updateDoctorService

