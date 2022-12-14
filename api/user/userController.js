const userService = require("./userService");
const { StatusCodes } = require("http-status-codes");

//회원가입
async function signUp(req, res, next) {
  const user = req.body;
  try {
    await userService.createUser(user);
    return res.status(StatusCodes.OK).json({ message: "User Created" });
  } catch (error) {
    next(error);
  }
}

//로그인
async function login(req, res, next) {
  const user = req.body;
  try {
    const token = await userService.creatToken(user);
    return res.status(StatusCodes.OK).json(token);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signUp,
  login,
};
