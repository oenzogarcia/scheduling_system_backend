const jwt = require('jsonwebtoken');
const encryptedSystemPassword = require('../systempassword');
const { validatorFieldFilled } = require('../utils/validateRegister');
const { encryptorPassword } = require('../utils/encryptorPassword');
const { createUser } = require('../services/createUser');
const { validatorFieldFilledLogin } = require('../utils/validateLogin');
const { getUser } = require('../services/getUser');
const { authenticate } = require('../services/authenticate');


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
        return res.status(500).json({ message: 'Erro interno de servidor.' });
    }
}


const loginController = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilledLogin(data);

    if(dataIsvalid?.message){
        return res.status(400).json(dataIsvalid)
    }

    try {

        const { rows, passwordIsValid} = await authenticate(data.email, data.password);

        if(!passwordIsValid){
            return res.json({message: 'dados inválidos'})
        }
        
        const token = jwt.sign({id: rows[0].id}, secretyJwt, {expiresIn: '3d'});

        console.log(rows[0].id);

        return res.json({
            user: {...rows[0]},
            token
        })

    } catch (error) {
        
    }
    

}


module.exports = {
    registerController,
    loginController
}