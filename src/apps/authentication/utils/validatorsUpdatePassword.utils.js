const validatorPasswordsFieldFilled = (password, confirmPassword) => {
  if(!password?.trim() || !confirmPassword?.trim()){
    return false;
  }

  return true;
  
};


const validatorPasswordUpdate = (password, confirmPassword) => {
  const passwordIsValid = validatorPasswordsFieldFilled(password, confirmPassword);
  if(!passwordIsValid){
    return {
      message: 'Os dois campos de senha são requeridos.'
    }
  }

  if(password !== confirmPassword){
    return {
      message: 'Os dois campos de senha precisam ser iguais.'
    }
  }

  
};


module.exports = {
    validatorPasswordUpdate
};