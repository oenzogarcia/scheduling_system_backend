const pool = require('../../../connection');

const getDoctorByIdService = async id => {
    const { rows, rowCount } = await pool.query(
        'SELECT * FROM doctors WHERE id = $1',
        [id]
    )

    return {
        rows,
        rowCount
    }
}

module.exports = getDoctorByIdService
