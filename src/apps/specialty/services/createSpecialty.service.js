const pool = require('../../../connection');

const createSpecialtyService = async name => {
    const { rows, rowCount } = await pool.query(`
    INSERT INTO specialties
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


module.exports = createSpecialtyService
