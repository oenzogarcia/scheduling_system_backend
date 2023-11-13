const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const pool = require('../connection');

dotenv.config();


const schedulingController = async (req, res) => {
    const { name, email, phone, day, time, specialty } = req.body;
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRETY_KEY);

    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const specialtyInfo = await pool.query('SELECT id FROM specialties WHERE name = $1', [specialty]);
        const specialtyId = specialtyInfo.rows[0].id

        if (user.rowCount < 1) {
            return res.status(401).json({ message: 'Favor, realizar o login.' });
        }

        const scheduling = await pool.query(`
        INSERT INTO users
        (user_id, name, email, phone, day, time, specialty, specialty_id)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `, [id, name, email, phone, day, time, specialty, specialtyId]);

        return res.status(201).json({ message: `Consulta agendada com sucesso: ${scheduling.rows[0]}` });

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

module.exports = {
    schedulingController
}