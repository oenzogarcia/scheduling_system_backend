const bcrypt = require('bcrypt');

const systemPassword = 'Nv"nWY£538,a';

const encryptedSystemPassword = bcrypt.hashSync(systemPassword, 10);

module.exports = encryptedSystemPassword;