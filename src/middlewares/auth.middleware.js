const jwt = require('jsonwebtoken');
const secretyJwt = require('../jwtSecretyKey')

const verifyLoggedUser = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({
            message: 'Não autorizado.'
        });
    }

    const token = authorization.split(' ')[1];

    try {
        const _ = jwt.verify(token, secretyJwt);
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