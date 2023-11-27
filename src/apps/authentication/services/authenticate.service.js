const pool = require('../../../connection');
const bcrypt = require('bcrypt');

const authenticateService = async (email, password) => {
     const { rows, rowCount } = await pool.query(
    `
        SELECT * FROM users 
        WHERE email = $1 
        `,
    [email],
  );

  const passwordIsValid = await bcrypt.compare(password, rows[0]?.password);

  return {
    rows,
    rowCount,
    passwordIsValid
  };
};

module.exports = {
    authenticateService
};