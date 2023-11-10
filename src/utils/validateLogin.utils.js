const validatorFieldFilledLogin = (data) => {
    const keys = ['email', 'password'];

    for(let i=0; i<keys.length; i++){
      if(!data[keys[i]]){
        return {
            message: `O campo ${keys[i]} não foi fornecido!`
        };
      }
    }
};


module.exports = {
    validatorFieldFilledLogin
};