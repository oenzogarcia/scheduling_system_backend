const pool = require('../../../connection');

const getUserByIdService = async id => {
  const { rows, rowCount } = await pool.query(
    `
        SELECT * FROM users 
        WHERE id = $1
        `,
    [id],
  );

  return {
    rows,
    rowCount
  };
};

module.exports = {
  getUserByIdService,
};
