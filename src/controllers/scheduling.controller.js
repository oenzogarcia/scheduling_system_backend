const pool = require('../connection');
const { createAppointmentService } = require('../services/createAppointment.service');
const { deleteAppointmentService } = require('../services/deleteAppointment.service');
const { getAppointmentWithDoctorByIdService, getAppointmentWithoutDoctorByIdService, getAnyAppointmentByIdService } = require('../services/getAppointmentById.service');
const { getAppointmentsWithDoctorService, getAppointmentsWithoutDoctorService } = require('../services/getAppointments.service');
const { getSpecialtyService } = require('../services/getSpecialty.service');
const { updateAppointmentDateService, updateAppointmentPersonalInfoService } = require('../services/updateAppointment.service');
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
        const appointmentsWithDoctor = await getAppointmentsWithDoctorService(id);

        const appointmentsWithoutDoctor = await getAppointmentsWithoutDoctorService(id);

        const allAppointments = {
            confirmados: appointmentsWithDoctor.rows,
            pendentes: appointmentsWithoutDoctor.rows
        }

        return res.status(200).json(allAppointments);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const listAppointmentByIdController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const appointmentWithDoctor = await getAppointmentWithDoctorByIdService(id, userId);

        if (appointmentWithDoctor.rowCount < 1) {

            const appointmentWithoutDoctor = await getAppointmentWithoutDoctorByIdService(id, userId);

            if (appointmentWithoutDoctor.rowCount < 1) {
                return res.status(404).json({ message: 'Este agendamento não existe.' });
            }
            return res.status(200).json({ pendente: appointmentWithoutDoctor.rows[0] });
        }

        return res.status(200).json({ confirmado: appointmentWithDoctor.rows[0] });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const updateAppointmentDateController = async (req, res) => {
    const { day, hour } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    try {

        const appointment = await getAnyAppointmentByIdService(id, userId);

        if (appointment.rowCount < 1) {
            return res.status(404).json({ message: 'Este agendamento não existe.' });
        }

        const appointmentUpdate = await updateAppointmentDateService(day, hour, id)

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
        const appointment = await getAnyAppointmentByIdService(id, userId);

        if (appointment.rowCount < 1) {
            return res.status(404).json({ message: 'Este agendamento não existe.' });
        }

        const appointmentUpdate = await updateAppointmentPersonalInfoService(email, phone, id);

        return res.status(200).json({ message: 'Dados pessoais atualizados com sucesso.' });

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const deleteAppointmentController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id

    try {
        const appointment = await getAnyAppointmentByIdService(id, userId);

        if (appointment.rowCount < 1) {
            return res.status(404).json({ message: 'Este agendamento não existe.' });
        }

        const deleteAppointment = await deleteAppointmentService(id);

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