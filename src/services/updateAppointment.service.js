const pool = require('../connection');

const updateAppointmentDateService = async (day, hour, id) => {
    const { rows, rowCount } = await pool.query(`
    UPDATE appointments
    SET 
    day = $1,
    hour = $2
    WHERE id = $3
    `, [day, hour, id]);

    return {
        rows,
        rowCount
    }
}

const updateAppointmentPersonalInfoService = async (email, phone, id) => {
    const { rows, rowCount } = await pool.query(`
        UPDATE appointments
        SET 
        email = $1,
        phone = $2
        WHERE id = $3
        `, [email, phone, id]);

    return {
        rows,
        rowCount
    }
}

module.exports = {
    updateAppointmentDateService,
    updateAppointmentPersonalInfoService
}