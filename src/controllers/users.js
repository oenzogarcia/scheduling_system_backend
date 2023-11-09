const pool = require('../connection');
const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');
const { validatorFieldFilled } = require('../utils/validateRegister');
const { encryptorPassword } = require('../utils/encryptorPassword');
const { createUser } = require('../services/createUser');

const register = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilled(data);

    if(dataIsvalid?.message){
        return res.status(400).json(dataIsvalid)
    }
    
    try {

        const encryptedPassword = await encryptorPassword(data.password);

        const dataNewUser = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          cpf: data.cpf,
          password: encryptedPassword
        };

       
        const newUser = await createUser(dataNewUser);

        return res.status(201).json(newUser);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}

module.exports = {
    register
}