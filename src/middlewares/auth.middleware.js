const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const { getUserById } = require('../services/getUserById.service');

dotenv.config();

const verifyLoggedUser = async (req, res, next) => {

    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({
            message: 'Não autorizado.'
        });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = await jwt.verify(token, process.env.JWT_SECRETY_KEY);
        const { rows, rowCount } = await getUserById(id);

        if(rowCount < 1){ 
            return res.status(401).json({
            message: 'Não autorizado.'
        });
        }

        req.user = rows[0];

        next();
    } catch (error) {
        return res.status(401).json({
        message: 'Não autorizado.'
    }); 
    }   
};

module.exports = {
    verifyLoggedUser
};