const pool = require('../connection');
const { createAppointmentService } = require('../services/createAppointment.service');
const { getSpecialtyService } = require('../services/getSpecialty.service');
const { generateAppointmentDetailsUtils } = require('../utils/generateAppointmentDetails.utils');

const scheduleAppointmentController = async (req, res) => {
    const { name, email, phone, day, time, specialty } = req.body;
    const { id } = req.user;

    try {
        const specialtyInfo = await getSpecialtyService(specialty);

        if (specialtyInfo.rowCount < 1) {
            return res.status(404).json({ message: 'Não existe esta especialidade nesta clínica.' });
        }

        const specialtyId = specialtyInfo.rows[0].id;

        const appointment = await createAppointmentService({ id, name, email, phone, day, time, specialty, specialtyId });

        const details = await generateAppointmentDetailsUtils(appointment);

        return res.status(201).json({ message: `Consulta agendada com sucesso!`, details });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

const listAppointmentsController = async (req, res) => {
    const { id } = req.user;

    try {
        const appointments = await pool.query(`
        SELECT a.name, a.email, a.phone, a.day, a.hour, a.specialty, d.name 
        FROM appointments a
        JOIN doctors d
        ON a.doctor_id = d.id
        WHERE a.user_id = $1
        `, [id]);

        return res.status(200).json(appointments.rows);

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const listAppointmentByIdController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const appointment = await pool.query(`
        SELECT a.name, a.email, a.phone, a.day, a.hour, a.specialty, d.name 
        FROM appointments a
        JOIN doctors d
        ON a.doctor_id = d.id
        WHERE a.id = $1 AND a.user_id = $2
        `, [id, userId]);

        if (appointment.rowCount < 1) {
            return res.status(404).json({ message: 'Este agendamento não existe.' });
        }

        return res.status(200).json(appointment.rows[0]);

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const updateAppointmentDateController = async (req, res) => {
    const { day, hour } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    try {

        const appointment = await pool.query(
            'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
            [id, userId]);

        if (appointment.rowCount < 1) {
            return res.status(404).json({ message: 'Este agendamento não existe.' });
        }

        const appointmentUpdate = await pool.query(`
        UPDATE appointments
        SET 
        day = $1,
        hour = $2
        WHERE id = $3
        `, [day, hour, id]);

        return res.status(200).json({ message: 'Data atualizada com sucesso.' });

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const updateAppointmentPersonalInfoController = async (req, res) => {
    const { email, phone } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const appointment = await pool.query(
            'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
            [id, userId]);

        if (appointment.rowCount < 1) {
            return res.status(404).json({ message: 'Este agendamento não existe.' });
        }

        const appointmentUpdate = await pool.query(`
        UPDATE appointments
        SET 
        email = $1,
        phone = $2
        WHERE id = $3
        `, [email, phone, id]);

        return res.status(200).json({ message: 'Dados pessoais atualizados com sucesso.' });

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const deleteAppointmentController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id

    try {
        const appointment = await pool.query(
            'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
            [id, userId]);

        if (appointment.rowCount < 1) {
            return res.status(404).json({ message: 'Este agendamento não existe.' });
        }

        const deleteAppointment = await pool.query(`
        DELETE FROM appointments
        WHERE id = $1
        `, [id]);

        return res.status(200).json({ message: 'Agendamento excluído com sucesso.' });

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

module.exports = {
    scheduleAppointmentController,
    listAppointmentsController,
    listAppointmentByIdController,
    updateAppointmentDateController,
    updateAppointmentPersonalInfoController,
    deleteAppointmentController
}