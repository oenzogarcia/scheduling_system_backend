const jwt = require('jsonwebtoken');
const secretyJwt = require('../jwtSecretyKey');
const { getUserById } = require('../services/getUserById.service');

const verifyLoggedUser = async (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({
            message: 'Não autorizado.'
        });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = await jwt.verify(token, secretyJwt);
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