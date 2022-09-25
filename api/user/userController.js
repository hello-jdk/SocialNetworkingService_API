const userService = require("./userService");
const { StatusCodes } = require("http-status-codes");

async function signUp(req, res, next) {
  const user = req.body;
  try {
    await userService.createUser(user);
    return res.status(StatusCodes.OK).json({ message: "User Created" });
  } catch (error) {
    next(error);
  }
}

module.exports = { signUp };
