const pool = require('../../../connection');

const deleteAppointmentService = async id => {
    const { rows, rowCount } = await pool.query(`
    DELETE FROM appointments
    WHERE id = $1
    `, [id]);

    return {
        rows,
        rowCount
    }
}

module.exports = {
    deleteAppointmentService
}

