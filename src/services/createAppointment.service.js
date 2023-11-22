const pool = require('../connection');

const createAppointmentService = async (data) => {

    const { rows } = await pool.query(`
        INSERT INTO appointments
        (user_id, name, email, phone, day, hour, specialty, specialty_id)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `, [data.id, data.name, data.email, data.phone, data.day, data.time, data.specialty, data.specialtyId]);

    return rows
}

module.exports = {
    createAppointmentService
}