const pool = require('../../../connection');

const getSpecialtyService = async (specialtyName) => {

    const { rows, rowCount } = await pool.query('SELECT * FROM specialties WHERE name = $1', [specialtyName]);

    return {
        rows,
        rowCount
    }

}

module.exports = {
    getSpecialtyService
}