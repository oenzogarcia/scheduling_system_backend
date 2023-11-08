const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');
const { validatorFieldFilled } = require('../utils/validateRegister');

const register = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilled(data);

    if(dataIsvalid?.message){
        return res.send(dataIsvalid)
    }else{
      return res.send(
        `salvar dado no banco!`
      )
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