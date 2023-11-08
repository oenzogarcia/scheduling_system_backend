const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');
const { validatorFieldFilled } = require('../utils/validateRegister');

const register = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilled(data);

    if(dataIsvalid?.message){
        return res.status(400).json(dataIsvalid)
    }


    try {
        const encryptedPassword = await bcrypt.hash(data.password, 10);

        const { rows } = await pool.query(
            `
            INSERT INTO users 
            (first_name, last_name, email, cpf, password )
            VALUES 
            ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [data.first_name, data.last_name,data.email,data.cpf, encryptedPassword]
        )

        return res.status(201).json(rows[0]);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

module.exports = {
    register
}