const userDAO = require("./userDAO");
const { BadRequestError } = require("../../modules/error");
const jwt = require("../../modules/jwt");

//유저생성
async function createUser(user) {
  const email = user.email;
  await userDAO.createByEamil(email);
}

//토큰발급
async function creatToken(user) {
  const email = user.email;
  const validedUser = await userDAO.findOneByEamil(email);
  console.log(validedUser);
  if (!validedUser) {
    throw new BadRequestError("이메일 없음");
  }

  const token = await jwt.login(validedUser);
  return token;
}

module.exports = { createUser, creatToken };
