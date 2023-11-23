const pool = require('../connection');

const getAppointmentWithDoctorByIdService = async (appointmentId, userId) => {
    const { rows, rowCount } = await pool.query(`
    SELECT a.name, a.email, a.phone, a.day, a.hour, a.specialty, d.name as doctor_name
    FROM appointments a
    JOIN doctors d
    ON a.doctor_id = d.id
    WHERE a.id = $1 AND a.user_id = $2
    `, [appointmentId, userId]);

    return {
        rows,
        rowCount
    }
}

const getAppointmentWithoutDoctorByIdService = async (appointmentId, userId) => {
    const { rows, rowCount } = await pool.query(`
            SELECT name, email, phone, day, hour, specialty
            FROM appointments
            WHERE id = $1 AND user_id = $2 AND doctor_id IS NULL
            `, [appointmentId, userId]);

    return {
        rows,
        rowCount
    }
}

module.exports = {
    getAppointmentWithDoctorByIdService,
    getAppointmentWithoutDoctorByIdService
}