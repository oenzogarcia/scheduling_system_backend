const { cpfFormatter } = require("./cpfFormatter.utils");

const validatorFieldFilled = (data) => {
    const keys = ['first_name', 'email', 'last_name', 'cpf', 'password'];

    for(let i=0; i<keys.length; i++){
      if(!data[keys[i]]){
        return {
            message: `O campo ${keys[i]} não foi fornecido.`
        };
      }
    }
    
    const emailIsValid = validatorEmail(data['email']);
    
    if(!emailIsValid){
         return {
            message: `Email inválido!`
        };
    }

    const firstNameIsValid = validatorFirstName(data['first_name']);
    
    if(!firstNameIsValid){
         return {
            message: `Nome inválido!`
        };
    }

    const cpfIsValid = validatorCpf(data['cpf']);
    
    if(!cpfIsValid){
         return {
            message: `Cpf precisa conter apenas números.`
        };
    }

    const lastNameIsValid = validatorLastName(data['last_name']);
    
    if(!lastNameIsValid){
         return {
            message: `Último nome inválido!`
        };
    }

    const passwordIsValid = validatorPassword(data['password']);
    
    if(!passwordIsValid){
         return {
            message: `Password precisa ter no mínimo 8 caracteres!`
        };
    }
};

const validatorEmail= (email) => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);
};

const validatorFirstName= (firstName) => {
    const regexFirstName=/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/;
    return regexFirstName.test(firstName);
};

const validatorCpf= (cpf) => {
   
    const regexCpf = /^\d+$/;
   
    return  regexCpf.test(cpf);;

};

const validatorLastName= (last_name) => {
    const regexLastName=/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/;
    return regexLastName.test(last_name);
};

const validatorPassword= (password) => {
    return password.length >= 8;
};

module.exports = {
    validatorFieldFilled
};