const pool = require('../../../connection');
const createDoctorService = require('../services/createDoctor.service');
const getDoctorByIdService = require('../services/getDoctorById.service');
const getAllDoctorsService = require('../services/getDoctors.service');

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
        console.log(error.message);
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
        console.log(error.message);
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
        const doctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);

        if (doctor.rowCount < 1) {
            return res.status(404).json({ message: 'Este doutor não existe.' });
        }

        const registerDoctor = await pool.query(`
        UPDATE doctors
        SET
        name = $1
        WHERE id = $2
        `, [name, id]);

        return res.status(204).json();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno do servior. Favor tente novamente.' });
    }
}

const deleteDoctorController = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);

        if (doctor.rowCount < 1) {
            return res.status(404).json({ message: 'Este doutor não existe.' });
        }

        const deleteDoctor = await pool.query(`
        DELETE FROM doctors
        WHERE id = $1
        `, [id]);

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