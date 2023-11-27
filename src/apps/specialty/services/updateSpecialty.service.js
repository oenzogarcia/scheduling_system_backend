const pool = require('../../../connection');

const updateSpecialtyService = async (name, id) => {
    const { rows, rowCount } = await pool.query(`
    UPDATE specialties
    SET name = $1
    WHERE id = $2 
    `, [name, id]);

    return {
        rows,
        rowCount
    }
}

module.exports = updateSpecialtyService
