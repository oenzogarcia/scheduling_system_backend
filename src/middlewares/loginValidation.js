const pool = require('../connection');
const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');

const validateLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Usuário precisa estar logado.' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, encryptedSystemPassword);

        const { rowCount } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (rowCount < 1) {
            return res.status(401).json({ message: 'Não autorizado.' });
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

module.exports = validateLogin