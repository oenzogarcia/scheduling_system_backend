const pool = require('../../../connection');

const createDoctorService = async name => {
    const { rows, rowCount } = await pool.query(`
    INSERT INTO doctors
    (name)
    VALUES
    ($1)
    RETURNING *
    `, [name]);

    return {
        rows,
        rowCount
    }
}

module.exports = createDoctorService
