const pool = require('../../../connection');
const createDoctorService = require('../services/createDoctor.service');
const getDoctorByIdService = require('../services/getDoctorById.service');
const getAllDoctorsService = require('../services/getAllDoctors.service');
const updateDoctorService = require('../services/updateDoctor.service');
const deleteDoctorService = require('../services/deleteDoctor.service');

const listDoctorsController = async (req, res) => {
    try {
        const doctors = await getAllDoctorsService();
        return res.status(200).json(doctors.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servior. Favor tente novamente.' });
    }
}

const listDoctorByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await getDoctorByIdService(id);

        if (doctor.rowCount < 1) {
            return res.status(404).json({ message: 'Este doutor não existe.' });
        }

        return res.json(doctor.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servior. Favor tente novamente.' });
    }

}

const registerDoctorController = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Campo nome está faltando.' });
    }

    try {
        const registerDoctor = await createDoctorService(name);
        return res.status(201).json(registerDoctor.rows[0]);

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servior. Favor tente novamente.' });
    }
}

const updateDoctorController = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Campo nome está faltando.' });
    }

    try {
        const doctor = await getDoctorByIdService(id);

        if (doctor.rowCount < 1) {
            return res.status(404).json({ message: 'Este doutor não existe.' });
        }

        const updateDoctor = await updateDoctorService(name, id);

        return res.status(204).json();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno do servior. Favor tente novamente.' });
    }
}

const deleteDoctorController = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await getDoctorByIdService(id);

        if (doctor.rowCount < 1) {
            return res.status(404).json({ message: 'Este doutor não existe.' });
        }

        const deleteDoctor = await deleteDoctorService(id);

        return res.status(204).json();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno do servior. Favor tente novamente.' });
    }
}

module.exports = {
    listDoctorsController,
    listDoctorByIdController,
    registerDoctorController,
    updateDoctorController,
    deleteDoctorController
}