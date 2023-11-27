const pool = require('../../../connection');

const deleteDoctorService = async id => {

    const { rows, rowCount } = await pool.query(`
        DELETE FROM doctors
        WHERE id = $1
        `, [id]);

    return {
        rows,
        rowCount
    }

}

module.exports = deleteDoctorService