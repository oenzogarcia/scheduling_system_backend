const pool = require('../../../connection');

const getAllSpecialtiesService = async () => {
    const { rows, rowCount } = await pool.query('SELECT * FROM specialties');

    return {
        rows,
        rowCount
    }

}

module.exports = getAllSpecialtiesService