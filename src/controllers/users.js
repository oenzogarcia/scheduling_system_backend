const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');
const { validatorFieldFilled } = require('../utils/validateRegister');

const register = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilled(data);

    if (dataIsvalid?.message) {
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
            [data.first_name, data.last_name, data.email, data.cpf, encryptedPassword]
        )

        return res.status(201).json(rows[0]);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Favor informar e-mail e senha.' });
    }

    try {

        const { rows, rowCount } = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (rowCount < 1) {
            return res.status(404).json({ message: 'Usuário não cadastrado.' });
        }

        const passwordIsValid = await bcrypt.compare(password, rows[0].password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

        const token = jwt.sign({ id: rows[0].id }, encryptedSystemPassword, { expiresIn: '8h' });

        const { id, first_name, last_name } = rows[0];

        const user = {
            id,
            first_name,
            last_name,
            email
        }

        return res.status(200).json({ user, token });


    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}


module.exports = {
    register,
    login
}