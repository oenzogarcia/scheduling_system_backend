const jwt = require('jsonwebtoken');
const { validatorFieldFilled } = require('../utils/validateRegister.utils');
const { encryptorPassword } = require('../utils/encryptorPassword.utils');
const { createUser } = require('../services/createUser.service');
const { validatorFieldFilledLogin } = require('../utils/validateLogin.utils');
const { getUser } = require('../services/getUser.service');
const { authenticate } = require('../services/authenticate.service');
const secretyJwt = require('../jwtSecretyKey');


const registerController = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilled(data);

    if(dataIsvalid?.message){
        return res.status(400).json(dataIsvalid)
    }
    
    try {
        const newUsercpfAndEmail = { email: data.email, cpf: data.cpf };

        const {rowCount, rows} = await getUser(newUsercpfAndEmail);

        if(rowCount > 0){
          
            return res.status(400).json({
                message: 'Se você já possui uma conta, faça login!'
            });
        }

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
        return res.status(500).json({ message: 'Erro interno do servidor. Tente novamente.' });
    }
}


const loginController = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilledLogin(data);

    if(dataIsvalid?.message){
        return res.status(400).json(dataIsvalid)
    }

    try {

        const userExists = await getUser({email: data.email})

        if(userExists.rowCount < 1){
             return res.json({message: 'Email ou senha inválidos.'})
        } 

        const { rows, passwordIsValid} = await authenticate(data?.email, data?.password);

        if(!passwordIsValid){
            return res.json({message: 'Email ou senha inválidos.'})
        }
        
        const token = jwt.sign({id: rows[0].id}, secretyJwt, {expiresIn: '3d'});

        return res.json({
            user: {...rows[0]},
            token
        })

    } catch (error) {
        console.log(error.message)
         return res.json({message: 'Erro interno do servidor. Tente novamente.'})
    }
}

module.exports = {
    registerController,
    loginController
}