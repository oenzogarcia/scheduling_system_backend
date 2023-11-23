const pool = require('../connection');

const getAppointmentsWithDoctor = async (userId) => {
    const { rows } = await pool.query(`
    SELECT a.name, a.email, a.phone, a.day, a.hour, a.specialty, d.name AS doctor_name
    FROM appointments a
    JOIN doctors d
    ON a.doctor_id = d.id
    WHERE a.user_id = $1
    `, [userId]);

    return {
        rows
    }
}

const getAppointmentsWithoutDoctor = async (userId) => {
    const { rows } = await pool.query(`
    SELECT name, email, phone, day, hour, specialty FROM appointments WHERE user_id = $1 AND doctor_id IS NULL
    `, [userId]);

    return {
        rows
    }
}

module.exports = {
    getAppointmentsWithDoctor,
    getAppointmentsWithoutDoctor
}

