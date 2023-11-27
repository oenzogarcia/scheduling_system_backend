const pool = require('../../../connection');
const createSpecialtyService = require('../services/createSpecialty.service');
const deleteSpecialtyService = require('../services/deleteSpecialty.service');
const getAllSpecialtiesService = require('../services/getAllSpecialties.service');
const getSpecialtyByIdService = require('../services/getSpecialtyById.service');
const updateSpecialtyService = require('../services/updateSpecialty.service');


const createSpecialtyController = async (req, res) => {
    const { name } = req.body;

    try {
        const specialty = await createSpecialtyService(name);
        return res.status(201).json(specialty.rows[0]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const listSpecialtiesController = async (req, res) => {
    try {
        const specialties = await getAllSpecialtiesService();
        return res.status(200).json(specialties.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const listSpecialtyByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const specialties = await getSpecialtyByIdService(id);

        if (specialties.rowCount < 1) {
            return res.status(404).json({ message: 'Especialidade não existe.' });
        }

        return res.status(200).json(specialties.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }

}

const updateSpecialtyController = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
        return res.status(400).json({ message: 'Nome é obrigatório.' });
    }

    try {
        const specialties = await getSpecialtyByIdService(id);

        if (specialties.rowCount < 1) {
            return res.status(404).json({ message: 'Especialidade não existe.' });
        }

        const updateSpecialty = await updateSpecialtyService(name, id);

        return res.status(200).json({ message: 'Especialidade atualizada com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }

}




const deleteSpecialtyController = async (req, res) => {
    const { id } = req.params;

    try {
        const specialties = await getSpecialtyByIdService(id);

        if (specialties.rowCount < 1) {
            return res.status(404).json({ message: 'Especialidade não existe.' });
        }

        const deleteSpecialty = await deleteSpecialtyService(id);

        return res.status(200).json({ message: 'Especialidade excluída com sucesso.' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }

}

module.exports = {
    createSpecialtyController,
    listSpecialtiesController,
    listSpecialtyByIdController,
    updateSpecialtyController,
    deleteSpecialtyController
}