const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');

const register = async (req, res) => {
    const { first_name, last_name, email, cpf, password } = req.body;

    if (!first_name) {
        return res.status(400).json({ message: 'Campo primeiro nome obrigatório.' });
    }
    if (!last_name) {
        return res.status(400).json({ message: 'Campo sobrenome obrigatório.' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Campo e-mail obrigatório.' });
    }
    if (!cpf) {
        return res.status(400).json({ message: 'Campo cpf obrigatório.' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Campo senha obrigatório.' });
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(
            `
            INSERT INTO users 
            (first_name, last_name, email, cpf, password )
            VALUES 
            ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [first_name, last_name, email, cpf, encryptedPassword]
        )

        return res.status(201).json(rows[0]);

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

module.exports = {
    register
}