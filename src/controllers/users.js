const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');
const validateRegister = require('../utils/validateRegister');


const register = async (req, res) => {
    const { first_name, last_name, email, cpf, password } = req.body;

    const keyIsValid = validateRegister([first_name, last_name, email, cpf, password]);

    if (!keyIsValid) {
        return res.status(400).json({ message: 'Favor inserir todos os campos.' })
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