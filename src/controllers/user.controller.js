const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { validatorFieldFilled } = require('../utils/validateRegister.utils');
const { encryptorPassword } = require('../utils/encryptorPassword.utils');
const { createUser } = require('../services/createUser.service');
const { validatorFieldFilledLogin } = require('../utils/validateLogin.utils');
const { getUser } = require('../services/getUser.service');
const { authenticate } = require('../services/authenticate.service');
const { sendMail } = require('../services/sendMail.service');
const { getUserById } = require('../services/getUserById.service');
const { updateUser } = require('../services/updateUser.service');

dotenv.config();

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
                message: 'Se você já possui uma conta, faça login.'
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
        const secrety = process.env.JWT_SECRETY_KEY;
        const token = jwt.sign({id: newUser.id}, secrety, {expiresIn: '30m'});
        const pathTwoStepVerification = `${process.env.SERVER_EXPRESS_PROTOCOL}://${process.env.SERVER_EXPRESS_HOST}:${process.env.SERVER_EXPRESS_PORT}/user/recover-password/${token}`;

        console.log(pathTwoStepVerification);

        sendMail(newUser.email, pathTwoStepVerification);
    
        return res.status(201).json({user:{...newUser}, message: 'Verifique seu email.'});

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
        
        if(!userExists.rows[0].active){
             return res.json({message: 'Você não realizou a verificação de duas etapas.'})
        } 

        const { rows, passwordIsValid} = await authenticate(data?.email, data?.password);

        if(!passwordIsValid){
            return res.json({message: 'Email ou senha inválidos.'})
        }
        
        const token = jwt.sign({id: rows[0].id}, process.env.JWT_SECRETY_KEY, {expiresIn: '3d'});

        return res.json({
            user: {...rows[0]},
            token
        })

    } catch (error) {
        console.log(error.message)
         return res.json({message: 'Erro interno do servidor. Tente novamente.'})
    }
}

const twoStepVerification = async (req, res) => {
    const {token} = req.params;
     
    jwt.verify(token, process.env.JWT_SECRETY_KEY, async (err, decoded) => {
        if (err) {
            return res.status(400).json({
                    message : 'Token inválido ou expirou.'
                });
            
        } else {
            const { id } = decoded;
            const { rows } = await getUserById(id);
            console.log(rows[0].active);
             if(rows[0].active){
                return res.status(400).json({
                    message : 'Você já utilizou esse token.'
                });
            }
            const updateFieldActive = await updateUser(id, true);
            return res.json(updateFieldActive);
        }
        });  
};

module.exports = {
    registerController,
    loginController,
    twoStepVerification
}