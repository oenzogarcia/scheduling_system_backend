const pool = require('../../../connection');

const getAllDoctorsService = async () => {
    const { rows, rowCount } = await pool.query('SELECT * FROM doctors')

    return {
        rows,
        rowCount
    }
}

module.exports = getAllDoctorsService