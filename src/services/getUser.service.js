const pool = require('../connection');

const getUser = async data => {
  const { rows, rowCount } = await pool.query(
    `
        SELECT * FROM users 
        WHERE email = $1 OR cpf = $2
        `,
    [data.email, data.cpf],
  );

  return {
    rows,
    rowCount
  };
};

module.exports = {
  getUser,
};
