const pool = require('../../../connection');

const getSpecialtyByIdService = async id => {

    const { rows, rowCount } = await pool.query('SELECT * FROM specialties WHERE id = $1', [id]);

    return {
        rows,
        rowCount
    }

}

module.exports = getSpecialtyByIdService