const { userModel } = require("../../models/index");
const { ConflictError } = require("../../modules/error");

async function createByEamil(email) {
  try {
    const newUser = await userModel.create({ email });
    return newUser;
  } catch (error) {
    if (error.name == "SequelizeUniqueConstraintError") {
      throw new ConflictError("중복된 이메일");
    } else {
      throw new Error("createByEamil error");
    }
  }
}

module.exports = { createByEamil };
