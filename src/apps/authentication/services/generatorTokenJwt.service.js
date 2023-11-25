const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generatorTokenJwtService = (newUser, time) => {
    try {
        const secrety = process.env.JWT_SECRETY_KEY;
        const token = jwt.sign({id: newUser.id}, secrety, {expiresIn: time});
        return token;
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    generatorTokenJwtService
};