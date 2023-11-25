const bcrypt = require('bcrypt');

const encryptorPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

module.exports = {
    encryptorPassword
};