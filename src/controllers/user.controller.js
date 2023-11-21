// libs externas
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Hashids = require('hashids/cjs');
// my functions
const { validatorFieldFilled } = require('../utils/validateRegister.utils');
const { encryptorPassword } = require('../utils/encryptorPassword.utils');
const { createUserService } = require('../services/createUser.service');
const { validatorFieldFilledLogin } = require('../utils/validateLogin.utils');
const { getUserService } = require('../services/getUser.service');
const { authenticateService } = require('../services/authenticate.service');
const { sendMailService } = require('../services/sendMail.service');
const { getUserByIdService } = require('../services/getUserById.service');
const { updateUserService } = require('../services/updateUser.service');
const { validatorPasswordUpdate } = require('../utils/validatorsUpdatePassword.utils');
const { cpfFormatter } = require('../utils/cpfFormatter.utils');
const { generatorTokenJwtService } = require('../services/generatorTokenJwt.service');
const { updateUserPasswordService } = require('../services/updateuserPassword.service');
const { generatorPathTwoStepVerification } = require('../utils/generatorPathTwoStepVerification.utils');
const { generatorPathRecoverPassword } = require('../utils/generatorPathRecoverPassword.utils');

dotenv.config();

const registerController = async (req, res) => {
    const data = req.body;

    const dataIsvalid = validatorFieldFilled(data);

    if (dataIsvalid?.message) {
        return res.status(400).json(dataIsvalid)
    }

    try {
      
        const newUserCpfAndEmail = { email: data.email, cpf:  cpfFormatter(data.cpf) };
        const {rowCount } = await getUserService(newUserCpfAndEmail);

        if (rowCount > 0) {
            return res.status(400).json({
                message: 'Se você já possui uma conta, faça login.'
            });
        }

        const encryptedPassword = await encryptorPassword(data.password);

        const dataNewUser = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            cpf: cpfFormatter(data.cpf),
            password: encryptedPassword
        };
       
        const newUser = await createUserService(dataNewUser);
        const token = generatorTokenJwtService(newUser, '30min');
        const pathTwoStepVerification = generatorPathTwoStepVerification(
            process.env.SERVER_EXPRESS_PROTOCOL,
            process.env.SERVER_EXPRESS_HOST,
            process.env.SERVER_EXPRESS_PORT,
            token
        );
 
        sendMailService(newUser.email, 'Verificação de conta', `Clique para autenticar sua conta ->`, pathTwoStepVerification);
        return res.status(201).json({user:{...newUser}, message: 'Verifique seu email.'});

    } catch (error) {

        return res.status(500).json({ message: 'Erro interno do servidor. Tente novamente.' });
    }
}


const loginController = async (req, res) => {
    const data = req.body;
    const dataIsvalid = validatorFieldFilledLogin(data);

    if (dataIsvalid?.message) {
        return res.status(400).json(dataIsvalid)
    }

    try {

        const userExists = await getUserService({email: data.email})

        if(userExists.rowCount < 1){
            return res.status(400).json({message: 'Email ou senha inválidos.'})
        } 
        
        if(!userExists.rows[0].active){
            return res.status(400).json({message: 'Você não realizou a verificação de duas etapas.'})
        } 

        const { rows, passwordIsValid} = await authenticateService(data?.email, data?.password);



        if (!passwordIsValid) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' })
        }

        
        const token = generatorTokenJwtService(userExists.rows[0], '30min');

        return res.json({
            user: { ...rows[0] },
            token
        })

    } catch (error) {
      
        return res.json({message: 'Erro interno do servidor. Tente novamente.'})
    }
}

const twoStepVerificationController = async (req, res) => {
    const { token } = req.params;

    jwt.verify(token, process.env.JWT_SECRETY_KEY, async (err, decoded) => {
        if (err) {
            return res.status(400).json({
                message: 'Token inválido ou expirou.'
            });

        } else {
            const { id } = decoded;

            const { rows } = await getUserByIdService(id);
        
             if(rows[0].active){

                return res.status(400).json({
                    message: 'Você já utilizou esse token.'
                });
            }
            await updateUserService(id, true);
            return res.send(`Email verificado com sucesso! Faça login: <a href=http://localhost:5173/>Login</a>`);
        }

    });  

};

const recoverPasswordMessageController = async (req, res) => {
    const data = req.body;
    const email = data.email;

    const userExists = await getUserService({email: email});


    if (userExists.rowCount < 1) {
        return res.status(400).json({
            message: 'Usuário não encontrado.'
        });
    }

    const hashids = new Hashids(process.env.JWT_SECRETY_KEY);


    const hash = hashids.encode(userExists.rows[0].id); 

    const pathRecoverPassword = generatorPathRecoverPassword(
        process.env.SERVER_EXPRESS_PROTOCOL,
        process.env.SERVER_EXPRESS_HOST,
        process.env.SERVER_FRONTEND_PORT, 
        hash
    );
                                                              
    sendMailService(email, 'Alterar senha', 'Clique para alterar sua senha:', pathRecoverPassword);
    return res.status(200).json({message: 'Email enviado com sucesso.'});
     
   
};

const recoverPasswordController = async (req, res) => {

    const body = req.body;
    const password = body?.password;
    const passwordConfirm = body?.passwordConfirm;
    const passwordIsValid = validatorPasswordUpdate(password, passwordConfirm);

    if (passwordIsValid?.message) {
        return res.status(400).json(passwordIsValid);
    }

    const hash = body.hash;

    if (!hash?.trim()) {
        return res.status(400).json({

            message : 'Ocorreu um erro inesperado. Tente novamente.'

        });
    }

    const hashids = new Hashids(process.env.JWT_SECRETY_KEY);
    const id = hashids.decode(hash);
    const {rowCount } = await getUserByIdService(Number(id));

    if (rowCount < 1) {
        return res.status(400).json({
            message: 'Usuário não encontrado.'
        });
    }

    const encryptedPassword = await encryptorPassword(password);
    const userUpdated = await updateUserPasswordService(Number(id), encryptedPassword);


    sendMailService(userUpdated.email, 'Sua senha foi alterada com sucesso.', 'Agora você pode usufruir do nosso sistema', '');

    return res.status(200).json({message: 'Senha alterada com sucesso.'});
     
 
};
       

module.exports = {
    registerController,
    loginController,
    twoStepVerificationController,
    recoverPasswordMessageController,
    recoverPasswordController
}