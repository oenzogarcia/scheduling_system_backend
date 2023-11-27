const pool = require('../../../connection');

const createSpecialtyController = async (req, res) => {
    const { name } = req.body;

    try {
        const createSpecialty = await pool.query(`
        INSERT INTO specialties
        (name)
        VALUES
        ($1)
        RETURNING *
        `, [name]);

        return res.status(201).json(createSpecialty.rows[0]);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const listSpecialtiesController = async (req, res) => {
    try {
        const specialties = await pool.query('SELECT * FROM specialties')
        return res.status(200).json(specialties.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const listSpecialtyByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const specialties = await pool.query('SELECT * FROM specialties WHERE id = $1', [id]);

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

    try {
        const specialties = await pool.query('SELECT * FROM specialties WHERE id = $1', [id]);

        if (specialties.rowCount < 1) {
            return res.status(404).json({ message: 'Especialidade não existe.' });
        }

        const updateSpecialty = await pool.query(`
        UPDATE specialties
        SET name = $1
        WHERE id = $2 
        `, [name, id]);

        return res.status(200).json({ message: 'Especialidade atualizada com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }

}

const deleteSpecialtyController = async (req, res) => {
    const { id } = req.params;

    try {
        const specialties = await pool.query('SELECT * FROM specialties WHERE id = $1', [id]);

        if (specialties.rowCount < 1) {
            return res.status(404).json({ message: 'Especialidade não existe.' });
        }

        const deleteSpecialty = await pool.query(`
        DELETE FROM specialties
        WHERE id = $1 
        `, [id]);

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