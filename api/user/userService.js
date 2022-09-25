const userDAO = require("./userDAO");

async function createUser(user) {
  const email = user.email;
  await userDAO.createByEamil(email);
}

module.exports = { createUser };
